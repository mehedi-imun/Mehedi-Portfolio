// Draft (never auto-send) a Buttondown email for every blog post newly
// ADDED by this push. Free-tier alternative to Buttondown's paid
// RSS-to-email automation: this repo already treats "add a .mdx file, git
// push" as publishing (see AGENTS.md), so this hooks that exact moment
// instead of polling a feed.
//
// `status: "draft"` is set explicitly rather than relying on Buttondown's
// API default, which has changed across API versions (see
// https://buttondown.com/blog/safer-email-api-defaults) -- a post someone
// still has to review and click Send on is a much smaller mistake than one
// that goes to every subscriber unreviewed.

import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import matter from "gray-matter";

const SITE_URL = "https://mehediimun.com";
const EMPTY_SHA = "0000000000000000000000000000000000000000";

const apiKey = process.env.BUTTONDOWN_API_KEY;
const before = process.env.GIT_DIFF_BEFORE;
const after = process.env.GIT_DIFF_AFTER || "HEAD";

// Same convention as Comments.tsx / NewsletterSignup.tsx: an unconfigured
// deploy does nothing rather than failing the whole Actions run.
if (!apiKey) {
  console.log("BUTTONDOWN_API_KEY is not set -- skipping subscriber notification.");
  process.exit(0);
}

// A brand-new branch's first push has no "before" commit to diff against.
if (!before || before === EMPTY_SHA) {
  console.log("No previous commit to diff against -- skipping.");
  process.exit(0);
}

const diff = execSync(`git diff --name-status ${before} ${after} -- content/blog`, {
  encoding: "utf8",
}).trim();

const addedFiles = diff
  .split("\n")
  .filter((line) => line.startsWith("A\t"))
  .map((line) => line.slice(2).trim())
  .filter((file) => file.endsWith(".mdx"));

if (addedFiles.length === 0) {
  console.log("No newly added posts in this push -- skipping (edits to existing posts don't notify).");
  process.exit(0);
}

let hadError = false;

for (const file of addedFiles) {
  const { data } = matter(readFileSync(file, "utf8"));

  if (data.draft) {
    console.log(`Skipping draft post: ${file}`);
    continue;
  }

  const slug = data.slug ?? file.replace(/^content\/blog\//, "").replace(/\.mdx$/, "");
  const url = `${SITE_URL}/blog/${slug}`;

  try {
    const response = await fetch("https://api.buttondown.com/v1/emails", {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject: data.title,
        body: `${data.excerpt}\n\n[Read the full post](${url})`,
        status: "draft",
      }),
    });

    if (!response.ok) {
      console.error(`Failed to draft an email for "${data.title}": ${response.status} ${await response.text()}`);
      hadError = true;
      continue;
    }

    console.log(`Drafted a Buttondown email for "${data.title}" -- review and send it from the dashboard.`);
  } catch (error) {
    // A transient network failure here shouldn't fail the whole publish --
    // the post itself already shipped via the normal build/deploy, this is
    // only the notification side.
    console.error(`Network error drafting an email for "${data.title}": ${error}`);
    hadError = true;
  }
}

if (hadError) process.exitCode = 1;
