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

Blog post bodies are MDX files in `content/blog/<slug>.mdx` — the filename **is** the slug. `blog.ts`
reads their frontmatter synchronously (`readFileSync` at module scope) and validates it with zod, so a
bad `date` or a missing `excerpt` fails the build instead of shipping broken JSON-LD. Keep that read
synchronous: `blogPosts`, `allTags`, `sitemap.ts` and `generateStaticParams()` all depend on it. Only
the body is async — `BlogPost.content` carries raw MDX, compiled by `<MDXRemote>` in the article's
server component and styled by `prose` classes.

`date` and `readTime` are **derived** (from `dateISO` and the body word count at 200 wpm); do not
hand-write them. `draft: true` excludes a post from every consumer at once. Publishing is: add one
`.mdx` file, `git push`.

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
