/**
 * Slug rules shared by the blog and project content modules.
 *
 * The slug is the public URL and the generateStaticParams key, so changing one
 * breaks the live URL and its sitemap entry. It comes from the `slug`
 * frontmatter field when present, otherwise from the filename.
 */

/** Lowercase ASCII words joined by single hyphens. Anything else makes a bad URL. */
const SAFE_SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/**
 * Every entry keeps its images beside it, in `public/<kind>/<slug>/`.
 *
 * Authors write bare filenames -- `cover.png`, `./diagram.png` -- and they are
 * resolved against that folder. Two reasons this beats writing the full path:
 * the reference survives renaming the post's slug, and it cannot drift to some
 * other post's folder by copy-paste.
 */
export function assetBase(kind: "blog" | "projects", slug: string): string {
  return `/${kind}/${slug}`;
}

export function resolveAssetPath(src: string, base: string): string {
  // Already absolute, or hosted elsewhere: leave it exactly as written.
  if (src.startsWith("/") || /^[a-z]+:/i.test(src)) return src;
  return `${base}/${src.replace(/^\.\//, "")}`;
}

export function resolveSlug(
  frontmatterSlug: string | undefined,
  fileName: string,
  dir: string
): string {
  const slug = frontmatterSlug ?? fileName.replace(/\.mdx$/, "");

  if (!SAFE_SLUG.test(slug)) {
    throw new Error(
      `Invalid slug "${slug}" in ${dir}/${fileName}. A slug becomes the URL, so it must be ` +
        `lowercase ASCII words separated by single hyphens, e.g. "my-first-post".`
    );
  }

  return slug;
}

/**
 * Two files declaring the same slug would produce duplicate generateStaticParams
 * entries, with one page silently shadowing the other. Naming both files matters:
 * once slugs live in frontmatter the collision is invisible from the filenames.
 */
export function assertUniqueSlugs(
  entries: { slug: string; fileName: string }[],
  dir: string
): void {
  const seen = new Map<string, string>();

  for (const { slug, fileName } of entries) {
    const previous = seen.get(slug);
    if (previous) {
      throw new Error(
        `Duplicate slug "${slug}" in ${dir}: both ${previous} and ${fileName} declare it. ` +
          `Slugs must be unique because each one is a single URL.`
      );
    }
    seen.set(slug, fileName);
  }
}
