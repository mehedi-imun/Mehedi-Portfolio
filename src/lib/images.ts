import { readFileSync } from "node:fs";
import { join } from "node:path";
import { imageSize } from "image-size";
import { assertAssetPath, isRemoteAsset } from "./content";

export interface ImageDimensions {
  width: number;
  height: number;
}

const dimensionCache = new Map<string, ImageDimensions | null>();

/**
 * Markdown image syntax carries no width or height, but next/image needs them to
 * reserve space and avoid layout shift. Repo-local files are measured from disk
 * at build time, which is why in-body images must live under public/.
 *
 * Remote URLs return null: their bytes are not available at build time, so the
 * caller has to degrade rather than guess dimensions.
 */
export function localImageDimensions(src: string): ImageDimensions | null {
  // Hosted elsewhere: no bytes at build time, so the caller degrades instead.
  if (isRemoteAsset(src)) return null;

  assertAssetPath(src, "an image reference");

  const cached = dimensionCache.get(src);
  if (cached !== undefined) return cached;

  const [path] = src.split("?");
  const file = join(process.cwd(), "public", path);

  let dimensions: ImageDimensions;
  try {
    const { width, height } = imageSize(readFileSync(file));
    if (!width || !height) throw new Error("no dimensions");
    dimensions = { width, height };
  } catch {
    /*
     * Deliberately fatal. A local image that cannot be read is a typo or a file
     * that was never added, and returning null here used to make the article
     * hero silently vanish -- the kind of break you only notice in production.
     */
    throw new Error(
      `Image not found: "${src}". Expected a readable image at ${file}. ` +
        `Images live anywhere under public/, referenced by the path with the public prefix removed.`
    );
  }

  dimensionCache.set(src, dimensions);
  return dimensions;
}
