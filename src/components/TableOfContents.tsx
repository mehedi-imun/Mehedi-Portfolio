"use client";

import { useEffect, useState } from "react";
import type { TocEntry } from "@/lib/mdx";

/**
 * Scroll-spy table of contents. Used both as a sticky xl+ rail and as the
 * plain inline box on smaller screens -- the sticky/non-sticky choice lives in
 * whatever wraps this component in blog/[slug]/page.tsx, not here.
 *
 * IntersectionObserver watches the heading elements rehype-slug already gave
 * ids, so the active link tracks scroll position without re-parsing anything.
 */
export function TableOfContents({ toc }: { toc: TocEntry[] }) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  useEffect(() => {
    const headings = toc
      .map((entry) => document.getElementById(entry.slug))
      .filter((el): el is HTMLElement => el !== null);

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) {
          setActiveSlug(visible.target.id);
        }
      },
      // Treats a heading as "active" once it has cleared the fixed header and
      // is within the top 30% of the viewport, so the highlight moves roughly
      // when a reader would say they started that section.
      { rootMargin: "-88px 0px -70% 0px" }
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [toc]);

  if (toc.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="text-sm">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        On this page
      </h2>
      <ol className="space-y-1 border-l">
        {toc.map((entry) => (
          <li key={entry.slug} className={entry.depth === 3 ? "ml-4" : undefined}>
            <a
              href={`#${entry.slug}`}
              className={`-ml-px block border-l py-1 pl-3 transition-colors ${
                activeSlug === entry.slug
                  ? "border-foreground font-medium text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default TableOfContents;
