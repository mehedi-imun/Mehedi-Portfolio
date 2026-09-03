import { siteConfig } from "@/lib/site";

/*
 * The strip that frames the whole site.
 *
 * A server component and pure CSS -- the track is duplicated and translated
 * exactly -50%, so the loop closes on itself with no seam and no JavaScript.
 * Marked aria-hidden because it is a decorative restatement of facts already
 * present as real content elsewhere on the page.
 *
 * Width is `100% - var(--removed-body-scroll-bar-size)` rather than plain
 * `inset-x-0`, because any Radix popup (the theme toggle's dropdown, a
 * dialog) locks body scroll while open, which removes the page scrollbar and
 * widens the viewport -- a fixed, edge-to-edge element would visibly reflow
 * sideways on every open/close. `react-remove-scroll` (used internally by
 * Radix) sets that variable to the scrollbar's width while locked and leaves
 * it unset otherwise, which the `,0px` fallback covers.
 */

const ITEMS = [
  siteConfig.jobTitle,
  "Node.js · Express · PostgreSQL",
  "API design · Docker · CI/CD",
  `Based in ${siteConfig.location.city}, ${siteConfig.location.country}`,
  "Available for work",
  "Remote worldwide",
];

export default function TopTicker() {
  const track = [...ITEMS, ...ITEMS];

  return (
    <div
      aria-hidden
      className="fixed left-0 top-0 z-50 flex h-8 w-[calc(100%-var(--removed-body-scroll-bar-size,0px))] items-center overflow-hidden border-b border-border bg-background"
    >
      <div className="animate-marquee flex shrink-0 items-center gap-8 pr-8 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        {track.map((item, index) => (
          <span key={`${item}-${index}`} className="flex items-center gap-8">
            {item}
            <span className="text-brand">+</span>
          </span>
        ))}
      </div>
    </div>
  );
}
