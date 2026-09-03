import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogCard from "@/components/BlogCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { getAllTagSlugs, getPostsByTagSlug } from "@/lib/blog";
import { breadcrumbSchema, collectionPageSchema } from "@/lib/seo";

interface PageProps {
  params: Promise<{ tag: string }>;
}

/** One archive page per tag actually present on a published post. */
export function generateStaticParams() {
  return getAllTagSlugs().map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag: tagSlug } = await params;
  const result = getPostsByTagSlug(tagSlug);

  if (!result) {
    return { title: "Tag Not Found", robots: { index: false, follow: false } };
  }

  const title = `${result.tag} - Blog`;
  const description = `Articles tagged "${result.tag}".`;

  return {
    title,
    description,
    alternates: { canonical: `/blog/tag/${tagSlug}` },
    openGraph: { type: "website", url: `/blog/tag/${tagSlug}`, title, description },
  };
}

export default async function TagArchivePage({ params }: PageProps) {
  const { tag: tagSlug } = await params;
  const result = getPostsByTagSlug(tagSlug);

  if (!result) {
    notFound();
  }

  const { tag, posts } = result;
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: tag, path: `/blog/tag/${tagSlug}` },
  ];

  return (
    <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10 py-12 pb-24 mt-20">
      <Breadcrumbs crumbs={crumbs} />
      <h1 className="text-3xl md:text-4xl font-bold mb-8">
        Posts tagged &ldquo;{tag}&rdquo;
      </h1>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">No published posts for this tag yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}

      <JsonLd
        schema={[
          collectionPageSchema({
            path: `/blog/tag/${tagSlug}`,
            name: `${tag} - Blog`,
            description: `Articles tagged "${tag}".`,
            items: posts.map((post) => ({ name: post.title, path: `/blog/${post.slug}` })),
          }),
          breadcrumbSchema(crumbs),
        ]}
      />
    </main>
  );
}
