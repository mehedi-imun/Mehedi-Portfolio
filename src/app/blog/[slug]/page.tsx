"use client";

import { CommentSection } from "@/app/components/CommentSection";
import PageTransition from "@/app/components/PageTransition";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// The structure of the blog posts data
const blogPosts = {
  "getting-started-with-nextjs": {
    title: "getting-started-with-nextjs",
    description:
      "Learn the basics of setting up a Next.js project and explore its key features for server-rendered React applications.",
    date: "May 2, 2025",
    readTime: "5 min read",
    tags: ["Next.js", "React", "Tutorial"],
    content: `
      <p class="lead">Next.js is a popular React framework that makes it easy to build server-rendered React applications. In this post, we'll go through the basics of setting up a Next.js project and explore its key features.</p>
      <h2>What is Next.js?</h2>
      <p>Next.js is a React framework that provides a structure for building server-rendered React applications. It comes with built-in features like file system routing, API routes, and static site generation, making it a powerful tool for building modern web applications.</p>
      <h2>Setting up a Next.js Project</h2>
      <p>To create a new Next.js application, you can use the create-next-app command:</p>
      <pre><code>npx create-next-app my-next-app</code></pre>
      <p>This will set up a new Next.js project with all the necessary configurations and dependencies.</p>
      <h2>Key Features of Next.js</h2>
      <h3>1. File System Routing</h3>
      <p>Next.js uses the file system for routing. Any file inside the pages directory becomes a route that's automatically processed and rendered.</p>
      <h3>2. Pre-rendering</h3>
      <p>Next.js pre-renders every page by default, which means it generates HTML for each page in advance rather than using client-side JavaScript. This results in better performance and SEO.</p>
      <h3>3. API Routes</h3>
      <p>Next.js allows you to create API endpoints as serverless functions by adding files to the pages/api directory.</p>
      <h2>Conclusion</h2>
      <p>Next.js is a powerful framework that simplifies the process of building React applications. With its built-in features and optimizations, it's a great choice for building modern, performant web applications.</p>
    `,
  },
  "why-i-switched-to-tailwind-css": {
    title: "Why I Switched to Tailwind CSS",
    description:
      "My journey from traditional CSS to Tailwind CSS and how it transformed my development workflow for the better.",
    date: "April 28, 2025",
    readTime: "7 min read",
    tags: ["CSS", "Tailwind", "Web Development"],
    content: `
      <p class="lead">After years of using traditional CSS and various preprocessors, I made the switch to Tailwind CSS. Here's why it has transformed my development workflow.</p>
      <h2>The Problem with Traditional CSS</h2>
      <p>Traditional CSS can quickly become unwieldy as projects grow. Class names become hard to manage, and the CSS files become bloated. Even with preprocessors like Sass or Less, the maintenance overhead can be significant.</p>
      <h2>Enter Tailwind CSS</h2>
      <p>Tailwind CSS takes a utility-first approach to styling, providing low-level utility classes that let you build completely custom designs without ever leaving your HTML.</p>
      <h2>Benefits of Tailwind CSS</h2>
      <h3>1. Developer Experience</h3>
      <p>With Tailwind, you spend less time context-switching between HTML and CSS files. Everything you need is right there in your HTML, making the development process faster and more intuitive.</p>
      <h3>2. Consistency</h3>
      <p>Tailwind promotes consistency by providing a predefined set of utility classes with consistent spacing, typography, and color scales.</p>
      <h3>3. Customization</h3>
      <p>Despite being a utility-first framework, Tailwind is highly customizable. You can easily override the default configuration to match your design system.</p>
      <h2>Overcoming Initial Resistance</h2>
      <p>I was initially resistant to Tailwind because it seemed to violate the principle of separation of concerns. However, I've come to realize that the benefits far outweigh this concern, especially for modern component-based architectures.</p>
      <h2>Conclusion</h2>
      <p>Switching to Tailwind CSS has significantly improved my development workflow. It's faster, more maintainable, and more enjoyable to work with. If you're still on the fence, I encourage you to give it a try.</p>
    `,
  },
};

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  console.log(slug)
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [hasLiked, setHasLiked] = useState<Record<string, boolean>>({});
  const post = slug ? blogPosts[slug as keyof typeof blogPosts] : null;

  // Initialize likes from localStorage on component mount
  useEffect(() => {
    const savedLikes = localStorage.getItem("blogLikes");
    const savedHasLiked = localStorage.getItem("blogHasLiked");

    if (savedLikes) setLikes(JSON.parse(savedLikes));
    if (savedHasLiked) setHasLiked(JSON.parse(savedHasLiked));
  }, []);

  const handleLike = (postSlug: string) => {
    if (hasLiked[postSlug]) return;

    const newLikes = {
      ...likes,
      [postSlug]: (likes[postSlug] || 0) + 1,
    };

    const newHasLiked = {
      ...hasLiked,
      [postSlug]: true,
    };

    setLikes(newLikes);
    setHasLiked(newHasLiked);

    localStorage.setItem("blogLikes", JSON.stringify(newLikes));
    localStorage.setItem("blogHasLiked", JSON.stringify(newHasLiked));
  };

  if (!post) {
    return (
      <PageTransition>
        <div className="page-container py-12">
          <div className="text-center py-12">
            <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
            <p className="text-xl text-muted-foreground mb-6">
              The blog post you're looking for doesn't exist.
            </p>
            <Button asChild>
              <Link href="/blog">Back to Blog</Link>
            </Button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="bg-gradient-to-br from-background via-background to-muted/30 min-h-screen">
        <div className="page-container py-12 pb-24">
          <div className="max-w-3xl mx-auto">
            <Button
              variant="ghost"
              asChild
              className="mb-6 pl-0 hover:bg-transparent"
            >
              <Link href="/blog" className="flex items-center">
                <ArrowLeft size={16} className="mr-2" /> Back to Blog
              </Link>
            </Button>

            <article className="bg-gradient-to-br from-card to-card/95 border rounded-xl shadow-md p-8 animate-fade-in">
              <header className="mb-8">
                <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-muted rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </header>

              <div
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              <div className="mt-12 pt-6 border-t flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`flex items-center gap-2 transition-all ${
                      hasLiked[slug]
                        ? "text-red-500 border-red-200 dark:border-red-800"
                        : ""
                    }`}
                    onClick={() => slug && handleLike(slug)}
                    disabled={slug ? hasLiked[slug] : false}
                  >
                    <Heart
                      size={16}
                      className={`${
                        hasLiked[slug] ? "fill-red-500" : ""
                      } transition-all ${
                        !hasLiked[slug] && "group-hover:scale-110"
                      }`}
                    />
                    {likes[slug as string] || 0} Likes
                  </Button>

                  <a href="#comments">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <MessageSquare size={16} />
                      Comments
                    </Button>
                  </a>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Twitter
                  </Button>
                  <Button variant="outline" size="sm">
                    LinkedIn
                  </Button>
                </div>
              </div>
            </article>

            <section id="comments" className="mt-16">
              <h2 className="text-2xl font-bold mb-6">Comments</h2>
              {slug && <CommentSection postSlug={slug} />}
            </section>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default BlogPostPage;
