"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PageTransition from "../components/PageTransition";
import BlogCard from "../components/BlogCard";

const blogPosts = [
  {
    id: "1",
    title: "Getting Started with Next.js",
    excerpt:
      "Learn how to build modern web applications with Next.js, the React framework for production.",
    date: "May 2, 2025",
    readTime: "5 min read",
    slug: "getting-started-with-nextjs",
    tags: ["Next.js", "React", "Tutorial"],
  },
  {
    id: "2",
    title: "Why I Switched to Tailwind CSS",
    excerpt:
      "After years of using traditional CSS and various preprocessors, I made the switch to Tailwind CSS. Here's why.",
    date: "April 28, 2025",
    readTime: "7 min read",
    slug: "why-i-switched-to-tailwind-css",
    tags: ["CSS", "Tailwind", "Web Development"],
  },
  {
    id: "3",
    title: "Creating Smooth Animations with Framer Motion",
    excerpt:
      "Learn how to add beautiful animations to your React applications using Framer Motion.",
    date: "April 21, 2025",
    readTime: "6 min read",
    slug: "creating-smooth-animations-with-framer-motion",
    tags: ["React", "Animation", "Framer Motion"],
  },
  {
    id: "4",
    title: "Building a Custom React Hook",
    excerpt:
      "A step-by-step guide to creating your own custom React hooks for reusable logic.",
    date: "April 15, 2025",
    readTime: "8 min read",
    slug: "building-a-custom-react-hook",
    tags: ["React", "Hooks", "JavaScript"],
  },
  {
    id: "5",
    title: "Understanding TypeScript Generics",
    excerpt:
      "A deep dive into TypeScript generics and how they can make your code more flexible and reusable.",
    date: "April 7, 2025",
    readTime: "10 min read",
    slug: "understanding-typescript-generics",
    tags: ["TypeScript", "JavaScript", "Programming"],
  },
  {
    id: "6",
    title: "The Future of Web Development",
    excerpt:
      "Exploring emerging trends and technologies that will shape the future of web development.",
    date: "March 29, 2025",
    readTime: "9 min read",
    slug: "the-future-of-web-development",
    tags: ["Web Development", "Trends", "Technology"],
  },
];

const allTags = Array.from(new Set(blogPosts.flatMap((post) => post.tags)));

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => post.tags.includes(tag));

    return matchesSearch && matchesTags;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto py-12">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>

        <div className="mb-8">
          <Input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4"
          />

          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Button
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">
              No articles found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
