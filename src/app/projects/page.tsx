"use client";

import { useState } from "react";
// import PageTransition from "@/components/PageTransition";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PageTransition from "../components/PageTransition";
import Image from "next/image";

const projects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "A modern e-commerce platform built with Next.js and Tailwind CSS.",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    link: "/projects/e-commerce",
    category: "Web App",
  },
  {
    id: 2,
    title: "Portfolio Website",
    description: "A responsive portfolio website with dark/light theme toggle.",
    tags: ["React", "Framer Motion", "Tailwind"],
    image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5",
    link: "/projects/portfolio",
    category: "Website",
  },
  {
    id: 3,
    title: "Blog Platform",
    description: "A minimal blog platform with markdown support.",
    tags: ["Next.js", "MDX", "Tailwind"],
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    link: "/projects/blog-platform",
    category: "Web App",
  },
  {
    id: 4,
    title: "Weather App",
    description: "A beautiful weather application with interactive maps.",
    tags: ["React", "API", "Tailwind"],
    image: "https://images.unsplash.com/photo-1532074205216-d0e1f4b87368",
    link: "/projects/weather-app",
    category: "Web App",
  },
  {
    id: 5,
    title: "Task Manager",
    description: "A productivity app for managing daily tasks and projects.",
    tags: ["Next.js", "TypeScript", "Firebase"],
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b",
    link: "/projects/task-manager",
    category: "Web App",
  },
  {
    id: 6,
    title: "Restaurant Website",
    description: "A responsive website for a local restaurant with online ordering.",
    tags: ["React", "Styled Components", "Node.js"],
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    link: "/projects/restaurant-website",
    category: "Website",
  },
];

const categories = ["All", "Web App", "Website", "Mobile"];

const ProjectPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = activeCategory === "All"
    ? projects
    : projects.filter(project => project.category === activeCategory);

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto  py-12">
        <h1 className="text-4xl font-bold mb-8">Projects</h1>
        
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video relative overflow-hidden">
                <Image 
                  src={project.image} 
                  alt={project.title} 
                  className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                  width={500}
                  height={300}
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
    </PageTransition>
  );
};

export default ProjectPage;
