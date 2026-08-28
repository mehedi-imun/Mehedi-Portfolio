import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import ProjectsGrid from "@/components/ProjectsGrid";
import { projects } from "@/lib/projects";
import { collectionPageSchema } from "@/lib/seo";

const title = "Projects";
const description =
  "Selected web development projects by Mehedi Imun, built with Next.js, React, TypeScript, Node.js and PostgreSQL - from e-commerce platforms to internal tools.";

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
    <main className="max-w-7xl mx-auto px-4 lg:px-0 py-12 mt-20">
      <h1 className="text-2xl md:text-4xl font-bold mb-4">
        Web development projects
      </h1>
      <p className="text-muted-foreground max-w-2xl mb-8 normal-case">
        {description}
      </p>

      <ProjectsGrid projects={projects} />

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
