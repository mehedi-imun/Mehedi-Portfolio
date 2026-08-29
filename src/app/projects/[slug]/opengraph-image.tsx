import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getProjectBySlug, projects } from "@/lib/projects";
import { siteConfig } from "@/lib/site";

export const alt = "Project";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Drafts are excluded here for the same reason they are excluded from the route. */
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

/* Satori renders only from the buffers passed in; see the blog OG route. */
const FONT_DIR = join(process.cwd(), "public", "fonts");
const readFont = (file: string) => readFileSync(join(FONT_DIR, file));

const fonts = [
  {
    name: "Geist",
    data: readFont("geist-sans-latin-400-normal.woff"),
    weight: 400 as const,
    style: "normal" as const,
  },
  {
    name: "Geist",
    data: readFont("geist-sans-latin-700-normal.woff"),
    weight: 700 as const,
    style: "normal" as const,
  },
  {
    name: "Hind Siliguri",
    data: readFont("hind-siliguri-bengali-400-normal.woff"),
    weight: 400 as const,
    style: "normal" as const,
  },
  {
    name: "Hind Siliguri",
    data: readFont("hind-siliguri-bengali-700-normal.woff"),
    weight: 700 as const,
    style: "normal" as const,
  },
];

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * Mirrors the blog and site-level OG cards so the three cannot drift apart.
 * Replaces pointing og:image at the raw cover with Unsplash-only crop params,
 * which produced a meaningless relative URL for any local cover.
 */
export default async function ProjectOpengraphImage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#0a0a0a",
          color: "#fafafa",
          fontFamily: "Geist, 'Hind Siliguri'",
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
          {project?.category ?? "Project"}
        </div>

        <div style={{ display: "flex", fontSize: 72, fontWeight: 700, lineHeight: 1.1 }}>
          {project?.title ?? siteConfig.name}
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
            {project ? `${project.role} · ${project.year}` : siteConfig.name}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
