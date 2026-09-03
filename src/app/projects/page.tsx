import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import ProjectsGrid from "@/components/ProjectsGrid";
import { projectCategories, projects } from "@/lib/projects";
import { collectionPageSchema } from "@/lib/seo";

const title = "Projects - Full Stack Web Development Work";
const description =
  "Selected web development work by Mehedi Imun, built with Next.js, React, TypeScript, Node.js and PostgreSQL - written up as case studies, not screenshots.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/projects" },
  openGraph: {
    type: "website",
    url: "/projects",
    title,
    description,
  },
};

export default function ProjectsPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10 py-12 mt-20">
      <h1 className="text-2xl md:text-4xl font-bold mb-4">
        Web development projects
      </h1>
      <p className="text-muted-foreground max-w-2xl mb-8 normal-case">
        {description}
      </p>

      <ProjectsGrid projects={projects} categories={projectCategories} />

      <JsonLd
        schema={collectionPageSchema({
          path: "/projects",
          name: "Projects",
          description,
          items: projects.map((project) => ({
            name: project.title,
            path: `/projects/${project.slug}`,
          })),
        })}
      />
    </main>
  );
}
