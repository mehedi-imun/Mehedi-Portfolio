"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const projects = [
  {
    id: 1,
    title: "getting-started-with-nextjs",
    description: "A modern e-commerce platform built with Next.js and Tailwind CSS.",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    link: "/projects/1",
  },
  {
    id: 2,
    title: "Portfolio Website",
    description: "A responsive portfolio website with dark/light theme toggle.",
    tags: ["React", "Framer Motion", "Tailwind"],
    image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5",
    link: "/projects/portfolio",
  },
  {
    id: 3,
    title: "Blog Platform",
    description: "A minimal blog platform with markdown support.",
    tags: ["Next.js", "MDX", "Tailwind"],
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    link: "/projects/blog-platform",
  },
];

export default function FeaturedProjects() {
  return (
    <section className="py-10 max-w-7xl mx-auto " id="projects">
      <div className="page-container">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12">
          <div>
            <h2 className="section-heading">Featured Projects</h2>
            <p className="text-muted-foreground max-w-2xl">
              Check out some of my recent work.
            </p>
          </div>
          <Button variant="outline" asChild className="mt-4 md:mt-0">
            <Link href="/projects">View All Projects</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                />
              </div>
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-1 bg-muted rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild className="w-full">
                  <Link href={project.link}>View Project</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
