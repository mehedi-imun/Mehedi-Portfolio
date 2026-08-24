# Mehedi's Portfolio

A personal portfolio website for [Mehedi](https://github.com/mehedi-imun) — showcasing projects, blog posts, experience, tools, and contact information.

## About This Project

This is a fully static portfolio site built with **Next.js**. There is no backend, database, or API layer — all content (blog posts, project data, experience) is hardcoded inline in page components, and interactive features like post **likes and comments persist to `localStorage`** on the visitor's browser.

### Features

- **Home** — animated hero with typewriter effect, featured projects, tools/skills, and contact section
- **Projects** (`/projects`) — full project showcase
- **Blog** (`/blog`) — statically rendered posts with per-post pages (`/blog/[slug]`), including like buttons and a comment section backed by `localStorage`
- **Dark mode** via `next-themes` with a theme toggle
- **Page transitions & animations** using Motion (`motion/react`)
- Fully responsive layout

## Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js 16](https://nextjs.org) (App Router) | Framework & routing |
| [React 19](https://react.dev) | UI library |
| [TypeScript](https://www.typescriptlang.org) (strict) | Type safety |
| [Tailwind CSS v4](https://tailwindcss.com) | Styling (CSS-first config in `src/app/globals.css`) |
| [shadcn/ui](https://ui.shadcn.com) (new-york style) | UI primitives (`src/components/ui/`) |
| [Motion](https://motion.dev) | Animations & transitions |
| [next-themes](https://github.com/pacocoursey/next-themes) | Dark/light mode |
| [lucide-react](https://lucide.dev) & [react-icons](https://react-icons.github.io/react-icons/) | Icons |

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## Scripts

```bash
npm run dev     # Start dev server (Turbopack)
npm run build   # Production build (also type-checks)
npm run start   # Serve production build
npm run lint    # Run ESLint
```

## Project Structure

```
src/
├── app/                  # App Router pages
│   ├── page.tsx          # Home page
│   ├── projects/         # Projects page
│   └── blog/             # Blog listing + [slug] post pages
├── components/
│   ├── sections/         # Hero, FeaturedProjects, Tools, Contact, Footer
│   ├── ui/               # shadcn/ui primitives
│   └── ...               # Header, ThemeToggle, CommentSection, etc.
└── lib/
    └── utils.ts          # cn() helper
```

## Deployment

The site deploys to [Vercel](https://vercel.com) — pushes to `main` are deployed automatically. No environment variables are required.
