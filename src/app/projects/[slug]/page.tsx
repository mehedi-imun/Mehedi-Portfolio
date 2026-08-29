import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { ContentImage, createMdxComponents } from "@/components/mdx-components";
import { Button } from "@/components/ui/button";
import { assetBase } from "@/lib/content";
import { mdxOptions } from "@/lib/mdx";
import { getProjectBySlug, getProjectNeighbours, projects } from "@/lib/projects";
import { breadcrumbSchema, projectSchema } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: project.title,
    description: project.description,
    keywords: project.tags,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      url: `/projects/${project.slug}`,
      title: project.title,
      description: project.description,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
    },
    /*
     * og:image is left to opengraph-image.tsx, which is genuinely 1200x630.
     * Declaring those dimensions for the raw cover would be a lie now that
     * projectOgImage no longer appends crop params -- and an explicit `images`
     * here would override the generated card entirely. JSON-LD still points at
     * the real cover photo via projectSchema.
     */
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  // Walking the work in display order beats a category-only list: it reaches
  // every project rather than only those sharing this one's category.
  const { previous, next } = getProjectNeighbours(project.slug);

  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-0 py-12 mt-20">
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" asChild className="mb-6 pl-0 hover:bg-transparent">
          <Link href="/projects" className="flex items-center">
            <ArrowLeft size={16} className="mr-2" /> All projects
          </Link>
        </Button>

        <article>
          <header className="mb-8">
            <p className="text-sm font-medium text-[#ff914d] mb-3">
              {project.category} &middot; {project.year}
            </p>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              {project.title}
            </h1>
            <p className="text-lg text-muted-foreground normal-case">
              {project.description}
            </p>
          </header>

          <div className="relative aspect-video rounded-xl overflow-hidden border mb-10">
            <Image
              src={project.cover}
              alt={project.coverAlt}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>

          {/*
            * The facts a reader wants before deciding to read on: what the work
            * was, when, and with what. These used to sit below the case study,
            * which meant scrolling the whole thing to learn the role.
            */}
          <section
            aria-labelledby="summary-heading"
            className="mb-10 rounded-xl border bg-muted/30 p-6"
          >
            <h2 id="summary-heading" className="sr-only">
              Project summary
            </h2>

            <dl className="grid gap-6 sm:grid-cols-3">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Role
                </dt>
                <dd className="mt-1 font-medium">{project.role}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Year
                </dt>
                <dd className="mt-1 font-medium">{project.year}</dd>
              </div>
              {project.timeline ? (
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Timeline
                  </dt>
                  <dd className="mt-1 font-medium">{project.timeline}</dd>
                </div>
              ) : null}
            </dl>

            <div className="mt-6 border-t pt-6">
              <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Built with
              </h3>
              <ul className="mt-2 flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <li key={item} className="rounded-md bg-muted px-3 py-1 text-sm">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {project.liveUrl || project.repoUrl ? (
              <div className="mt-6 flex flex-wrap gap-3">
                {project.liveUrl ? (
                  <Button asChild>
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      View live site
                    </a>
                  </Button>
                ) : null}
                {project.repoUrl ? (
                  <Button variant="outline" asChild>
                    <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                      View source
                    </a>
                  </Button>
                ) : null}
              </div>
            ) : null}
          </section>

          {/* Freeform case study, replacing the old fixed Overview/highlights template. */}
          <div className="prose dark:prose-invert max-w-none mb-10 break-words [overflow-wrap:anywhere] [&_pre]:overflow-x-auto">
            <MDXRemote
              source={project.content}
              components={createMdxComponents(assetBase("projects", project.slug))}
              options={mdxOptions}
            />
          </div>

          {project.outcomes?.length ? (
            <section aria-labelledby="outcomes-heading" className="mb-10">
              <h2 id="outcomes-heading" className="text-2xl font-bold mb-4">
                Outcomes
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {project.outcomes.map((outcome) => (
                  <li
                    key={outcome}
                    className="rounded-lg border bg-card p-4 text-muted-foreground normal-case"
                  >
                    {outcome}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {project.gallery?.length ? (
            <section aria-labelledby="gallery-heading" className="mb-10">
              <h2 id="gallery-heading" className="text-2xl font-bold mb-4">
                Interface
              </h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {project.gallery.map((shot) => (
                  <figure key={shot.src} className="m-0">
                    <ContentImage
                      src={shot.src}
                      alt={shot.alt}
                      base=""
                      className="h-auto w-full rounded-lg border"
                    />
                    {shot.caption ? (
                      <figcaption className="mt-2 text-sm text-muted-foreground normal-case">
                        {shot.caption}
                      </figcaption>
                    ) : null}
                  </figure>
                ))}
              </div>
            </section>
          ) : null}
        </article>

        {previous || next ? (
          <nav
            aria-label="More projects"
            className="mt-16 grid gap-4 border-t pt-10 sm:grid-cols-2"
          >
            {previous ? (
              <Link
                href={`/projects/${previous.slug}`}
                className="group rounded-xl border p-5 transition-shadow hover:shadow-md"
              >
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  Previous
                </span>
                <span className="mt-1 block font-medium group-hover:text-[#ff914d]">
                  {previous.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/projects/${next.slug}`}
                className="group rounded-xl border p-5 transition-shadow hover:shadow-md sm:text-right"
              >
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  Next
                </span>
                <span className="mt-1 block font-medium group-hover:text-[#ff914d]">
                  {next.title}
                </span>
              </Link>
            ) : null}
          </nav>
        ) : null}

        <section className="mt-10 rounded-xl border bg-muted/30 p-6 text-center">
          <h2 className="text-lg font-semibold">Building something similar?</h2>
          <p className="mt-1 text-muted-foreground normal-case">
            I am open to new work. Tell me what you are planning.
          </p>
          <Button asChild className="mt-4">
            <Link href="/contact">Get in touch</Link>
          </Button>
        </section>
      </div>

      <JsonLd
        schema={[
          projectSchema(project),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Projects", path: "/projects" },
            { name: project.title, path: `/projects/${project.slug}` },
          ]),
        ]}
      />
    </main>
  );
}
