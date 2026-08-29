"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>[]{}=+*#$";
const SCRAMBLE_MS = 620;
const HOLD_MS = 2400;

type Props = {
  /** Must be a stable reference; it is an effect dependency. */
  roles: readonly string[];
  /** The canonical title, announced once instead of on every cycle. */
  srLabel: string;
  className?: string;
};

/*
 * Decoding-text effect on the role line.
 *
 * Two details matter more than the effect itself:
 *
 *   - The box is reserved at the width of the longest role, in ch. Without
 *     that, every cycle reflows the line and nudges everything under it, which
 *     is exactly the kind of jitter that makes a page feel unfinished.
 *   - Only the first role is rendered on the server. Math.random() during
 *     render would produce different markup on client and server and trip a
 *     hydration mismatch, so scrambling starts strictly after mount.
 */
export default function RoleCycler({ roles, srLabel, className }: Props) {
  const [display, setDisplay] = useState(roles[0] ?? "");
  const indexRef = useRef(0);

  useEffect(() => {
    if (roles.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    const scrambleTo = (target: string) => {
      const start = performance.now();

      const step = (now: number) => {
        if (cancelled) return;
        const progress = Math.min(1, (now - start) / SCRAMBLE_MS);
        const settled = Math.floor(progress * target.length);

        let out = "";
        for (let i = 0; i < target.length; i += 1) {
          const char = target[i];
          // Spaces stay spaces; scrambling them reads as noise, not decoding.
          if (i < settled || char === " ") out += char;
          else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        setDisplay(out);

        if (progress < 1) {
          raf = requestAnimationFrame(step);
        } else {
          setDisplay(target);
          timer = setTimeout(advance, HOLD_MS);
        }
      };

      raf = requestAnimationFrame(step);
    };

    const advance = () => {
      indexRef.current = (indexRef.current + 1) % roles.length;
      scrambleTo(roles[indexRef.current]);
    };

    timer = setTimeout(advance, HOLD_MS);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      if (timer) clearTimeout(timer);
    };
  }, [roles]);

  const widest = roles.reduce((max, role) => Math.max(max, role.length), 0);

  return (
    <>
      <span
        aria-hidden
        className={className}
        style={{ minWidth: `${widest}ch`, display: "inline-block" }}
      >
        {display}
      </span>
      {/* Announced once; the cycling text would otherwise spam a screen reader. */}
      <span className="sr-only">{srLabel}</span>
    </>
  );
}
