"use client";

import HeroPhoto from "@/components/HeroPhoto";
import LiveCode from "@/components/LiveCode";
import RoleCycler from "@/components/RoleCycler";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/section";
import { siteConfig } from "@/lib/site";
import Link from "next/link";

const ROLES = [
  "REACT INTERFACES",
  "PRODUCTION APIS",
  "DATA LAYERS",
  "DEPLOY PIPELINES",
] as const;

/*
 * The headline is the offer, not the name.
 *
 * A name at 180px tells a hiring manager nothing they cannot read in the tab
 * title; what they are actually scanning for is whether you do the thing they
 * need. The name stays inside the h1 -- it still has to rank for itself -- but
 * it sits above the claim rather than replacing it.
 */
const HEADLINE = [
  "Full stack engineer",
  "for web products",
  "that stay online",
];

export default function Hero() {
  const scrollTo = (id: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="grain relative flex min-h-[92svh] items-center overflow-hidden pt-36 pb-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[10%] -top-[20%] h-[60vh] w-[60vw] rounded-full bg-brand-accent/10 blur-[120px]"
      />

      <Container className="relative">
        {/*
         * One stream, not two.
         *
         * Two blocks typing at once fought each other for the same middle
         * ground and neither won; the reference runs a single layer and lets it
         * pass behind both the heading and the photo. Its numbers, measured at
         * 1440: 15px type on a 28.5px rhythm at 34% alpha, in a 620x414 box
         * starting ~28% across and ~12% down. Matched here rather than guessed,
         * which is also what makes it legible -- the previous 11px at 20% was
         * barely there.
         */}
        <LiveCode className="pointer-events-none absolute -top-20 left-[26%] hidden w-[620px] select-none whitespace-pre font-mono text-[15px] leading-[28.5px] text-brand/35 [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_85%)] lg:block" />

        <div className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,634px)_1fr]">
          <div className="relative">
            <h1 className="relative">
              <span className="animate-rise-in block text-lg text-muted-foreground md:text-xl">
                Hello, I&apos;m{" "}
                <span className="font-medium text-brand">{siteConfig.name}</span>
              </span>

              <span className="mt-5 block text-[clamp(2.35rem,4.9vw,4.4rem)] font-medium leading-[0.98] tracking-[-0.03em]">
                {HEADLINE.map((line, i) => (
                  <span
                    key={line}
                    className="animate-rise-in block"
                    style={{ animationDelay: `${140 + i * 110}ms` }}
                  >
                    {line}
                  </span>
                ))}
              </span>
            </h1>

            <p
              className="animate-rise-in mt-7 font-mono text-sm tracking-[0.18em] text-muted-foreground"
              style={{ animationDelay: "500ms" }}
            >
              I BUILD{" "}
              <RoleCycler
                roles={ROLES}
                srLabel={siteConfig.jobTitle}
                className="text-brand"
              />
            </p>

            <p
              className="animate-rise-in mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground"
              style={{ animationDelay: "580ms" }}
            >
              Four years across React, Next.js, Node and PostgreSQL — interfaces
              people actually enjoy using, APIs that stay fast under load, and
              pipelines that deploy without anyone holding their breath.
            </p>

            <div
              className="animate-rise-in mt-8 flex flex-wrap items-center gap-3"
              style={{ animationDelay: "660ms" }}
            >
              <Button asChild size="lg" className="rounded-full px-7">
                <Link href="#projects" onClick={scrollTo("projects")}>
                  See the work
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full px-7"
              >
                <Link href="#contact" onClick={scrollTo("contact")}>
                  Get in touch
                </Link>
              </Button>
            </div>

            <p
              className="animate-rise-in mt-6 inline-flex items-center gap-3 rounded-full border border-border px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground"
              style={{ animationDelay: "740ms" }}
            >
              <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-brand" />
              Available · {siteConfig.location.city} · UTC+6
            </p>
          </div>

          <div
            className="animate-rise-in relative mx-auto w-full max-w-sm lg:max-w-none"
            style={{ animationDelay: "300ms" }}
          >
            {/*
             * Faded into the page at its edges rather than sitting in a framed
             * box -- the frame was the most template-looking thing here.
             */}
            <HeroPhoto
              className="w-full"
              alt={`${siteConfig.name} at his desk`}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
