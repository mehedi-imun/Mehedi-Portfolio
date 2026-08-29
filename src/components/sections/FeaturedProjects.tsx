import Image from "next/image";
import Link from "next/link";
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
    <section className="py-20 max-w-7xl mx-auto px-4 lg:px-0" id="projects">
      <div className="page-container">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12">
          <div>
            <h2 className="text-lg md:text-4xl mb-4 text-black dark:text-white max-w-4xl">
              Featured Projects
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Check out some of my recent work.
            </p>
          </div>
          <Button variant="outline" asChild className="mt-4 md:mt-0">
            <Link href="/projects">View All Projects</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <Card
              key={project.slug}
              className=" hover:shadow-md transition-shadow relative"
            >
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
              />
              <div className="aspect-video relative overflow-hidden">
                {project.cover ? (
                  <Image
                    src={project.cover}
                    alt={project.coverAlt ?? ""}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div
                    className="h-full w-full"
                    style={{ backgroundImage: coverGradient(project.slug) }}
                  />
                )}
              </div>
              <CardHeader>
                <CardTitle>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="hover:text-brand"
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
                      className="text-xs px-2 py-1 bg-muted rounded-md"
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
          ))}
        </div>
      </div>
    </section>
  );
}
