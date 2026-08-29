import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogPostInteractions from "@/components/BlogPostInteractions";
import { CommentSection } from "@/components/CommentSection";
import JsonLd from "@/components/JsonLd";
import { Button } from "@/components/ui/button";
import { blogPosts, getPostBySlug } from "@/lib/blog";
import { blogPostingSchema, breadcrumbSchema } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Pre-renders every post at build time instead of resolving the slug in the browser. */
export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      url: `/blog/${post.slug}`,
      title: post.title,
      description: post.description,
      publishedTime: post.dateISO,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  // Returns a real 404 status rather than rendering a 200 "not found" screen.
  if (!post) {
    notFound();
  }

  const shareUrl = encodeURIComponent(absoluteUrl(`/blog/${post.slug}`));
  const shareText = encodeURIComponent(post.title);

  return (
    <div className="bg-gradient-to-br from-background via-background to-muted/30 min-h-screen">
      <main className="max-w-7xl mx-auto px-4 lg:px-0 py-12 pb-24 mt-20">
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

          <article className="bg-gradient-to-br from-card to-card/95 border rounded-xl shadow-md p-5 md:p-8">
            <header className="mb-8">
              <h1 className="text-2xl md:text-4xl font-bold mb-4">
                {post.title}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <time dateTime={post.dateISO}>{post.date}</time>
                <span>&bull;</span>
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

            <div className="prose dark:prose-invert max-w-none break-words [overflow-wrap:anywhere] [&_pre]:overflow-x-auto">
              <MDXRemote source={post.content} />
            </div>

            <BlogPostInteractions slug={post.slug} />

            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" asChild className="min-h-11 px-3">
                <a
                  href={`https://x.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Share on X
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild className="min-h-11 px-3">
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Share on LinkedIn
                </a>
              </Button>
            </div>
          </article>

          <section id="comments" className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Comments</h2>
            <CommentSection postSlug={post.slug} />
          </section>
        </div>
      </main>

      <JsonLd
        schema={[
          blogPostingSchema(post),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />
    </div>
  );
}
