import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AuthorBio from "@/components/AuthorBio";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Comments } from "@/components/Comments";
import JsonLd from "@/components/JsonLd";
import { mdxComponents } from "@/components/mdx-components";
import NewsletterSignup from "@/components/NewsletterSignup";
import PostNav from "@/components/PostNav";
import PostViews from "@/components/PostViews";
import ShareButtons from "@/components/ShareButtons";
import TableOfContents from "@/components/TableOfContents";
import { Button } from "@/components/ui/button";
import { blogPosts, getAdjacentPosts, getPostBySlug, getRelatedPosts } from "@/lib/blog";
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

  const postUrl = absoluteUrl(`/blog/${post.slug}`);
  const relatedPosts = getRelatedPosts(post);
  const { prev, next } = getAdjacentPosts(post);
  const toc = getTableOfContents(post.content);
  // The cover is the LCP element, so it carries `priority` and real dimensions.
  const coverDimensions = post.cover ? localImageDimensions(post.cover) : null;
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ];

  return (
    <div className="bg-background min-h-screen">
      <main className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10 py-12 pb-24 mt-20">
        <div className="mx-auto max-w-3xl">
          <Button
            variant="ghost"
            asChild
            className="mb-4 pl-0 hover:bg-transparent"
          >
            <Link href="/blog" className="flex items-center">
              <ArrowLeft size={16} className="mr-2" /> Back to Blog
            </Link>
          </Button>

          <Breadcrumbs crumbs={crumbs} />

          <header className="mb-8" lang={post.lang} dir={dirFor(post.lang)}>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
              <Image
                src="/hero-portrait.png"
                alt=""
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
              <span className="font-medium text-foreground">{siteConfig.name}</span>
              <span aria-hidden="true">&bull;</span>
              <time dateTime={post.dateISO}>{post.date}</time>
              <span aria-hidden="true">&bull;</span>
              <span>{post.readTime}</span>
              <PostViews path={`/blog/${post.slug}`} />
              {post.draft ? (
                <span className="rounded-md border border-dashed px-2 py-0.5 text-xs uppercase tracking-wide">
                  Draft - not published
                </span>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-1 bg-muted rounded-md">
                  {tag}
                </span>
              ))}
            </div>
          </header>
        </div>

        {/* Full-bleed cover: wider than the reading column above and below it. */}
        {post.cover && coverDimensions ? (
          <div className="mx-auto mb-10 max-w-4xl">
            <Image
              src={post.cover}
              alt={post.coverAlt ?? ""}
              width={coverDimensions.width}
              height={coverDimensions.height}
              sizes="(max-width: 1024px) 100vw, 896px"
              priority
              className="w-full rounded-lg object-cover"
            />
          </div>
        ) : null}

        <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_min(48rem,100%)_minmax(0,1fr)] xl:gap-6">
          <aside className="hidden xl:flex xl:justify-end">
            <div className="sticky top-28 self-start">
              <ShareButtons url={postUrl} title={post.title} variant="rail" />
            </div>
          </aside>

          <article lang={post.lang} dir={dirFor(post.lang)} className="min-w-0">
            {/* Mobile/tablet share row -- the sticky rail above only shows at xl. */}
            <div className="mb-8 xl:hidden">
              <ShareButtons url={postUrl} title={post.title} variant="inline" />
            </div>

            {toc.length > 2 ? (
              <div className="mb-8 rounded-lg border bg-muted/40 p-5 xl:hidden">
                <TableOfContents toc={toc} />
              </div>
            ) : null}

            <div className="prose dark:prose-invert max-w-none break-words [overflow-wrap:anywhere]">
              <MDXRemote
                source={post.content}
                components={mdxComponents}
                options={mdxOptions}
              />
            </div>

            <PostNav prev={prev} next={next} />

            <div className="mt-12">
              <AuthorBio />
            </div>

            <div className="mt-8">
              <NewsletterSignup />
            </div>

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
                        <span
                          lang={related.lang}
                          data-post-title
                          className="block font-semibold"
                        >
                          {related.title}
                        </span>
                        <span
                          lang={related.lang}
                          className="mt-2 block text-sm text-muted-foreground line-clamp-2"
                        >
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
          </article>

          <aside className="hidden xl:flex xl:justify-start">
            {toc.length > 2 ? (
              <div className="sticky top-28 w-56 self-start">
                <TableOfContents toc={toc} />
              </div>
            ) : null}
          </aside>
        </div>
      </main>

      <JsonLd schema={[blogPostingSchema(post), breadcrumbSchema(crumbs)]} />
    </div>
  );
}
