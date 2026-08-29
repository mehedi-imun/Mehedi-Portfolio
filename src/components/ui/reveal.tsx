"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Seconds. Used to stagger siblings in a grid. */
  delay?: number;
};

/*
 * Scroll reveal that never ships hidden content.
 *
 * The obvious implementation -- `initial={{ opacity: 0 }}` with whileInView --
 * writes opacity:0 into the server-rendered HTML, so the text only exists for
 * clients that execute JS. This site has been bitten by that before; the two
 * hero animations in globals.css are plain CSS keyframes precisely because a
 * previous Framer Motion version left the heading at opacity 0 for crawlers.
 *
 * So: `initial={false}` means the first paint, server and client, is the
 * visible state. Only after mount does `armed` flip, at which point anything
 * still out of view is hidden -- instantly, with duration 0, because it is
 * below the fold and nobody can see it happen -- and then animated back in on
 * scroll. Content is in the HTML, the animation still runs, and a reader
 * without JS simply sees a static page.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setArmed(true);
  }, []);

  const hidden = armed && !prefersReducedMotion && !inView;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={hidden ? { opacity: 0, y: 24 } : { opacity: 1, y: 0 }}
      transition={
        hidden
          ? { duration: 0 }
          : { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }
      }
    >
      {children}
    </motion.div>
  );
}
