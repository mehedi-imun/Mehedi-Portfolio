#!/usr/bin/env node
/**
 * Scaffolds a post or project: the .mdx file and its asset folder together.
 *
 * The two must agree -- content/<kind>/<slug>.mdx alongside public/<kind>/<slug>/
 * -- and creating them by hand is exactly where the slug and the folder drift
 * apart. Usage:
 *
 *   npm run new:post    "Building a Custom React Hook"
 *   npm run new:project "Inventory Dashboard"
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [kind, ...titleParts] = process.argv.slice(2);
const title = titleParts.join(" ").trim();

if (kind !== "blog" && kind !== "projects") {
  console.error('First argument must be "blog" or "projects".');
  process.exit(1);
}

if (!title) {
  console.error(`Give it a title:  npm run new:${kind === "blog" ? "post" : "project"} "My Title"`);
  process.exit(1);
}

/** Matches the SAFE_SLUG rule in src/lib/content.ts. */
const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");

if (!slug) {
  console.error(`"${title}" contains no ASCII letters or digits, so it yields no usable slug.`);
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const contentFile = join("content", kind, `${slug}.mdx`);
const assetDir = join("public", kind, slug);

if (existsSync(contentFile)) {
  console.error(`${contentFile} already exists. Pick another title, or edit that file.`);
  process.exit(1);
}

const assetDirPosix = assetDir.split("\\").join("/");

const template =
  kind === "blog"
    ? `---
slug: "${slug}"
title: "${title}"
description: "One or two sentences, 120-160 characters. Used verbatim as the meta description."
excerpt: "Short line shown on the blog index card."
date: "${today}"
tags: ["Tag"]
# cover: "cover.png"                 # drop the file in ${assetDirPosix}/
# coverAlt: "What the image shows"   # required whenever cover is set
draft: true
---

<p className="lead">Opening paragraph, rendered larger than the body text.</p>

## First section

Write here. Images live beside this post, so a bare filename is enough:

![Describe the image](diagram.png)

<Figure src="diagram.png" alt="Describe the image" caption="A caption Markdown cannot express." />
`
    : `---
slug: "${slug}"
title: "${title}"
excerpt: "Short line shown on the project card."
description: "One or two sentences, 120-160 characters. Used verbatim as the meta description."
tags: ["Tag"]
cover: "cover.png"
coverAlt: "What the image shows"
category: "Web App"
year: "${today.slice(0, 4)}"
role: "Full stack developer"
stack: ["Next.js", "TypeScript"]
# timeline: "3 months"
# liveUrl: "https://example.com"
# repoUrl: "https://github.com/you/repo"
#
# What the work achieved. A case study without results is only a description.
# outcomes:
#   - "Cut checkout abandonment by a third"
#   - "Ships to production on every merge"
#
# Extra screenshots, entirely optional -- files go in ${assetDirPosix}/
# gallery:
#   - src: "screen-1.png"
#     alt: "What this screenshot shows"
#     caption: "Optional caption"
featured: false
draft: true
---

Open with the problem: what was wrong, and for whom.

## The approach

What you decided and why. Screenshots can go inline too:

![What this shows](screen-1.png)

## What it does

- First capability
- Second capability
`;

mkdirSync(join("content", kind), { recursive: true });
mkdirSync(assetDir, { recursive: true });
writeFileSync(contentFile, template);
// Keeps the empty folder in git, so the structure survives a fresh clone.
writeFileSync(join(assetDir, ".gitkeep"), "");

const label = kind === "blog" ? "post" : "project";
console.log(`Created ${label} "${title}"

  ${contentFile}   <- write here
  ${assetDirPosix}/   <- drop images here

Reference images by bare filename, e.g. ![alt](diagram.png).
It is a draft: delete \`draft: true\` to publish.`);
