import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { blogPosts, getPostBySlug } from "@/lib/blog";
import { dirFor } from "@/lib/lang";
import { siteConfig } from "@/lib/site";

/*
 * Satori does not use next/font or any system font -- it only renders glyphs
 * from the buffers handed to it, so a Bangla title would come out as tofu
 * without these. Both scripts are supplied and Satori falls back per glyph
 * across the array, which is what makes a mixed-script title render.
 *
 * WOFF, not WOFF2: Satori cannot decompress WOFF2. Files live in public/ so
 * they are always present in the deployment, and are read once at module scope
 * rather than per image.
 */
const FONT_DIR = join(process.cwd(), "public", "fonts");

const readFont = (file: string) => readFileSync(join(FONT_DIR, file));

const fonts = [
  { name: "Geist", data: readFont("geist-sans-latin-400-normal.woff"), weight: 400 as const, style: "normal" as const },
  { name: "Geist", data: readFont("geist-sans-latin-700-normal.woff"), weight: 700 as const, style: "normal" as const },
  { name: "Noto Sans Bengali", data: readFont("noto-sans-bengali-bengali-400-normal.woff"), weight: 400 as const, style: "normal" as const },
  { name: "Noto Sans Bengali", data: readFont("noto-sans-bengali-bengali-700-normal.woff"), weight: 700 as const, style: "normal" as const },
];

export const alt = "Blog post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Drafts are excluded here for the same reason they are excluded from the route. */
export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * Per-post card, mirroring src/app/opengraph-image.tsx so the two cannot drift
 * apart visually. Without this every post shares one image and social previews
 * are indistinguishable.
 */
export default async function BlogPostOpengraphImage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          direction: post ? dirFor(post.lang) : "ltr",
          padding: "80px",
          background: "#0a0a0a",
          color: "#fafafa",
          // Latin first; Satori falls through to the Bengali face per glyph.
          fontFamily: "Geist, 'Noto Sans Bengali'",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#ff914d",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {post?.tags[0] ?? "Article"}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.1,
          }}
        >
          {post?.title ?? siteConfig.name}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              height: 8,
              width: 160,
              background: "#ff914d",
              borderRadius: 4,
              marginBottom: 28,
            }}
          />
          <div style={{ display: "flex", fontSize: 30, color: "#a3a3a3" }}>
            {post ? `${siteConfig.name} · ${post.date} · ${post.readTime}` : siteConfig.name}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
