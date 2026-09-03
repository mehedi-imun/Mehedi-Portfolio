import Link from "next/link";
import type { BlogPostSummary } from "@/lib/blog";

interface PostNavProps {
  prev?: BlogPostSummary;
  next?: BlogPostSummary;
}

/**
 * Chronological neighbours -- a guaranteed internal link even when a post
 * shares no tags with anything else, unlike the tag-overlap related posts
 * below it. `prev` is the older post (published earlier), `next` is the newer
 * one, matching getAdjacentPosts()'s naming in lib/blog.ts.
 */
export function PostNav({ prev, next }: PostNavProps) {
  if (!prev && !next) return null;

  return (
    <nav aria-label="More posts" className="mt-12 grid gap-4 border-t pt-8 sm:grid-cols-2">
      {prev ? (
        <Link
          href={`/blog/${prev.slug}`}
          className="group rounded-xl border p-5 transition-shadow hover:shadow-md"
        >
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            &larr; Previous
          </span>
          <span lang={prev.lang} className="mt-1 block font-semibold group-hover:underline">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={`/blog/${next.slug}`}
          className="group rounded-xl border p-5 text-right transition-shadow hover:shadow-md"
        >
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Next &rarr;
          </span>
          <span lang={next.lang} className="mt-1 block font-semibold group-hover:underline">
            {next.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}

export default PostNav;
