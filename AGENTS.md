# AGENTS.md

Shared instruction file for AI coding tools working on this repo. `CLAUDE.md` imports this file, so Claude Code, Codex, Cursor, OpenCode and anything else that reads `AGENTS.md` all get the same rules. **Edit this file, not `CLAUDE.md`.**

Personal portfolio site for Mehedi Imun (mehedi-imun). Fully static — no backend, database, or API routes. All content lives in typed modules under `src/lib/`; likes and comments persist to `localStorage` on the visitor's browser only.

## Stack

- Next.js 16 (App Router, Turbopack default) + React 19, TypeScript `strict`
- Tailwind CSS **v4** — CSS-first config: all theme tokens live in `src/app/globals.css` (`@theme inline` + `:root`). There is **no** `tailwind.config.*` file. Plugins are registered in CSS too — `@plugin "@tailwindcss/typography";` sits directly under the `@import` lines.
- shadcn/ui (`new-york` style, see `components.json`) — primitives in `src/components/ui/`, add new ones via `npx shadcn@latest add <component>`
- `motion` v13 (`motion/react`, not `framer-motion`) for animation, `next-themes` for dark mode, `lucide-react` v1 icons
- Path alias: `@/*` → `src/*`

## Commands

```bash
npm run dev     # next dev (Turbopack is the default; no --turbopack flag needed)
npm run lint    # eslint .   (`next lint` was removed in Next.js 16)
npm run build   # also type-checks (no separate typecheck script)
npm run start   # serve the production build
```

No test framework exists. Verify changes with `lint` then `build` — `build` is the only type-check, since there is no standalone `tsc` script.

## Architecture

### Content lives in `src/lib/`, pages only render it

Four data modules are the single source of truth. Adding or editing content means editing these arrays — never inline content into a page component.

| Module | Exports | Consumed by |
|---|---|---|
| `lib/site.ts` | `siteConfig` (name, URLs, socials, keywords), `absoluteUrl()` | every metadata block, sitemap, robots, JSON-LD |
| `lib/blog.ts` | `BlogPost[]`, `blogPostSummaries`, `allTags`, `getPostBySlug()` | `/blog`, `/blog/[slug]`, sitemap |
| `lib/projects.ts` | `Project[]`, `featuredProjects`, `projectCategories`, `getProjectBySlug()`, `projectOgImage()` | `/projects`, `/projects/[slug]`, home page, sitemap |
| `lib/content.ts` | `resolveSlug()`, `assertUniqueSlugs()` | `lib/blog.ts`, `lib/projects.ts` |
| `lib/images.ts` | `localImageDimensions()` | MDX `img`, blog cover hero |
| `lib/lang.ts` | `dirFor()`, `ogLocaleFor()`, `isRtl()` | `/blog/[slug]`, blog OG image |
| `lib/mdx.ts` | `mdxOptions`, `getTableOfContents()` | `/blog/[slug]`, `/projects/[slug]` |
| `lib/experience.ts` | `experienceGroups`, `allExperience` | `/about`, `personSchema()` |

Conventions to preserve when editing these:

- `slug` is the URL and the `generateStaticParams()` key — changing one breaks the live URL and its sitemap entry.
- `description` is used **verbatim** as the page `<meta name="description">`, so keep it 120–160 chars. `excerpt` is card copy and is not an SEO field.
- `blogPostSummaries` deliberately omits `content` so the blog index does not ship every post body to the client. Use it, not `blogPosts`, for list views.

### SEO is centralised, not per-page

`lib/seo.ts` builds every JSON-LD graph (`personSchema`, `websiteSchema`, `blogPostingSchema`, `projectSchema`, `breadcrumbSchema`, `collectionPageSchema`) from the data modules and injects them through `<JsonLd>`. Schema nodes cross-reference by stable `@id` (`personId`, the website id), so a Person is declared once in `layout.tsx` and referenced everywhere else.

`app/layout.tsx` sets `metadataBase` and a title `template`; child pages set only their own `title`, `description` and `alternates.canonical`. `app/sitemap.ts` and `app/robots.ts` derive all URLs from `absoluteUrl()`. `app/opengraph-image.tsx` generates the default OG image at request time via `next/og` — routes inherit it unless they define their own.

Consequence: changing the domain, name or job title means editing `lib/site.ts` only. Do not hardcode absolute URLs anywhere else.

### Server-first, with interactivity pushed to leaves

Pages and layouts are server components that export `metadata` / `generateMetadata`. Dynamic routes pre-render via `generateStaticParams()` and call `notFound()` on an unknown slug (a real 404, not a 200 "not found" screen). Interactive pieces are separate `"use client"` leaves — `BlogIndex`, `ProjectsGrid`, `BlogPostInteractions`, `CommentSection`, `Header`, `ThemeToggle`. Keep this split: making a page a client component silently kills its `metadata` export.

Blog post bodies are MDX files in `content/blog/`. The URL comes from the **`slug` frontmatter
field**; when it is absent the filename is used instead, so a file can be renamed freely as long as
it declares its slug. `src/lib/content.ts` owns both rules for blog and projects alike: slugs must be
lowercase ASCII words joined by single hyphens, and **duplicates fail the build** naming both files —
which matters precisely because a collision between two frontmatter slugs is invisible from the
filenames. `blog.ts`
reads their frontmatter synchronously (`readFileSync` at module scope) and validates it with zod, so a
bad `date` or a missing `excerpt` fails the build instead of shipping broken JSON-LD. Keep that read
synchronous: `blogPosts`, `allTags`, `sitemap.ts` and `generateStaticParams()` all depend on it. Only
the body is async — `BlogPost.content` carries raw MDX, compiled by `<MDXRemote>` in the article's
server component and styled by `prose` classes.

`date` and `readTime` are **derived** (from `dateISO` and the body word count at 200 wpm); do not
hand-write them. Publishing is: add one `.mdx` file, `git push`.

### Projects are files too

`content/projects/*.mdx`, same shape as the blog: optional `slug` frontmatter falling back to the
filename, zod-validated frontmatter, MDX body as the case study. Adding a project is one file;
removing it is deleting that file. There is **no `id`** — React keys use `slug`. `category` is an open string, and
`projectCategories` is derived from the categories actually present, so the filter can never show an
empty one. `featuredProjects` is capped at 3 to match the `lg:grid-cols-3` homepage grid; a 4th
featured project used to leave an orphan card on its own row.

The detail page is a case study, ordered for someone scanning it: cover, then a **summary panel**
(role, year, timeline, stack, live/source links), then the MDX body, then optional `outcomes`, then
an optional `gallery`, then prev/next and a contact CTA. Role and stack deliberately sit *above* the
body — putting them at the end meant reading the whole case study to learn what the work even was.

`outcomes`, `gallery` and `timeline` are all optional; a project renders fine with none of them. In
`gallery`, `alt` is required — a screenshot nobody described is invisible to a screen reader — and
`caption` is not. Gallery images use bare filenames like everything else.

`ProjectsGrid` is a client component and therefore **must not import a runtime value** from
`lib/projects.ts` — that module reads the filesystem, and importing anything but a type pulls
`node:fs` into the client bundle and fails the build. Categories are passed in as a prop for exactly
this reason. The same rule governs `BlogIndex` and `lib/blog.ts`.

### Content layout

A post or project is one `.mdx` file. There is no scaffolding step and no folder
convention to follow.

```
content/blog/my-post.mdx
content/projects/my-project.mdx
public/                        <- images go anywhere in here
```

**Images: drop the file in `public/`, copy its path, paste it in.** The path is what
you get by removing the `public` prefix, so `public/images/hero.png` is written as
`/images/hero.png`. That single form works for `cover`, for Markdown images, for
`<Figure>` and for a project `gallery`.

Paths must start with `/` (or be a full `https://` URL). A bare `hero.png` is
rejected at build time, because the browser would resolve it relative to the
current URL — appearing to work on one page and 404ing on another.

A **missing local image fails the build**, naming the expected path. It used to
return null, which made the article hero silently disappear.

### Images

`cover` + `coverAlt` frontmatter feeds the hero, the card thumbnail, `og:image` and
JSON-LD at once; zod rejects a `cover` without a `coverAlt`. In-body Markdown images
go through `next/image`, with dimensions measured from disk at build time
(`lib/images.ts`) — which is why they must live under `public/`. Remote images have
no build-time dimensions and degrade to a plain `<img>`. `<Figure>` adds the caption
Markdown cannot express. A post with no `cover` gets a deterministic gradient tile on
its card rather than a blank space.

`next.config.ts` allowlists only `images.unsplash.com`. Do not restore the `"**"`
wildcard: it makes `/_next/image` an open proxy that anyone can route their own
images through at this project's cost.

### Comments

`Comments.tsx` renders giscus (GitHub Discussions) and returns `null` unless all four
`NEXT_PUBLIC_GISCUS_*` values are set, so an unconfigured deploy shows no widget rather than a broken
iframe. To turn it on: make the repo public, enable Discussions, install the giscus app, then take
the four ids from giscus.app and set them in Vercel. Threads are mapped by slug, so they survive a
domain change. The previous localStorage comment form and like counter are gone — both were visible
only to the person who typed them.

### View counts

`PostViews.tsx` shows a per-post view count from GoatCounter's public per-path count endpoint and
renders nothing unless `NEXT_PUBLIC_GOATCOUNTER_CODE` is set — the same env-gated convention as
`Comments.tsx`. The site-wide tracking script (which is what actually records the hit) is injected in
`layout.tsx`, also gated on that var. To turn it on: create a free GoatCounter site and set its code
(the `xxx` in `xxx.goatcounter.com`) as the env var. There is no backend of ours involved either way.

### Newsletter

`NewsletterSignup.tsx` renders a static HTML form posting directly to Buttondown's hosted endpoint,
and returns `null` unless `NEXT_PUBLIC_BUTTONDOWN_USERNAME` is set — same convention again. No SDK, no
API route: the form just posts to `https://buttondown.com/api/emails/embed-subscribe/{username}`.

Buttondown's built-in RSS-to-email automation is a paid (Basic-plan) feature. The free alternative
here is `.github/workflows/notify-subscribers.yml`: on every push to `main` that adds a file under
`content/blog/`, `scripts/notify-subscribers.mjs` diffs the commit to find newly **added** (not
edited) `.mdx` files, skips anything `draft: true`, and **sends an email to every subscriber
immediately** — no review step. This is two Buttondown API calls: `POST /v1/emails` with
`status: "draft"` to create it, then `POST /v1/emails/{id}/send-draft` to trigger the real send
right away (this is a deliberate choice made after starting with a draft-only, review-first version
— see git history on this file if that safety tradeoff needs revisiting). This needs a
`BUTTONDOWN_API_KEY` **GitHub Actions secret** (Settings → Secrets and variables → Actions on the
repo) — a different credential from `NEXT_PUBLIC_BUTTONDOWN_USERNAME`, and one this codebase and any
AI tool working on it should never see or handle directly.

### Tag archive pages

Every tag on a published post gets a crawlable `/blog/tag/{slug}` page (`app/blog/tag/[tag]/page.tsx`),
with its own canonical, metadata and JSON-LD — this is what makes a tag indexable, not just a
client-side filter. The slug comes from `tagToSlug()` in `lib/content.ts` (fs-free, so it is safe to
import from `BlogCard.tsx`, a component that ends up in the client bundle via `BlogIndex.tsx`).
`BlogIndex.tsx`'s own tag-toggle buttons still do instant client-side filtering on `/blog` itself —
the two mechanisms are complementary, not a replacement of each other.

### Writing in any language

A post sets `lang:` (BCP-47, default `"en"`); the site chrome stays English. There is no translation
pairing, no hreflang and no locale-prefixed routing. `lang` drives `inLanguage`, `og:locale`, the
`<article lang dir>` attributes and the `:lang(bn)` leading override. RTL is derived from the tag
(`ar|he|fa|ur`) in `src/lib/lang.ts`. Slugs stay ASCII regardless of the post's language, because
`resolveSlug` rejects anything else — a Bangla title needs no transliteration step, just a `slug`.

#### Two font stacks, each with a matching Bengali face

There are two stacks, declared in `@theme inline` in `globals.css` and defined in `layout.tsx`:

| Token | Latin | Bengali | Used by |
|---|---|---|---|
| `--font-sans` | Geist | Hind Siliguri | site chrome, cards, **and `.prose` headings** |
| `--font-serif` | Literata | Tiro Bangla | `.prose` body copy only |
| `--font-mono` | Geist Mono | Hind Siliguri | code, `pre`, `kbd` |

This is the Medium/Hashnode split — a sans voice announces, a serif voice reads. Literata was
engineered for Google Play Books and Tiro Bangla descends from the Murty Classical Library
typeface, so both are long-form reading faces rather than UI faces; Hind Siliguri is the opposite,
a digital-UI Bangla design that sits next to Geist without clashing.

Mixed scripts inside one post are the expected case and need no configuration: the Latin face comes
first in each stack, so the browser falls back **per character** — Latin keeps Geist/Literata,
Bengali codepoints fall through to Hind Siliguri/Tiro Bangla. Things that make that work and are
easy to break:

- `body` must carry `font-sans` (`globals.css`). Without it the variables next/font defines are never
  consumed and everything silently reverts to the system stack.
- Both Bengali faces are loaded `preload: false`. next/font emits `unicode-range`, so an English-only
  page never downloads either. Preloading would undo that.
- Literata is `preload: false` too, for the route reason rather than the script one: only `.prose`
  uses it and only two routes render `.prose`, so the default (preload on) put four unused font
  preloads on the home page.
- `.prose` sets `font-family` on the container, so `code`/`pre`/`kbd` and `figcaption` are pinned
  back explicitly. Preflight already puts code on the mono stack, but that pin is what stops a reset
  change from regressing a code block into the serif face.
- `.prose:lang(bn)` resets `letter-spacing` to `normal`. The slight negative tracking on `.prose` is
  a Latin correction; applied to Bengali it pulls conjuncts into their matras.

`ImageResponse` (OG images) ignores next/font entirely and renders only from the buffers passed in
`fonts: []`, which is why `public/fonts/*.woff` exists — WOFF, because Satori cannot read WOFF2.
Those files are copied from the `@fontsource/*` devDependencies (**both** OG routes read them:
`blog/[slug]` and `projects/[slug]` — changing one and not the other fails the build at page-data
collection). OG cards use the sans pair (Geist + Hind Siliguri); the serif pair is a reading face and
does not belong on a 1200×630 card. **Known limitation:** Satori does no
complex-script shaping, so Bengali matras and conjuncts are positioned in logical rather than visual
order in OG images. Glyphs render (not tofu), but a Bangla OG title will not look exactly like the
page. Browser rendering is unaffected.

Blog search normalizes to NFC on both sides (`BlogIndex.tsx`) — Bengali sequences like `ড়` have two
encodings that look identical, and without it the search silently misses.

The MDX pipeline lives in `src/lib/mdx.ts` (`mdxOptions`) and the element overrides in
`src/components/mdx-components.tsx`. Plugin order is load-bearing: `rehype-slug` assigns heading ids
before `rehype-autolink-headings` can link to them. Syntax highlighting is `rehype-pretty-code` +
Shiki at **build time**, so it ships zero client JS — colours are inlined as `--shiki-light` /
`--shiki-dark` custom properties and selected by the `.dark` class in `globals.css`, not by
`prefers-color-scheme` (which is what the plugin's own docs show — don't copy that selector back in).
`keepBackground: false` is deliberate so `.prose pre` keeps the token-based surface.

`getTableOfContents()` parses the raw MDX rather than the rendered tree, so it stays synchronous. It
must keep using `github-slugger` with a fresh instance per document, exactly as `rehype-slug` does,
or the anchors stop matching the heading ids. Anchored headings carry `scroll-margin-top` because the
header is `position: fixed`.

Frontmatter is validated with `strictObject`, so an unknown key is an error rather than being
silently dropped — a typo'd `tag:` or an invented `published:` would otherwise do nothing at all,
with no warning. **To publish, delete `draft: true`;** there is no `published` field.

`draft: true` keeps a post out of the index, `/rss.xml`, the sitemap and `generateStaticParams()`,
while leaving it reachable at its own URL so it can be previewed — that page sets `robots: noindex`
and shows a draft badge. This is why `getPostBySlug()` reads the internal `allPosts` (drafts
included) and every listing reads `blogPosts` (published only). Do not collapse the two.

### Cross-posting without losing the ranking

A self-hosted blog cannot match Medium's or Hashnode's built-in distribution, so use them for reach
while this site keeps the search ranking. The rule is that **the canonical URL must always point back
to mehediimun.com** — otherwise the mirror outranks the original for its own content, and this site
gets treated as the duplicate.

1. Publish here first and let it get crawled (check Search Console, usually a day or two).
2. Then mirror the post, setting the canonical to `https://mehediimun.com/blog/<slug>`:
   - **dev.to** — `canonical_url:` in the post's frontmatter.
   - **Hashnode** — "Original article URL" in post settings.
   - **Medium** — only the *Import story* tool sets `rel=canonical` correctly; pasting into a new
     draft does not, so never paste.
3. Link back to the original in the first paragraph, for readers and for the extra signal.
4. `/rss.xml` exists partly for this: most cross-posting tools take a feed URL as their source.

Never mirror a post whose canonical you cannot set.

## Gotchas

- TypeScript is pinned to `~5.9.x` on purpose: TS 7 removes the JS compiler API that `next build` type-checking uses (it only works behind `experimental.useTypeScriptCli`). Don't bump past 5.x unless enabling that flag.
- ESLint config (`eslint.config.mjs`) imports flat configs directly from `eslint-config-next/core-web-vitals` and `/typescript` — no `FlatCompat`/`@eslintrc`. Keep it that way.
- lucide-react v1 removed all brand icons (Facebook/Github/etc.). Use `react-icons/fa6` for social logos — see `sections/ContactSection.tsx`.
- Strict new React hooks lint rules are enforced (`react-hooks/set-state-in-effect`, `react-hooks/purity`). The localStorage-hydration effects in `BlogPostInteractions.tsx` and `CommentSection.tsx` carry scoped `eslint-disable-next-line` comments by design — don't delete them.
- `bg-brand` / `text-brand` / `ring-brand` appear in ~26 places but `--color-brand` is **not defined** in `globals.css`, so those utilities currently render nothing. If brand colour looks broken, define `--color-brand` in the `@theme` block rather than sprinkling raw hex values. (The OG image hardcodes `#ff914d` as the accent.)
- `next.config.ts` whitelists **all** https hosts for `next/image` (`hostname: "**"`), which makes `/_next/image` an open image proxy. Narrow it to real hosts before treating this as production-hardened.
- `next.config.ts` also 308-redirects `www.mehediimun.com` → apex, because every canonical declares the apex domain. Don't add canonicals pointing at `www`.
- Some older files import via relative paths (`../components/...`); prefer the `@/` alias for consistency.
- `components/PageTransition.tsx` is currently unused — nothing imports it.
- Deploys go to Vercel (project linked in `.vercel/`); `main` pushes deploy automatically. `NEXT_PUBLIC_SITE_URL` optionally overrides `siteConfig.url` for previews; nothing else needs env vars.

## Workflow notes

- `openspec/`, `.opencode/` and `opencode.json` are gitignored local tooling — don't commit them, and don't treat their absence in git as a mistake.
- `.env*` is gitignored.

<!-- context7 -->
Use Context7 MCP to fetch current documentation whenever the user asks about a library, framework, SDK, API, CLI tool, or cloud service — even well-known ones like React, Next.js, Prisma, Express, Tailwind, Django, or Spring Boot. This includes API syntax, configuration, version migration, library-specific debugging, setup instructions, and CLI tool usage. Use even when you think you know the answer — your training data may not reflect recent changes. Prefer this over web search for library docs.

Do not use for: refactoring, writing scripts from scratch, debugging business logic, code review, or general programming concepts.

## Steps

1. Always start with `resolve-library-id` using the library name and what to look up in the library's documentation, unless the user provides an exact library ID in `/org/project` format
2. Pick the best match (ID format: `/org/project`) by: exact name match, description relevance, code snippet count, source reputation (High/Medium preferred), and benchmark score (higher is better). If results don't look right, try alternate names or queries (e.g., "next.js" not "nextjs", or rephrase the question). Use version-specific IDs when the user mentions a version
3. `query-docs` with the selected library ID and what to look up in the library's documentation (not single words), scoped to a single concept. If the question spans multiple distinct concepts (e.g. routing and auth and caching), make a separate `query-docs` call per concept with the same library ID, unless the question is about how the concepts interact — combined queries dilute ranking and return shallow results for each topic
4. Answer using the fetched docs
<!-- context7 -->

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
