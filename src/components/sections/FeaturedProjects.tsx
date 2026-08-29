import Image from "next/image";
import Link from "next/link";
import { CardContainer, CardItem } from "@/components/ui/3d-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { coverGradient } from "@/lib/content";
import { featuredProjects } from "@/lib/projects";

export default function FeaturedProjects() {
  /*
   * With nothing to feature the section would still print its heading and
   * "Check out some of my recent work" above an empty grid, which reads as a
   * broken page rather than a new one. Better to omit the section entirely.
   */
  if (featuredProjects.length === 0) return null;

  return (
    <Section id="projects" aria-labelledby="projects-heading">
      <Reveal>
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            id="projects-heading"
            index="03"
            eyebrow="Selected work"
            title="Featured Projects"
            lead="Systems I designed, built and shipped end to end. Each one has a full case study."
          />
          <Button variant="outline" asChild className="shrink-0">
            <Link href="/projects">View All Projects</Link>
          </Button>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featuredProjects.map((project, index) => (
          <Reveal key={project.slug} delay={index * 0.08} className="h-full">
            {/*
             * `relative hover:z-20` is what stops a tilted card being painted
             * behind the one after it. The cover is pushed toward the viewer on
             * translateZ, so without a raised stacking order the card that is
             * lifted loses to whichever sibling comes later in the DOM.
             */}
            <CardContainer
              containerClassName="relative h-full hover:z-20"
              className="h-full w-full"
            >
              {/* preserve-3d must be unbroken from the container down, or the
                  cover's translateZ is flattened before it renders. `group` is
                  load-bearing: the zoom below keys off it. */}
              <Card className="group relative h-full w-full transition-shadow [transform-style:preserve-3d] hover:shadow-md">
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
              />
              {/*
               * translateZ trimmed 50 -> 28. Fifty punched the cover far enough
               * out of the card's plane to cross into the next column.
               */}
              <CardItem translateZ={28} className="relative aspect-video">
                {/*
                 * Clipping lives on this untransformed child. `overflow:hidden`
                 * on the transformed CardItem itself does not reliably clip a
                 * scaled child once a preserve-3d ancestor is involved, so the
                 * zoomed cover bled past the card's rounded corner.
                 */}
                <div className="absolute inset-0 overflow-hidden rounded-t-xl">
                  {project.cover ? (
                    <Image
                      src={project.cover}
                      alt={project.coverAlt ?? ""}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div
                      className="h-full w-full"
                      style={{ backgroundImage: coverGradient(project.slug) }}
                    />
                  )}
                </div>
              </CardItem>
              <CardHeader>
                {/* Card numerals continue the section numbering into the grid. */}
                <p className="mb-1 flex items-center justify-between font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  <span>{project.category}</span>
                  <span aria-hidden>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </p>
                <CardTitle>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="transition-colors hover:text-brand"
                  >
                    {project.title}
                  </Link>
                </CardTitle>
                <CardDescription>{project.excerpt}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-border bg-muted px-2 py-1 text-xs font-medium text-foreground/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild className="w-full">
                  <Link href={`/projects/${project.slug}`}>View Project</Link>
                </Button>
              </CardFooter>
              </Card>
            </CardContainer>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
