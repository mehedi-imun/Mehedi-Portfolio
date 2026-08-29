import { cn } from "@/lib/utils";

/*
 * One container, one rhythm, one gutter.
 *
 * The gutter matters more than it looks: every section previously used
 * `px-4 lg:px-0`, which removes horizontal padding entirely from 1024px up
 * while `max-w-7xl` only caps the content at 1280px. Between those two widths
 * the page had no gutter at all and text sat flush against the viewport edge.
 * The scale below never drops to zero.
 */
export const sectionContainer = "mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10";

const sectionRhythm = "py-16 md:py-24";

type SectionProps = React.ComponentProps<"section"> & {
  /** Applied to the inner container rather than the section element. */
  containerClassName?: string;
  /**
   * Skip the inner container for children that manage their own width, such as
   * the experience timeline.
   */
  bleed?: boolean;
};

export function Section({
  className,
  containerClassName,
  bleed = false,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cn(sectionRhythm, className)} {...props}>
      {bleed ? (
        children
      ) : (
        <div className={cn(sectionContainer, containerClassName)}>{children}</div>
      )}
    </section>
  );
}

export function Container({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn(sectionContainer, className)} {...props} />;
}

type SectionHeadingProps = {
  eyebrow?: string;
  /**
   * Two-digit section number, e.g. "02". Rendered as `02 / SELECTED WORK`.
   * This is what makes the page read as one continuous document rather than a
   * stack of unrelated blocks -- each section announces its place in the run.
   */
  index?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  /** Ties the heading to the section's aria-labelledby. */
  id?: string;
  className?: string;
};

/*
 * Section headings used to be `text-lg md:text-4xl`, so on a phone they were
 * 18px -- the same size as the body copy underneath them, which left the page
 * with no visible hierarchy until a tablet breakpoint.
 */
export function SectionHeading({
  eyebrow,
  index,
  title,
  lead,
  id,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", className)}>
      {eyebrow ? (
        <p className="mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em]">
          {index ? (
            <>
              <span className="text-muted-foreground">{index}</span>
              <span aria-hidden className="text-muted-foreground/50">
                /
              </span>
            </>
          ) : null}
          <span className="text-brand">{eyebrow}</span>
        </p>
      ) : null}
      <h2
        id={id}
        className="text-3xl font-semibold tracking-tight text-balance md:text-5xl"
      >
        {title}
      </h2>
      {lead ? (
        <p className="mt-4 max-w-[65ch] text-base text-muted-foreground md:text-lg">
          {lead}
        </p>
      ) : null}
    </div>
  );
}
