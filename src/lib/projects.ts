export interface Project {
  id: number;
  slug: string;
  title: string;
  /** Short line used on cards. */
  excerpt: string;
  /** 120-160 chars, used verbatim as the meta description on the detail page. */
  description: string;
  tags: string[];
  image: string;
  category: "Web App" | "Website" | "Mobile";
  year: string;
  role: string;
  featured: boolean;
  overview: string;
  highlights: string[];
  stack: string[];
  liveUrl?: string;
  repoUrl?: string;
}

export const projectCategories = ["All", "Web App", "Website", "Mobile"] as const;

export const projects: Project[] = [
  {
    id: 1,
    slug: "e-commerce-platform",
    title: "E-Commerce Platform",
    excerpt: "A modern e-commerce platform built with Next.js and Tailwind CSS.",
    description:
      "A production e-commerce platform built with Next.js, TypeScript and Tailwind CSS, featuring server-rendered catalogue pages, cart state and Stripe checkout.",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    category: "Web App",
    year: "2025",
    role: "Full stack developer",
    featured: true,
    overview:
      "A full storefront built around server-rendered catalogue pages so that every product URL is independently crawlable and cacheable. Product data is fetched at the server boundary, cart state lives on the client, and checkout hands off to Stripe.",
    highlights: [
      "Server-rendered product and category pages for fast first paint and clean indexable URLs",
      "Cart and wishlist state persisted client-side and reconciled against server inventory on checkout",
      "Stripe checkout with webhook-driven order fulfilment and idempotent event handling",
      "Faceted search across category, price band and availability without a full page reload",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Stripe"],
  },
  {
    id: 2,
    slug: "portfolio-website",
    title: "Portfolio Website",
    excerpt: "A responsive portfolio website with dark/light theme toggle.",
    description:
      "A responsive developer portfolio built with React, Tailwind CSS and Framer Motion, with system-aware dark mode and animated section transitions.",
    tags: ["React", "Framer Motion", "Tailwind"],
    image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5",
    category: "Website",
    year: "2025",
    role: "Designer and developer",
    featured: true,
    overview:
      "A personal portfolio designed to load fast on a mobile connection while still feeling animated. Theme preference follows the operating system by default and is persisted once the visitor chooses explicitly.",
    highlights: [
      "System-aware dark and light themes with no flash of incorrect theme on first paint",
      "Motion-driven section reveals that respect the prefers-reduced-motion setting",
      "Fully responsive layout from 320px through ultrawide breakpoints",
      "Accessible navigation with keyboard focus states and aria-current on the active route",
    ],
    stack: ["React", "Next.js", "Tailwind CSS", "Framer Motion"],
  },
  {
    id: 3,
    slug: "blog-platform",
    title: "Blog Platform",
    excerpt: "A minimal blog platform with markdown support.",
    description:
      "A minimal MDX-powered blog platform built on Next.js, with statically generated post pages, tag filtering and per-post OpenGraph images.",
    tags: ["Next.js", "MDX", "Tailwind"],
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    category: "Web App",
    year: "2024",
    role: "Full stack developer",
    featured: true,
    overview:
      "A file-based publishing setup where each post is an MDX document. Posts are statically generated at build time, so the reading experience is a static document with no client-side data fetching.",
    highlights: [
      "MDX authoring with embedded React components inside prose",
      "Statically generated post routes via generateStaticParams",
      "Per-post OpenGraph images generated at the edge",
      "Tag-based filtering and a reading-time estimate derived from word count",
    ],
    stack: ["Next.js", "MDX", "Tailwind CSS", "TypeScript"],
  },
  {
    id: 4,
    slug: "weather-app",
    title: "Weather App",
    excerpt: "A weather application with interactive maps and hourly forecasts.",
    description:
      "A React weather application with interactive radar maps, hourly and seven-day forecasts, geolocation search and cached API responses.",
    tags: ["React", "API", "Tailwind"],
    image: "https://images.unsplash.com/photo-1532074205216-d0e1f4b87368",
    category: "Web App",
    year: "2024",
    role: "Frontend developer",
    featured: false,
    overview:
      "A weather client that keeps the interface responsive on a slow connection by caching forecast responses and rendering the last known state while a refresh is in flight.",
    highlights: [
      "Interactive radar overlay with pan and zoom on a tiled map",
      "Hourly and seven-day forecast views sharing a single normalised data model",
      "Geolocation lookup with a typeahead city fallback",
      "Response caching with stale-while-revalidate so the UI never blanks on refetch",
    ],
    stack: ["React", "TypeScript", "Tailwind CSS", "OpenWeather API"],
  },
  {
    id: 5,
    slug: "task-manager",
    title: "Task Manager",
    excerpt: "A productivity app for managing daily tasks and projects.",
    description:
      "A productivity app built with Next.js, TypeScript and Firebase, offering real-time task sync, project grouping and offline-tolerant optimistic updates.",
    tags: ["Next.js", "TypeScript", "Firebase"],
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b",
    category: "Web App",
    year: "2023",
    role: "Full stack developer",
    featured: false,
    overview:
      "A task manager where every mutation is applied optimistically and reconciled against Firestore, so the interface stays usable on an unreliable connection.",
    highlights: [
      "Real-time multi-device sync backed by Firestore listeners",
      "Optimistic create, edit and reorder with rollback on write failure",
      "Projects, labels and due-date grouping over a single task collection",
      "Email and OAuth authentication with per-user security rules",
    ],
    stack: ["Next.js", "TypeScript", "Firebase", "Tailwind CSS"],
  },
  {
    id: 6,
    slug: "restaurant-website",
    title: "Restaurant Website",
    excerpt: "A responsive website for a local restaurant with online ordering.",
    description:
      "A responsive restaurant website with an online ordering flow, built with React, Styled Components and a Node.js ordering API with local schema markup.",
    tags: ["React", "Styled Components", "Node.js"],
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    category: "Website",
    year: "2023",
    role: "Full stack developer",
    featured: false,
    overview:
      "A local restaurant site where the menu is the primary landing surface. Menu items are server-rendered and marked up with local business structured data so opening hours and location surface directly in search results.",
    highlights: [
      "Server-rendered menu with Restaurant and Menu structured data",
      "Online ordering flow with pickup and delivery slot selection",
      "Node.js ordering API with order confirmation email",
      "Local business schema exposing address, hours and price range",
    ],
    stack: ["React", "Styled Components", "Node.js", "Express"],
  },
];

export const featuredProjects = projects.filter((project) => project.featured);

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

/** Unsplash source images need explicit dimensions to be valid OG images. */
export function projectOgImage(project: Project): string {
  return `${project.image}?w=1200&h=630&fit=crop&auto=format`;
}
