import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { z } from "zod";

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
  /** Derived from the body word count, not hand-maintained. */
  readTime: string;
  tags: string[];
  /**
   * Raw MDX source. Read synchronously so blogPosts, the sitemap and
   * generateStaticParams stay synchronous; only compilation is async, in the
   * server component that renders it.
   */
  content: string;
}

const POSTS_DIR = join(process.cwd(), "content", "blog");

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const frontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  excerpt: z.string().min(1),
  date: z.string().regex(ISO_DATE, "must be YYYY-MM-DD"),
  updated: z.string().regex(ISO_DATE, "must be YYYY-MM-DD").optional(),
  tags: z.array(z.string().min(1)).min(1),
  draft: z.boolean().optional(),
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

function parsePost(fileName: string): BlogPost & { draft: boolean } {
  const slug = fileName.replace(/\.mdx$/, "");
  const { data, content } = matter(readFileSync(join(POSTS_DIR, fileName), "utf8"));
  const parsed = frontmatterSchema.safeParse(data);

  // Fails the build rather than shipping a post with broken JSON-LD.
  if (!parsed.success) {
    const problems = parsed.error.issues
      .map((issue) => `  ${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid frontmatter in content/blog/${fileName}:\n${problems}`);
  }

  const { title, description, excerpt, date, tags, draft } = parsed.data;

  return {
    id: slug,
    slug,
    title,
    excerpt,
    description,
    date: displayDate.format(new Date(`${date}T00:00:00Z`)),
    dateISO: date,
    readTime: readTimeFor(content),
    tags,
    content,
    draft: draft ?? false,
  };
}

/** Newest first, drafts excluded. The filename is the slug. */
export const blogPosts: BlogPost[] = readdirSync(POSTS_DIR)
  .filter((fileName) => fileName.endsWith(".mdx"))
  .map(parsePost)
  .filter((post) => !post.draft)
  .sort((a, b) => b.dateISO.localeCompare(a.dateISO));

export const allTags: string[] = Array.from(
  new Set(blogPosts.flatMap((post) => post.tags))
);

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

/** Card-shaped subset, so the index does not ship full post bodies to the client. */
export type BlogPostSummary = Omit<BlogPost, "content">;

export const blogPostSummaries: BlogPostSummary[] = blogPosts.map(
  ({ id, slug, title, excerpt, description, date, dateISO, readTime, tags }) => ({
    id,
    slug,
    title,
    excerpt,
    description,
    date,
    dateISO,
    readTime,
    tags,
  })
);
