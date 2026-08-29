import { blogPosts } from "@/lib/blog";
import { absoluteUrl, siteConfig } from "@/lib/site";

/**
 * RSS 2.0 feed. Static: it reads the same synchronous post list the sitemap
 * does, so it is generated once at build time rather than per request.
 */
export const dynamic = "force-static";

const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ESCAPES[char]);
}

/** RSS requires RFC-822 dates, not the ISO strings used everywhere else. */
function rfc822(dateISO: string): string {
  return new Date(`${dateISO}T00:00:00Z`).toUTCString();
}

export function GET() {
  const feedUrl = absoluteUrl("/rss.xml");

  const items = blogPosts
    .map((post) => {
      const url = absoluteUrl(`/blog/${post.slug}`);
      const categories = post.tags
        .map((tag) => `      <category>${escapeXml(tag)}</category>`)
        .join("\n");

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${rfc822(post.updated ?? post.dateISO)}</pubDate>
      <description>${escapeXml(post.description)}</description>
${categories}
    </item>`;
    })
    .join("\n");

  const lastBuildDate = blogPosts[0]
    ? `    <lastBuildDate>${rfc822(blogPosts[0].updated ?? blogPosts[0].dateISO)}</lastBuildDate>\n`
    : "";

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.title)}</title>
    <link>${absoluteUrl("/blog")}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en</language>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
${lastBuildDate}${items}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
