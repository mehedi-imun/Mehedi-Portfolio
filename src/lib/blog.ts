import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { assertAssetPath, assertUniqueSlugs, resolveSlug } from "./content";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  /** Card copy on the blog index. */
  excerpt: string;
  /** 120-160 chars, used verbatim as the meta description. */
  description: string;
  /** Human-readable display date, derived from dateISO. */
  date: string;
  /** YYYY-MM-DD, used for datePublished and sitemap lastModified. */
  dateISO: string;
  /** YYYY-MM-DD. Set only on revision; drives dateModified and lastModified. */
  updated?: string;
  /** Derived from the body word count, not hand-maintained. */
  readTime: string;
  tags: string[];
  /**
   * BCP-47 tag for the post's primary language, defaulting to "en". Mixed
   * scripts inside one post are expected and handled by font fallback, so this
   * describes the whole article rather than any individual sentence.
   */
  lang: string;
  /**
   * Path from the public folder, e.g. "/images/hero.png". Feeds the post hero,
   * the card thumbnail, og:image and JSON-LD image at once.
   */
  cover?: string;
  /** Required whenever `cover` is set; a decorative hero is still content here. */
  coverAlt?: string;
  /** Reachable at its own URL for preview, but unlisted and noindex. */
  draft: boolean;
  /**
   * Raw MDX source. Read synchronously so blogPosts, the sitemap and
   * generateStaticParams stay synchronous; only compilation is async, in the
   * server component that renders it.
   */
  content: string;
}

const POSTS_DIR = join(process.cwd(), "content", "blog");

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const frontmatterSchema = z
  .object({
    // Optional: the filename is used when this is absent, so existing posts
    // keep their URLs without being edited.
    slug: z.string().min(1).optional(),
    title: z.string().min(1),
    description: z.string().min(1),
    excerpt: z.string().min(1),
    date: z.string().regex(ISO_DATE, "must be YYYY-MM-DD"),
    updated: z.string().regex(ISO_DATE, "must be YYYY-MM-DD").optional(),
    tags: z.array(z.string().min(1)).min(1),
    // Loose BCP-47 shape: "en", "bn", "en-GB". Not an enum, so writing in a new
    // language never requires a code change.
    lang: z
      .string()
      .regex(/^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$/, "must be a BCP-47 tag, e.g. en or bn-BD")
      .optional(),
    cover: z.string().min(1).optional(),
    coverAlt: z.string().min(1).optional(),
    draft: z.boolean().optional(),
  })
  // Alt text is not optional for a real image, and a missing one is silent.
  .refine((data) => !data.cover || Boolean(data.coverAlt), {
    path: ["coverAlt"],
    message: "is required when `cover` is set",
  });

const displayDate = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  // Without this the date shifts a day for anyone west of UTC.
  timeZone: "UTC",
});

const WORDS_PER_MINUTE = 200;

function readTimeFor(body: string): string {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / WORDS_PER_MINUTE))} min read`;
}

function parsePost(fileName: string): BlogPost {
  const { data, content } = matter(readFileSync(join(POSTS_DIR, fileName), "utf8"));
  const parsed = frontmatterSchema.safeParse(data);

  // Fails the build rather than shipping a post with broken JSON-LD.
  if (!parsed.success) {
    const problems = parsed.error.issues
      .map((issue) => `  ${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid frontmatter in content/blog/${fileName}:\n${problems}`);
  }

  const { title, description, excerpt, date, updated, tags, lang, cover, coverAlt, draft } =
    parsed.data;
  const slug = resolveSlug(parsed.data.slug, fileName, "content/blog");
  if (cover) assertAssetPath(cover, `content/blog/${fileName}`);

  return {
    id: slug,
    slug,
    title,
    excerpt,
    description,
    date: displayDate.format(new Date(`${date}T00:00:00Z`)),
    dateISO: date,
    updated,
    readTime: readTimeFor(content),
    tags,
    lang: lang ?? "en",
    cover,
    coverAlt,
    content,
    draft: draft ?? false,
  };
}

/** A missing directory would otherwise surface as a bare ENOENT from inside Next. */
function readPostFiles(): string[] {
  try {
    return readdirSync(POSTS_DIR).filter((fileName) => fileName.endsWith(".mdx"));
  } catch {
    throw new Error(
      `Cannot read content/blog. Every post is a .mdx file in that directory, so it must exist (create it with at least one post). Looked in: ${POSTS_DIR}`
    );
  }
}

const parsedPosts = readPostFiles().map((fileName) => ({
  fileName,
  post: parsePost(fileName),
}));

// Slugs may come from frontmatter, so two files can collide without their
// filenames revealing it. Fail the build rather than shadow a page.
assertUniqueSlugs(
  parsedPosts.map(({ fileName, post }) => ({ fileName, slug: post.slug })),
  "content/blog"
);

const allPosts: BlogPost[] = parsedPosts
  .map(({ post }) => post)
  .sort((a, b) => b.dateISO.localeCompare(a.dateISO));

/**
 * Published posts, newest first. Drafts stay out of every listing but remain
 * reachable at their own URL via getPostBySlug, for preview.
 */
export const blogPosts: BlogPost[] = allPosts.filter((post) => !post.draft);

export const allTags: string[] = Array.from(
  new Set(blogPosts.flatMap((post) => post.tags))
);

export function getPostBySlug(slug: string): BlogPost | undefined {
  return allPosts.find((post) => post.slug === slug);
}

/** Card-shaped subset, so the index does not ship full post bodies to the client. */
export type BlogPostSummary = Omit<BlogPost, "content">;

export const blogPostSummaries: BlogPostSummary[] = blogPosts.map(
  ({
    id,
    slug,
    title,
    excerpt,
    description,
    date,
    dateISO,
    updated,
    readTime,
    tags,
    lang,
    cover,
    coverAlt,
    draft,
  }) => ({
    id,
    slug,
    title,
    excerpt,
    description,
    date,
    dateISO,
    updated,
    readTime,
    tags,
    lang,
    cover,
    coverAlt,
    draft,
  })
);

/**
 * Related posts by shared tags: most overlap first, then most recent. Drafts and
 * the post itself are never suggested. Returns summaries because the cards do
 * not need post bodies.
 */
export function getRelatedPosts(post: BlogPost, limit = 3): BlogPostSummary[] {
  return blogPostSummaries
    .filter((candidate) => candidate.slug !== post.slug)
    .map((candidate) => ({
      candidate,
      shared: candidate.tags.filter((tag) => post.tags.includes(tag)).length,
    }))
    .filter(({ shared }) => shared > 0)
    .sort(
      (a, b) =>
        b.shared - a.shared ||
        b.candidate.dateISO.localeCompare(a.candidate.dateISO)
    )
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}
