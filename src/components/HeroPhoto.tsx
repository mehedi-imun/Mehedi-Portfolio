import Image from "next/image";

/*
 * The hero portrait.
 *
 * Deliberately untinted. Earlier revisions ran the photo through a duotone,
 * which recoloured skin to the brand orange and made a real person look
 * jaundiced -- a treatment that works on a dark, screen-lit photograph and does
 * not work on a bright studio cutout. The face is left as a face; the brand
 * shows up in the light behind it instead.
 *
 * Dimensions are the file's true 500x500. They were previously declared as
 * 1200x1200, so next/image generated candidates far above the source and served
 * an upscaled, soft picture. Never guess these.
 */
const PHOTO = "/hero-portrait.png";
const PHOTO_WIDTH = 500;
const PHOTO_HEIGHT = 500;

export default function HeroPhoto({
  className,
  alt,
}: {
  className?: string;
  alt: string;
}) {
  return (
    <div className={`relative ${className ?? ""}`}>
      {/*
       * Two-stop light behind the subject. The wide, soft stop separates him
       * from the page; the tighter, warmer one reads as a rim light and is what
       * stops a cutout looking pasted on.
       */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[8%] -z-10 rounded-full bg-brand-accent/20 blur-[100px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[18%] bottom-[6%] top-[14%] -z-10 rounded-full bg-brand-accent/25 blur-[55px]"
      />

      <Image
        src={PHOTO}
        width={PHOTO_WIDTH}
        height={PHOTO_HEIGHT}
        priority
        quality={90}
        // Matches the real rendered box: the 1fr track beside a 634px column.
        sizes="(max-width: 1024px) 60vw, 520px"
        alt={alt}
        className="relative w-full select-none [mask-image:linear-gradient(to_bottom,black_82%,transparent_100%)] contrast-[1.04] saturate-[1.03]"
      />
    </div>
  );
}
