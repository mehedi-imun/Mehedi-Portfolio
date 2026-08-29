import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog";
import { projects } from "@/lib/projects";
import { absoluteUrl } from "@/lib/site";

/**
 * Every lastModified in here is a real content date or is absent. Nothing is
 * stamped with the build time -- see the note inside on why.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  /*
   * The newest thing actually published, or undefined when nothing is.
   * `lastModified` is omitted rather than filled with the build date: stamping
   * every deploy onto pages that did not change teaches crawlers to ignore the
   * field everywhere, including on the post URLs where it is accurate.
   */
  const latestPostDate = blogPosts.length
    ? new Date(
        Math.max(
          ...blogPosts.map((post) =>
            new Date(post.updated ?? post.dateISO).getTime()
          )
        )
      )
    : undefined;

  const staticRoutes: MetadataRoute.Sitemap = [
    // The home page surfaces the newest writing, so it moves when writing does.
    { url: absoluteUrl("/"), lastModified: latestPostDate, changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/about"), changeFrequency: "yearly", priority: 0.8 },
    { url: absoluteUrl("/projects"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/blog"), lastModified: latestPostDate, changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/contact"), changeFrequency: "yearly", priority: 0.6 },
  ];

  // projects excludes drafts, as blogPosts does.
  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: absoluteUrl(`/projects/${project.slug}`),
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  // blogPosts excludes drafts, so an unpublished post never reaches the sitemap.
  const postRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.updated ?? post.dateISO),
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes, ...postRoutes];
}
