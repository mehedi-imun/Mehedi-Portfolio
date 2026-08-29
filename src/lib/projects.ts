import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { assertUniqueSlugs, assetBase, resolveAssetPath, resolveSlug } from "./content";
import { absoluteUrl } from "./site";

export interface Project {
  slug: string;
  title: string;
  /** Short line used on cards. */
  excerpt: string;
  /** 120-160 chars, used verbatim as the meta description on the detail page. */
  description: string;
  tags: string[];
  /** Absolute URL or public-relative path. */
  cover: string;
  coverAlt: string;
  category: string;
  year: string;
  role: string;
  stack: string[];
  liveUrl?: string;
  repoUrl?: string;
  /** How long the work took, e.g. "3 months". Shown in the summary panel. */
  timeline?: string;
  /** What the work achieved. A case study without results is just a description. */
  outcomes?: string[];
  /** Extra screenshots. Entirely optional -- a project can stand on its cover. */
  gallery?: { src: string; alt: string; caption?: string }[];
  featured: boolean;
  /** Explicit ordering; falls back to year, newest first. */
  order?: number;
  draft: boolean;
  /** Raw MDX case study, replacing the old fixed overview/highlights template. */
  content: string;
}

const PROJECTS_DIR = join(process.cwd(), "content", "projects");

/** The homepage grid is lg:grid-cols-3; a 4th featured card would sit alone. */
const FEATURED_LIMIT = 3;

const frontmatterSchema = z.object({
  // Optional: the filename is used when this is absent, so existing projects
  // keep their URLs without being edited.
  slug: z.string().min(1).optional(),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  description: z.string().min(1),
  tags: z.array(z.string().min(1)).min(1),
  cover: z.string().min(1),
  coverAlt: z.string().min(1),
  category: z.string().min(1),
  year: z.string().regex(/^\d{4}$/, "must be a four-digit year"),
  role: z.string().min(1),
  stack: z.array(z.string().min(1)).min(1),
  liveUrl: z.url().optional(),
  repoUrl: z.url().optional(),
  timeline: z.string().min(1).optional(),
  outcomes: z.array(z.string().min(1)).min(1).optional(),
  gallery: z
    .array(
      z.object({
        src: z.string().min(1),
        // Required, not optional: a screenshot nobody described is invisible to
        // anyone using a screen reader.
        alt: z.string().min(1),
        caption: z.string().min(1).optional(),
      })
    )
    .min(1)
    .optional(),
  featured: z.boolean().optional(),
  order: z.number().int().optional(),
  draft: z.boolean().optional(),
});

function parseProject(fileName: string): Project {
  const { data, content } = matter(readFileSync(join(PROJECTS_DIR, fileName), "utf8"));
  const parsed = frontmatterSchema.safeParse(data);

  if (!parsed.success) {
    const problems = parsed.error.issues
      .map((issue) => `  ${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid frontmatter in content/projects/${fileName}:\n${problems}`);
  }

  // Pulled out of the spread: an absent `slug` key still spreads as undefined
  // and would overwrite the resolved value.
  const { slug: frontmatterSlug, ...fields } = parsed.data;
  const slug = resolveSlug(frontmatterSlug, fileName, "content/projects");

  // `cover: "cover.png"` means public/projects/<slug>/cover.png.
  const base = assetBase("projects", slug);

  return {
    ...fields,
    slug,
    cover: resolveAssetPath(fields.cover, base),
    gallery: fields.gallery?.map((item) => ({
      ...item,
      src: resolveAssetPath(item.src, base),
    })),
    featured: fields.featured ?? false,
    draft: fields.draft ?? false,
    content,
  };
}

/** Adjacent projects in display order, for walking the work end to end. */
export function getProjectNeighbours(slug: string): {
  previous?: Project;
  next?: Project;
} {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) return {};
  return { previous: projects[index - 1], next: projects[index + 1] };
}

/** Explicit `order` first, then most recent year. */
function byDisplayOrder(a: Project, b: Project): number {
  if (a.order !== undefined || b.order !== undefined) {
    return (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER);
  }
  return b.year.localeCompare(a.year);
}

/**
 * Read at module scope, so a missing directory surfaces as a bare ENOENT from
 * deep inside Next rather than something actionable. Name the cause instead.
 */
function readProjectFiles(): string[] {
  try {
    return readdirSync(PROJECTS_DIR).filter((fileName) => fileName.endsWith(".mdx"));
  } catch {
    throw new Error(
      `Cannot read content/projects. Every project is a .mdx file in that directory, so it must exist (create it with at least one project). Looked in: ${PROJECTS_DIR}`
    );
  }
}

const parsedProjects = readProjectFiles().map((fileName) => ({
  fileName,
  project: parseProject(fileName),
}));

// Slugs may come from frontmatter, so two files can collide without their
// filenames revealing it. Fail the build rather than shadow a page.
assertUniqueSlugs(
  parsedProjects.map(({ fileName, project }) => ({ fileName, slug: project.slug })),
  "content/projects"
);

const allProjects: Project[] = parsedProjects
  .map(({ project }) => project)
  .sort(byDisplayOrder);

/** Published projects. Adding one means adding a file; removing one, deleting it. */
export const projects: Project[] = allProjects.filter((project) => !project.draft);

/** Drafts stay reachable at their own URL for preview, as in the blog module. */
export function getProjectBySlug(slug: string): Project | undefined {
  return allProjects.find((project) => project.slug === slug);
}

export const featuredProjects: Project[] = projects
  .filter((project) => project.featured)
  .slice(0, FEATURED_LIMIT);

/**
 * Derived from the categories actually present, so the filter can never show an
 * empty category and adding one means only writing it in a frontmatter field.
 */
export const projectCategories: string[] = [
  "All",
  ...Array.from(new Set(projects.map((project) => project.category))).sort(),
];

/**
 * OG images must be absolute. Remote covers already are; repo-local ones are
 * resolved against the site URL. Deliberately host-agnostic -- the previous
 * version appended Unsplash-only query params, which produced a meaningless
 * relative URL for any project with a local cover.
 */
export function projectOgImage(project: Project): string {
  return project.cover.startsWith("http") ? project.cover : absoluteUrl(project.cover);
}
