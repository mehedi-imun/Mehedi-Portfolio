"use client";
import { motion, useScroll, useTransform } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { sectionContainer } from "@/components/ui/section";
import { cn } from "@/lib/utils";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

type TimelineProps = {
  data: TimelineEntry[];
  /** Rendered as the section heading; ties to the section's aria-labelledby. */
  headingId?: string;
  title?: string;
  lead?: string;
};

export const Timeline = ({
  data,
  headingId,
  title = "Work Experience",
  lead = "My professional journey and career highlights.",
}: TimelineProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className="w-full bg-background font-sans" ref={containerRef}>
      <div className={cn(sectionContainer, "py-16 md:py-24")}>
        {/* Matches SectionHeading's numbering so the run stays unbroken. */}
        <p className="mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em]">
          <span className="text-muted-foreground">04</span>
          <span aria-hidden className="text-muted-foreground/50">
            /
          </span>
          <span className="text-brand">Career</span>
        </p>
        <h2
          id={headingId}
          className="text-3xl font-semibold tracking-tight text-balance md:text-5xl"
        >
          {title}
        </h2>
        <p className="mt-4 max-w-[65ch] text-base text-muted-foreground md:text-lg">
          {lead}
        </p>
      </div>

      <div ref={ref} className={cn(sectionContainer, "relative pb-20")}>
        {data.map((item) => (
          <div key={item.title} className="flex justify-start pt-10 md:gap-10">
            <div className="sticky top-40 z-40 flex max-w-xs flex-col items-center self-start md:w-full md:flex-row lg:max-w-sm">
              <div className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full bg-background">
                <div className="h-4 w-4 rounded-full border border-border bg-muted p-2" />
              </div>
              <h3 className="hidden text-xl font-bold text-muted-foreground md:block md:pl-20 md:text-5xl">
                {item.title}
              </h3>
            </div>

            <div className="relative w-full pl-20 pr-4 md:pl-4">
              <h3 className="mb-4 block text-left text-2xl font-bold text-muted-foreground md:hidden">
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}
        <div
          style={{ height: `${height}px` }}
          className="absolute left-8 top-0 w-[2px] overflow-hidden bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-border to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{ height: heightTransform, opacity: opacityTransform }}
            className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-gradient-to-t from-brand via-brand-accent to-transparent from-[0%] via-[10%]"
          />
        </div>
      </div>
    </div>
  );
};
