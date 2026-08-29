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
 * Images live anywhere under `public/`, and are referenced by the path you get
 * from dropping the `public` prefix: a file at `public/images/hero.png` is
 * written as `/images/hero.png`. There is no folder convention to follow and
 * nothing to scaffold -- add the file, copy the path, paste it in.
 */
export function isRemoteAsset(src: string): boolean {
  return /^[a-z]+:/i.test(src);
}

/**
 * A bare `hero.png` would be resolved by the browser relative to the current
 * URL, so it would appear to work on one page and 404 on another. Rejecting it
 * outright is clearer than letting that through.
 */
export function assertAssetPath(src: string, context: string): void {
  if (isRemoteAsset(src) || src.startsWith("/")) return;
  throw new Error(
    `Invalid image path "${src}" in ${context}. Use the path from the public folder, ` +
      `starting with a slash -- public/images/hero.png is written as "/images/hero.png".`
  );
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
