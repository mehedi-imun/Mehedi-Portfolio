import Link from "next/link";
import type { Crumb } from "@/lib/seo";

/**
 * Visible breadcrumb nav. Takes the exact same {name, path}[] shape already
 * passed to breadcrumbSchema() on the blog post and tag archive pages, so one
 * array literal drives both the rendered nav and the JSON-LD -- they cannot
 * drift apart the way a JSON-LD-only breadcrumb and a separately hand-written
 * nav eventually would.
 */
export default function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1.5">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={crumb.path} className="flex items-center gap-1.5">
              {index > 0 ? <span aria-hidden="true">/</span> : null}
              {isLast ? (
                <span aria-current="page" className="text-foreground">
                  {crumb.name}
                </span>
              ) : (
                <Link
                  href={crumb.path}
                  className="underline-offset-4 hover:text-foreground hover:underline"
                >
                  {crumb.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
