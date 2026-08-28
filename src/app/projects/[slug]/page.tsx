import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { Button } from "@/components/ui/button";
import { getProjectBySlug, projectOgImage, projects } from "@/lib/projects";
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
      images: [
        {
          url: projectOgImage(project),
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      images: [projectOgImage(project)],
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const related = projects
    .filter((p) => p.slug !== project.slug && p.category === project.category)
    .slice(0, 3);

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
              src={project.image}
              alt={`${project.title} interface - ${project.excerpt}`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <p className="text-muted-foreground normal-case">{project.overview}</p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">What it does</h2>
            <ul className="space-y-3">
              {project.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="relative pl-6 text-muted-foreground normal-case before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-2 before:h-2 before:bg-[#ff914d] before:rounded-full"
                >
                  {highlight}
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Stack</h2>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <span key={item} className="text-sm px-3 py-1 bg-muted rounded-md">
                  {item}
                </span>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">My role</h2>
            <p className="text-muted-foreground normal-case">{project.role}</p>
          </section>

          {(project.liveUrl || project.repoUrl) && (
            <div className="flex flex-wrap gap-3 mb-10">
              {project.liveUrl && (
                <Button asChild>
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    View live site
                  </a>
                </Button>
              )}
              {project.repoUrl && (
                <Button variant="outline" asChild>
                  <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                    View source
                  </a>
                </Button>
              )}
            </div>
          )}
        </article>

        {related.length > 0 && (
          <section className="mt-16 pt-10 border-t">
            <h2 className="text-2xl font-bold mb-6">More {project.category} work</h2>
            <ul className="space-y-4">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/projects/${item.slug}`}
                    className="text-lg font-medium hover:text-[#ff914d]"
                  >
                    {item.title}
                  </Link>
                  <p className="text-muted-foreground normal-case">{item.excerpt}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
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
