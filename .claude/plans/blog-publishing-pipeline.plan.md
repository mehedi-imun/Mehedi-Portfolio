# Plan: Production-Grade Blog Publishing Pipeline

**Project**: portfolionew (Next 16, React 19, Tailwind 4, Vercel)
**Complexity**: Medium-Large (~11-16h)
**Scope confirmed**: Phases 1-4 + Giscus + Phase 6 (projects). Authoring via editor + `git push`. No Keystatic.
**Language model**: any language, mixed inline (Bangla + English in one post). **No translation, no i18n routing, no hreflang.**

---

## Context

The goal is to publish blog posts **regularly**, keep the site **SEO-friendly**, and reach
**Medium/Hashnode-grade** quality. The open question was headless CMS vs. custom setup.

**Decision: custom setup — MDX files in git. No headless CMS.**

Reasoning specific to this repo, not general preference:

1. A CMS's core value is non-technical, multi-author editing. This is a solo technical author.
2. The SEO layer is entirely build-time static (`generateStaticParams`, static sitemap). A CMS forces
   publish-webhooks-to-rebuild or ISR — new failure modes, zero SEO gain over what already exists.
3. The content is code-heavy. CMS block editors handle code blocks badly; MDX handles them natively.
4. Free and portable forever — no free-tier ceilings, no vendor pricing risk, no lock-in.
5. Content gets PR previews, diffs and rollback for free.

Caveat: what Medium/Hashnode actually sell is **distribution**, which no self-hosted setup replicates.
Mitigation is in Phase 2 — cross-post with `rel=canonical` pointing back at mehediimun.com, so they
supply reach while this site keeps the ranking.

Publishing after this work: drop one `.mdx` file in `content/blog/`, `git push`, Vercel deploys.

---

## Critical finding (verified in the browser, changes priority order)

**Blog post bodies are currently rendering completely unstyled.**

`src/app/blog/[slug]/page.tsx:103` applies `prose dark:prose-invert`, but
**`@tailwindcss/typography` is not installed** (absent from `package.json`), and Tailwind v4 does not
auto-load it. There is no `@plugin` line in `globals.css` and no `.prose` rule anywhere.

Computed styles on a live post confirm it — `.prose` matches **0 CSS rules**:

| Element | Actual | Should be |
|---|---|---|
| `h2` | 16px, weight 400 — identical to body text | ~24-30px, bold, top margin |
| `p` | `margin-bottom: 0` — paragraphs run together | ~1em spacing |
| `li` | `list-style-type: none` — no bullets | disc/decimal |
| `pre` | no background, no padding | contrasting block, padded |
| `p.lead` | no distinct styling | larger intro paragraph |

This is a bigger quality gap than the CMS question and is now **Phase 1, task 1**. Everything in
`blog.ts` is well-written prose that currently renders as an undifferentiated wall of 16px text.

---

## Critical finding 2 — the global `capitalize` class corrupts mixed-language text

`src/app/layout.tsx:82` puts `capitalize` on `<body>`, so `text-transform: capitalize` applies to the
entire site. Verified in the browser against a real Bangla+English sample:

```
input:    রিসেন্টলি ৩টা প্রজেক্টে ECC ইউজ করার পর, /plugin install ecc@ecc দিয়ে /plan আর /tdd মারি
rendered: রিসেন্টলি ৩টা প্রজেক্টে ECC ইউজ করার পর, /Plugin Install Ecc@Ecc দিয়ে /Plan আর /Tdd মারি
```

Bangla is unaffected (Bengali is a unicase script), but **every lowercase English token gets
Title-Cased**. For a dev blog full of slash commands this is content corruption: `/plan` renders as
`/Plan`, `/tdd` as `/Tdd`, `/plugin install ecc@ecc` as `/Plugin Install Ecc@Ecc`.

It is already corrupting the existing English site. Live rendered text on a post page:

| Source | Rendered |
|---|---|
| "Back to Blog" | "Back To Blog" |
| "7 min read" | "7 Min Read" |
| "Why I Switched to Tailwind CSS" | "Why I Switched To Tailwind CSS" |

Only the article body escapes it, via the `normal-case` at `blog/[slug]/page.tsx:103`. Post titles,
dates, `readTime`, tags and **all of `BlogCard.tsx`** (which has no `normal-case`) inherit it.

**Fix:** remove `capitalize` from `<body>` and apply it deliberately where a design actually wants it
(likely nav/section labels only). This is a visual change across the site, so screenshot `/`,
`/about`, `/projects`, `/blog` before and after. Do this before writing any Bangla content.

---

## Critical finding 3 — no Bengali font is loaded

`src/app/layout.tsx:10-20` loads Geist and Geist_Mono with `subsets: ["latin"]`. Geist contains no
Bengali glyphs. Verified: Bengali text resolves to the generic fallback stack
(`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, ..., "Noto Sans", Arial, sans-serif`) with no
Bengali family in it — so each OS picks its own last-resort face (Nirmala UI on Windows, Noto Sans
Bengali on Android, Bangla Sangam MN on Apple). Inconsistent line metrics and weight per visitor.

---

## Other gaps found

| Gap | Location | Impact |
|---|---|---|
| No RSS feed | no `/rss.xml` route | No syndication, feed readers, or auto cross-post |
| All posts share one OG image | `src/lib/seo.ts:83` → `/opengraph-image` | Every social share looks identical — direct CTR loss |
| `dateModified` == `datePublished` always | `src/lib/seo.ts:78` | Updating a post signals nothing to Google |
| `readTime` hand-typed | `src/lib/blog.ts:29` `"5 min read"` | Will drift from reality |
| No draft state | — | Can't commit work-in-progress |
| No related-post links | `blog/[slug]/page.tsx` | Orphaned pages, shallow internal linking |
| Comments/likes are fake | `CommentSection.tsx:32`, `BlogPostInteractions.tsx:16` | `localStorage` only — a reader's comment is visible to nobody else; likes reset per browser |

**Already solid — do not touch:** the JSON-LD graph in `src/lib/seo.ts` (`BlogPosting`,
`BreadcrumbList`, `CollectionPage`, `Person`, `WebSite` with shared `@id`), `sitemap.ts` using real
publication dates, `robots.ts`, per-post canonical + OG + Twitter metadata, www→apex 308 in
`next.config.ts`.

---

## Patterns to reuse (mirror these, don't reinvent)

| Category | Source | Pattern |
|---|---|---|
| Data module API | `src/lib/blog.ts:317-336` | Typed array export + `getPostBySlug()` + derived `blogPostSummaries` / `allTags` |
| Doc comments | `src/lib/blog.ts:7,321` | `/** */` explaining *why* a field exists |
| Config source of truth | `src/lib/site.ts:8,44` | `as const` object; `absoluteUrl()` for every absolute link |
| Schema builders | `src/lib/seo.ts:67` | One pure function per schema type, taking the domain object |
| Server/client split | `src/components/BlogIndex.tsx:14-17` | Route stays a server component for `metadata`; interactivity in a child client component |
| OG image generation | `src/app/opengraph-image.tsx` | `ImageResponse`, exported `alt`/`size`/`contentType`, inline styles, `#0a0a0a` bg + `#ff914d` accent |
| Static params | `blog/[slug]/page.tsx:18` | `generateStaticParams` from the post list |

---

## Phase 1 — Fix rendering + MDX content pipeline

**Design constraint: keep `src/lib/blog.ts`'s public API identical.** Swap only its internals
(literal array → filesystem read). Then `sitemap.ts`, `seo.ts`, `blog/page.tsx` and `BlogIndex.tsx`
keep working untouched.

1. **Install and register `@tailwindcss/typography`** — `@plugin "@tailwindcss/typography";` in
   `src/app/globals.css`. Tune `--tw-prose-*` vars to the existing token palette; add a `.lead` rule.
   Verify the table above flips to real values.
2. `content/blog/*.mdx` — frontmatter: `title, description, excerpt, date, updated?, tags, draft?`
3. `gray-matter` for frontmatter + **a zod schema to validate it** (zod already in the tree). A
   typo'd date fails the build instead of silently shipping broken JSON-LD.
4. `next-mdx-remote/rsc` compiles bodies in the already-`async` server component.
5. Frontmatter read stays **synchronous** (`readFileSync` at module scope) so `blogPosts`, the
   sitemap and RSS keep their current sync shape. Only the *body* becomes async.
6. Derive `readTime` from word count and the `date` display string from `dateISO` — stop
   hand-maintaining both.
7. Migrate the 6 existing posts. **Convert `<pre><code>` to fenced ``` blocks** (see Risks).

**Rejected:** Contentlayer (unmaintained), `@next/mdx` route-based MDX (makes listing for
index/sitemap/RSS awkward), Velite (good, smaller ecosystem than the boring option).

## Phase 2 — Close the SEO gaps

- `src/app/rss.xml/route.ts` — RSS 2.0, plus `alternates.types` in the root layout metadata
- `src/app/blog/[slug]/opengraph-image.tsx` — per-post OG image with the post title, mirroring
  `src/app/opengraph-image.tsx`
- `dateModified` from frontmatter `updated` in `blogPostingSchema()`
- Drafts excluded from index, sitemap and `generateStaticParams`; `robots: noindex` if hit directly
- Related posts by tag overlap in the article footer — internal linking + crawl depth
- `Blog` schema on `/blog`; visible author byline in the article header
- Write up the canonical cross-posting workflow (Medium/Hashnode/dev.to → canonical here)

## Phase 3 — Reading quality

- **`rehype-pretty-code` + Shiki** — build-time highlighting, zero client JS, themed to the existing
  dark mode
- `rehype-slug` + `rehype-autolink-headings` → linkable headings, and a ToC from the heading tree
- `remark-gfm` → tables, footnotes, task lists
- Typed MDX component map wiring `next/image` (LCP) and the `prose` container
- **Note:** `<body>` carries a global `capitalize` class (`src/app/layout.tsx:82`), which is why the
  article container needs `normal-case` (`blog/[slug]/page.tsx:103`). Any new content wrapper must
  keep `normal-case` or headings will render Title-Cased.

## Phase 4 — Multi-language content (any language, mixed inline)

**Model: no translation.** Each post is written in whatever language the author wants, and may mix
scripts freely inside one post (Bangla prose with English technical terms is the target case). There
is no translation pairing, no `hreflang`, no locale-prefixed routes, and no i18n framework. The site
chrome stays English.

1. **Automatic per-character font fallback.** Do not switch fonts per post — build one stack and let
   the browser pick per codepoint:
   ```
   font-family: var(--font-geist-sans), var(--font-bengali), sans-serif;
   ```
   Geist has no Bengali glyphs, so Bengali characters fall through to the Bengali face automatically,
   per character, with no configuration. Latin font must come **first** so English keeps Geist.
2. **Load the Bengali face** — **`Noto_Sans_Bengali`** (chosen for maximum conjunct coverage, which
   matters for technical Bangla) via `next/font/google` in `src/app/layout.tsx`,
   `subsets: ["bengali"]`, **`preload: false`**. `next/font` emits `@font-face` with `unicode-range` per subset, so the
   Bengali file is downloaded only when Bengali codepoints are actually on the page — English-only
   pages pay nothing.
3. **`lang` frontmatter** — a free BCP-47 string, default `"en"`. Applied to the `<article>` element,
   `inLanguage` in `blogPostingSchema()`, and `og:locale` (`bn_BD` for Bangla). For mixed content, set
   it to the post's **primary** language; do not attempt per-sentence tagging.
4. **Replace the 5 hardcoded `inLanguage: "en"`** at `src/lib/seo.ts:62,80,140`, `src/app/page.tsx:36`,
   `src/app/about/page.tsx:34`, `src/app/contact/page.tsx:30`, plus `locale: "en_US"` at
   `src/lib/site.ts:15`. Static pages stay `en`; only posts vary.
5. **Line-height per script.** Bengali stacks matras above and below the baseline; prose line-height
   ~1.6 is cramped and glyphs collide. Add `:lang(bn)` prose overrides at ~1.8-2.0. Mixed English
   inside a `bn` article inherits the taller leading, which is correct — the line box must fit the
   tallest glyph anyway.
6. **Satori/OG fonts — mandatory, not optional.** `ImageResponse` does **not** use system or
   `next/font` fonts. A Bangla title renders as tofu (□□□) unless a Bengali TTF is loaded and passed
   in `fonts: []`. Load both a Latin and a Bengali static TTF so mixed-script titles render; Satori
   does per-glyph fallback across the array. Affects `src/app/blog/[slug]/opengraph-image.tsx` from
   Phase 2. Variable fonts need a static instance — fetch the static `NotoSansBengali-Regular.ttf`
   and `-Bold.ttf`, so the same family serves both the web font and the OG image and the two cannot
   drift apart.
7. **Search normalization.** `src/components/BlogIndex.tsx:24-25` uses `.toLowerCase().includes()`.
   Bengali conjuncts can be encoded in different Unicode normalization forms, so a visually identical
   word silently fails to match. Chain `.toLowerCase().normalize("NFC")` on both query and content.
8. **RTL readiness** (cheap now, expensive later): derive `dir="rtl"` from the `lang` value for
   `ar|he|fa|ur`. Costs a few lines and avoids a refactor if the author ever writes in those scripts.
9. **Slugs stay ASCII** — the filename is the slug, so a Bangla title with an English filename needs
   no transliteration step.

**Depends on Critical finding 2** — the global `capitalize` must be removed first, or every lowercase
English term inside Bangla prose renders Title-Cased.

## Phase 4b — Images in posts

Currently there is **no image support at all**: `BlogPost` has no image field and
`src/components/BlogCard.tsx` renders no image.

- **`cover:` + `coverAlt:` frontmatter** — feeds four consumers at once: the post hero, the blog-card
  thumbnail, the per-post OG image, and JSON-LD `image` (which currently hardcodes
  `absoluteUrl("/opengraph-image")` at `src/lib/seo.ts:83`). A real cover image is also a
  precondition for Google Discover eligibility.
- **In-body images** — `![alt](/blog/my-post/diagram.png)` mapped to `next/image` through
  `src/components/mdx-components.tsx`.
- **`rehype-unwrap-images`** — Markdown wraps images in `<p>`, which breaks `next/image` layout and
  makes `<figure>` invalid nesting.
- **Dimensions** — Markdown image syntax carries no width/height, but `next/image` requires them.
  Read them at build time with `image-size` for repo-local files; remote URLs need explicit props.
- **`<Figure>`** MDX component for captions — the thing plain Markdown cannot express.
- **Storage** — `public/blog/<slug>/`. Add `priority` + `sizes` on the cover image (it is the LCP
  element).
- **Security note:** `next.config.ts` currently allows `hostname: "**"`, making `/_next/image` an open
  image proxy that third parties can route their own images through at the project's cost. Narrow it
  to the hosts actually in use once known.

## Phase 5 — Real comments (Giscus)

- Replace `src/components/CommentSection.tsx` with Giscus (GitHub Discussions-backed, free, no DB,
  no moderation panel to build). Needs a public repo + Discussions enabled + the giscus app.
- `src/components/BlogPostInteractions.tsx`: drop the fake like counter, keep the share row. (Real
  like/view counts would need Upstash Redis — out of scope; revisit if wanted.)

## Phase 6 — Projects: file-per-project structure

**Goal: add a project by dropping one file; remove it by deleting that file.** Fully static, no
backend, no database. Reuses Phase 1's pipeline verbatim (`gray-matter` + zod + `next-mdx-remote` +
the same `src/components/mdx-components.tsx`), so this is cheap once Phase 1 lands.

**Decisions:** freeform MDX body for detail pages; all 6 existing dummy projects converted so the site
keeps working, to be edited or deleted as real work replaces them.

### Current friction

| Friction | Where | Why it hurts |
|---|---|---|
| `id: number` is manual | `src/lib/projects.ts:26` | Adding a project means picking the next id; deleting leaves a gap. Duplicates `slug`. Used only as a React key. |
| One 174-line shared file | `src/lib/projects.ts` | Add/remove = surgery mid-file |
| `category` closed union in two places | `src/lib/projects.ts:11` and `:22` | Adding "API"/"CLI" means editing the type *and* the array |
| Detail page is a fixed template | `src/app/projects/[slug]/page.tsx:103-136` | Every project forced into Overview -> What it does -> Stack -> Role |

### Two latent bugs to fix here

1. **`featuredProjects` has no limit.** `src/lib/projects.ts:165` filters on `featured` with no
   `.slice()`. The homepage grid is `lg:grid-cols-3` (`FeaturedProjects.tsx`), so a 4th featured
   project leaves one orphan card alone on a second row.
2. **`projectOgImage()` is Unsplash-only.** `src/lib/projects.ts:172-174` appends
   `?w=1200&h=630&fit=crop&auto=format` — Unsplash/Imgix params. A real project with a local cover
   (`/projects/foo/cover.png`) yields a **relative** URL with meaningless params, fed into `og:image`
   (`[slug]/page.tsx:42`), `twitter.images` (`:53`) and JSON-LD `image` (`src/lib/seo.ts:99`). OG
   images must be absolute — social previews break silently on every real project.

### Tasks

1. **`content/projects/<slug>.mdx`** — frontmatter carries the structured fields:
   `title, excerpt, description, tags, cover, coverAlt, category, year, role, stack, liveUrl?,`
   `repoUrl?, featured?, order?, draft?, lang?`
2. **MDX body replaces `overview` + `highlights`.** Both fields are dropped from the `Project`
   interface; the case study becomes freeform content rendered through the shared prose container.
   Keep Stack / My role / live+source buttons as frontmatter-driven chrome around it.
3. **slug = filename. Drop `id` entirely.** Update the two React keys from `project.id` to
   `project.slug` (`src/components/ProjectsGrid.tsx:53`, `src/components/sections/FeaturedProjects.tsx:38`).
4. **Derive `projectCategories`** from the categories actually present, prefixed with "All". The
   filter can then never show an empty category, and adding a category means only writing it in a
   frontmatter field. Keep the type open (`string`) with zod validating against the derived set.
5. **Ordering** — sort by `order` when present, then `year` descending. `featuredProjects` uses the
   same sort and **`.slice(0, 3)`** to match the grid.
6. **Fix the OG image** — add `src/app/projects/[slug]/opengraph-image.tsx` mirroring the blog's
   (Phase 2) and the site-level `src/app/opengraph-image.tsx`. Reduce `projectOgImage()` to a
   host-agnostic helper that returns an absolute URL via `absoluteUrl()` for the raw cover, with no
   Unsplash-specific params.
7. **zod validation** — required fields, `liveUrl`/`repoUrl` as URLs, `year` format, category in the
   known set, and **duplicate-slug detection** (two files with the same slug currently produce
   ambiguous `generateStaticParams` entries).
8. **`draft: true`** — excluded from `/projects`, the homepage, `sitemap.ts` and
   `generateStaticParams`; `robots: noindex` if hit directly. Lets a work-in-progress project be
   committed without publishing.
9. **Keep `src/lib/projects.ts`'s public API identical** (`projects`, `featuredProjects`,
   `getProjectBySlug`, `projectCategories`, `projectOgImage`) so `src/app/projects/page.tsx`,
   `ProjectsGrid.tsx`, `FeaturedProjects.tsx`, `src/app/sitemap.ts` and `src/lib/seo.ts` need no
   changes beyond the key and OG fixes. Same containment trick as the blog.
10. **Migrate the 6 dummy projects** into the new structure.

### Adding a project, after this lands

```
content/projects/my-new-thing.mdx     <- create this one file
public/projects/my-new-thing/cover.png
```
Nothing else. The index, homepage featured grid, category filter, sitemap, JSON-LD, OG image and
static route all derive from it. Deleting the file removes it everywhere.

---

## Files

| File | Action | Why |
|---|---|---|
| `package.json` | UPDATE | `@tailwindcss/typography`, `gray-matter`, `next-mdx-remote`, `rehype-pretty-code`, `shiki`, `rehype-slug`, `rehype-autolink-headings`, `remark-gfm` |
| `src/app/globals.css` | UPDATE | `@plugin "@tailwindcss/typography"` + prose token tuning + `.lead` |
| `content/blog/*.mdx` | CREATE (6) | Migrated post bodies |
| `src/lib/blog.ts` | UPDATE | Internals → filesystem read + zod frontmatter validation; **public API unchanged** |
| `src/lib/seo.ts` | UPDATE | `dateModified` from `updated`; per-post OG image URL; `Blog` schema |
| `src/app/blog/[slug]/page.tsx` | UPDATE | `MDXRemote` instead of `dangerouslySetInnerHTML`; byline; related posts |
| `src/app/blog/[slug]/opengraph-image.tsx` | CREATE | Per-post OG image |
| `src/app/rss.xml/route.ts` | CREATE | RSS 2.0 feed |
| `src/app/sitemap.ts` | UPDATE | Exclude drafts; use `updated` for `lastModified` |
| `src/components/mdx-components.tsx` | CREATE | Typed MDX component map + image/Figure components |
| `src/app/layout.tsx` | UPDATE | Bengali font w/ `preload:false`; **remove global `capitalize`**; RSS alternate |
| `src/components/BlogCard.tsx` | UPDATE | Cover image slot; inherits the `capitalize` fix |
| `content/projects/*.mdx` | CREATE (6) | Migrated projects, one file each |
| `src/lib/projects.ts` | UPDATE | Filesystem read + zod; drop `id`/`overview`/`highlights`; derived categories; fixed `projectOgImage` |
| `src/app/projects/[slug]/page.tsx` | UPDATE | MDX body instead of the fixed template |
| `src/app/projects/[slug]/opengraph-image.tsx` | CREATE | Per-project OG image |
| `src/components/ProjectsGrid.tsx` | UPDATE | Key by `slug`; derived category list |
| `src/components/sections/FeaturedProjects.tsx` | UPDATE | Key by `slug`; respects the 3-item limit |
| `src/lib/site.ts` | UPDATE | `locale` becomes a per-post-overridable default |
| `public/blog/<slug>/*` | CREATE | Post images |
| `public/fonts/*.ttf` | CREATE | Static Latin + NotoSansBengali TTFs for Satori OG rendering |
| `src/components/CommentSection.tsx` | REPLACE | Giscus |
| `src/components/BlogPostInteractions.tsx` | UPDATE | Drop fake likes, keep shares |

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **MDX parses `{` as JSX** — existing bodies contain `{{ opacity: 0 }}` (`blog.ts:117`) and `{ staggerChildren }` (`blog.ts:125`) inside `<pre>` | **High** | Build breaks during migration | Convert HTML `<pre><code>` to fenced ``` blocks — MDX treats fence contents as literal. Needed for Phase 3 highlighting anyway. Migrate **one post first**, build, then the rest. |
| Slug changes de-index posts | Low | Lost rankings | Slug = filename; keep all 6 identical. Diff `sitemap.xml` output before/after. |
| Typography plugin restyles non-blog pages | Low | Visual regression | `prose` is opt-in per container; only the article body uses it. Screenshot `/`, `/about`, `/projects` after. |
| Giscus needs a public repo + Discussions | Medium | Phase 5 blocked | Confirm repo visibility before starting; fall back to removing the fake comments |
| `readFileSync` at module scope | Low | Edge-runtime incompatibility | Blog routes are static/Node-rendered; keep them off the edge runtime |
| HTML-escaped entities in bodies (`&lt;`, `&gt;`) | Medium | Literal `&lt;` visible in code blocks | Unescape during migration — fenced blocks need raw characters |
| **Removing global `capitalize` changes the whole site's look** | High | Unintended visual regression on non-blog pages | Screenshot `/`, `/about`, `/projects`, `/blog` before/after; re-add `capitalize` only on the specific labels the design wants |
| Bangla OG titles render as tofu in Satori | **High** if not handled | Broken social previews | Load static Bengali + Latin TTFs into `fonts: []`; test with a real Bangla title before shipping |
| Geist and Noto Sans Bengali have different x-heights | Medium | Mixed-script lines look mismatched | Tune with `size-adjust` / `ascent-override` on the @font-face if the sample post looks off; swap face if it cannot be reconciled (one-line change) |
| Dropping `overview`/`highlights` loses written content | Medium | Text lost in migration | Move both into the MDX body during conversion, one project at a time; diff the rendered page |
| Removing `id` breaks a React key | Low | Console warnings / render bugs | `slug` is unique and zod-enforced; only 2 call sites |
| Bengali font weight added to every page | Low | Slower loads | `preload: false` + `unicode-range` subsetting means no download unless Bengali codepoints are present — verify in the Network panel on an English page |

---

## Verification

```bash
npx tsc --noEmit
npx eslint .
npx next build                                       # must still emit 6 static /blog/* routes
curl -s localhost:3000/rss.xml | head -30
curl -s localhost:3000/sitemap.xml | grep -c "<url>"  # compare count before/after
```

Then, in the browser:

1. **Re-run the computed-style probe** on `/blog/getting-started-with-nextjs` — `h2` must be
   > 16px and bold, `p` must have non-zero `margin-bottom`, `li` must have a `list-style-type`,
   `pre` must have a background. This is the proof Phase 1 task 1 worked.
2. Console clean — no hydration errors, no key warnings (both were just fixed; don't regress).
3. All 6 posts render with highlighted code and no stray `{` / `&lt;` artifacts.
4. Screenshot `/`, `/about`, `/projects` to confirm the typography plugin changed nothing outside
   the article body.
5. Rich Results Test on one post URL — `BlogPosting` + `BreadcrumbList` still valid.
6. Per-post OG image: open `/blog/<slug>/opengraph-image` directly, confirm the post title renders.
7. **Mixed-language probe** — publish a test post containing
   `রিসেন্টলি ৩টা প্রজেক্টে ECC ইউজ করার পর, /plugin install ecc@ecc দিয়ে /plan আর /tdd মারি`
   and confirm: slash commands stay lowercase (no `/Plan`, no `Ecc@Ecc`), Bengali uses the loaded
   webfont rather than a system fallback, line-height is comfortable, and its OG image shows Bangla
   glyphs rather than boxes.
8. **Font cost check** — Network panel on an English-only page must show **no** Bengali font request.
9. **Search check** — type a Bengali word into the blog index filter and confirm it matches.
10. **Projects check** — `next build` still emits 6 static `/projects/*` routes; category filter shows
    only non-empty categories; homepage featured grid shows exactly 3 cards; open
    `/projects/<slug>/opengraph-image` and confirm it renders.
11. **Add/remove drill** — create `content/projects/test-thing.mdx`, confirm it appears on
    `/projects`, in the sitemap and as a static route; delete the file and confirm it disappears
    everywhere with no other edits.

## Acceptance

- [ ] Post bodies visibly styled — headings, spacing, bullets, code blocks
- [ ] Publishing a post = add one `.mdx` file + `git push`; nothing else
- [ ] Bad frontmatter fails the build with a readable zod error
- [ ] `/rss.xml` valid; per-post OG images distinct; drafts absent from sitemap and index
- [ ] Code blocks syntax-highlighted with zero added client JS
- [ ] Comments are real and shared across visitors
- [ ] All 6 existing slugs unchanged
- [ ] A post can be written in any language, mixing scripts inline, with no per-post config beyond `lang`
- [ ] No text-transform corruption anywhere (`/plugin install` stays lowercase)
- [ ] Bengali renders in a loaded webfont, identically across OSes, at readable line-height
- [ ] Bangla OG images render real glyphs
- [ ] Images work from both Markdown syntax and a captioned `<Figure>`
- [ ] Adding a project = one new `.mdx` file; removing = deleting it. No id, no array edit, no registry
- [ ] Homepage featured grid never shows an orphan 4th card
- [ ] Project OG images are absolute and work for local covers, not just Unsplash
- [ ] Duplicate slugs fail the build
