import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogPostInteractions from "@/components/BlogPostInteractions";
import { Comments } from "@/components/Comments";
import JsonLd from "@/components/JsonLd";
import { mdxComponents } from "@/components/mdx-components";
import { Button } from "@/components/ui/button";
import { blogPosts, getPostBySlug, getRelatedPosts } from "@/lib/blog";
import { localImageDimensions } from "@/lib/images";
import { dirFor, ogLocaleFor } from "@/lib/lang";
import { getTableOfContents, mdxOptions } from "@/lib/mdx";
import { blogPostingSchema, breadcrumbSchema } from "@/lib/seo";
import { absoluteUrl, siteConfig } from "@/lib/site";

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
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    alternates: { canonical: `/blog/${post.slug}` },
    // A draft stays reachable for preview, so it has to be kept out of the
    // index explicitly -- being absent from the sitemap is not enough.
    ...(post.draft ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      type: "article",
      url: `/blog/${post.slug}`,
      locale: ogLocaleFor(post.lang),
      title: post.title,
      description: post.description,
      publishedTime: post.dateISO,
      modifiedTime: post.updated ?? post.dateISO,
      authors: [siteConfig.name],
      tags: post.tags,
      // Without a cover the route falls through to the generated title card.
      ...(post.cover
        ? { images: [{ url: post.cover, alt: post.coverAlt ?? post.title }] }
        : {}),
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
  const relatedPosts = getRelatedPosts(post);
  const toc = getTableOfContents(post.content);
  // The cover is the LCP element, so it carries `priority` and real dimensions.
  const coverDimensions = post.cover ? localImageDimensions(post.cover) : null;

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

          <article
            lang={post.lang}
            dir={dirFor(post.lang)}
            className="bg-gradient-to-br from-card to-card/95 border rounded-xl shadow-md p-5 md:p-8"
          >
            <header className="mb-8">
              <h1 className="text-2xl md:text-4xl font-bold mb-4">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
                <span>By {siteConfig.name}</span>
                <span aria-hidden="true">&bull;</span>
                <time dateTime={post.dateISO}>{post.date}</time>
                <span aria-hidden="true">&bull;</span>
                <span>{post.readTime}</span>
                {post.draft ? (
                  <span className="rounded-md border border-dashed px-2 py-0.5 text-xs uppercase tracking-wide">
                    Draft - not published
                  </span>
                ) : null}
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

            {post.cover && coverDimensions ? (
              <Image
                src={post.cover}
                alt={post.coverAlt ?? ""}
                width={coverDimensions.width}
                height={coverDimensions.height}
                sizes="(max-width: 768px) 100vw, 768px"
                priority
                className="mb-8 w-full rounded-lg object-cover"
              />
            ) : null}

            {toc.length > 2 ? (
              <nav
                aria-labelledby="toc-heading"
                className="mb-8 rounded-lg border bg-muted/40 p-5"
              >
                <h2 id="toc-heading" className="mb-3 text-sm font-semibold uppercase tracking-wide">
                  On this page
                </h2>
                <ol className="space-y-1.5 text-sm">
                  {toc.map((entry) => (
                    <li
                      key={entry.slug}
                      className={entry.depth === 3 ? "ml-4" : undefined}
                    >
                      <a
                        href={`#${entry.slug}`}
                        className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                      >
                        {entry.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            ) : null}

            <div className="prose dark:prose-invert max-w-none break-words [overflow-wrap:anywhere] [&_pre]:overflow-x-auto">
              <MDXRemote
                source={post.content}
                components={mdxComponents}
                options={mdxOptions}
              />
            </div>

            <BlogPostInteractions />

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

          {relatedPosts.length > 0 ? (
            <section aria-labelledby="related-heading" className="mt-16">
              <h2 id="related-heading" className="text-2xl font-bold mb-6">
                Related posts
              </h2>
              <ul className="grid gap-4 sm:grid-cols-2">
                {relatedPosts.map((related) => (
                  <li key={related.slug}>
                    <Link
                      href={`/blog/${related.slug}`}
                      className="block h-full rounded-xl border bg-card p-5 transition-shadow hover:shadow-md"
                    >
                      <span className="block font-semibold">{related.title}</span>
                      <span className="mt-2 block text-sm text-muted-foreground line-clamp-2">
                        {related.excerpt}
                      </span>
                      <span className="mt-3 block text-xs text-muted-foreground">
                        <time dateTime={related.dateISO}>{related.date}</time>
                        {" - "}
                        {related.readTime}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section id="comments" className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Comments</h2>
            <Comments term={post.slug} />
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
