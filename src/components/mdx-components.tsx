import Image from "next/image";
import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { localImageDimensions } from "@/lib/images";

/** Markdown images span the prose column; nothing here is above the fold. */
const IMAGE_SIZES = "(max-width: 768px) 100vw, 768px";

/**
 * Shared by MDX bodies and the project gallery, so both get the same optimised
 * path, the same remote fallback and the same fatal error on a missing file.
 * Pass an empty `base` when the src is already absolute.
 */
export function ContentImage({
  src,
  alt = "",
  className,
}: {
  src: string;
  alt?: string;
  className?: string;
}) {
  const dimensions = localImageDimensions(src);

  /*
   * Remote images have no build-time dimensions, and next/image cannot render
   * without them. Degrading to a plain img keeps such a post working; a local
   * image that is missing throws instead, from localImageDimensions.
   */
  if (!dimensions) {
    // eslint-disable-next-line @next/next/no-img-element -- no dimensions available; see above
    return <img src={src} alt={alt} loading="lazy" decoding="async" className={className} />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={dimensions.width}
      height={dimensions.height}
      sizes={IMAGE_SIZES}
      className={className}
    />
  );
}

const linkComponents = {
  a: ({ href = "", children, ...props }: ComponentPropsWithoutRef<"a">) => {
    // In-page anchors, including the ones rehype-autolink-headings adds.
    if (href.startsWith("#")) {
      return (
        <a href={href} {...props}>
          {children}
        </a>
      );
    }

    if (href.startsWith("/")) {
      return (
        <Link href={href} {...props}>
          {children}
        </Link>
      );
    }

    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  },
};

/**
 * Component map for MDX bodies, built per entry.
 *
 * Everything not listed here falls through to the plain HTML element and is
 * styled by the `prose` container, which is deliberate: the fewer elements this
 * overrides, the less that can drift from the typography scale.
 *
 * `base` is the entry's asset folder, which is what lets a post write
 * `![alt](diagram.png)` rather than repeating its own slug in every image.
 * rehype-unwrap-images lifts images out of the <p> Markdown wraps them in --
 * without it the layout breaks and a <figure> would be invalid nesting.
 */
export const mdxComponents = {
  img: (props: ComponentPropsWithoutRef<"img">) => (
    <ContentImage src={String(props.src ?? "")} alt={props.alt ?? ""} />
  ),

  Figure: ({
    src,
    alt,
    caption,
  }: {
    src: string;
    alt: string;
    caption?: ReactNode;
  }) => (
    <figure>
      <ContentImage src={src} alt={alt} />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  ),

  ...linkComponents,
};

