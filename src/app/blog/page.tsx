import type { Metadata } from "next";
import BlogIndex from "@/components/BlogIndex";
import JsonLd from "@/components/JsonLd";
import { allTags, blogPostSummaries } from "@/lib/blog";
import { blogSchema, collectionPageSchema } from "@/lib/seo";

const title = "Blog";
const description =
  "Articles on Next.js, React, TypeScript, Tailwind CSS and backend development, written from production experience by Mehedi Imun.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: "/blog",
    title,
    description,
  },
};

export default function BlogPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10 py-12 mt-20">
      <h1 className="text-2xl md:text-4xl font-bold mb-4">
        Writing on web development
      </h1>
      <p className="text-muted-foreground max-w-2xl mb-8 normal-case">
        {description}
      </p>

      <BlogIndex posts={blogPostSummaries} tags={allTags} />

      <JsonLd
        schema={[
          blogSchema(blogPostSummaries),
          collectionPageSchema({
            path: "/blog",
            name: "Blog",
            description,
            items: blogPostSummaries.map((post) => ({
              name: post.title,
              path: `/blog/${post.slug}`,
            })),
          }),
        ]}
      />
    </main>
  );
}
