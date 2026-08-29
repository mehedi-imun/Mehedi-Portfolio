import type { BlogPost } from "./blog";
import { allExperience } from "./experience";
import type { Project } from "./projects";
import { projectOgImage } from "./projects";
import { absoluteUrl, siteConfig, socialProfiles } from "./site";

/** Stable @id so other schema nodes can reference the same Person entity. */
export const personId = absoluteUrl("/#person");
const websiteId = absoluteUrl("/#website");

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId,
    name: siteConfig.name,
    url: absoluteUrl("/"),
    jobTitle: siteConfig.jobTitle,
    description: siteConfig.description,
    email: `mailto:${siteConfig.email}`,
    image: absoluteUrl("/hero-portrait.png"),
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.location.city,
      addressCountry: siteConfig.location.country,
    },
    sameAs: socialProfiles,
    knowsAbout: [
      "Node.js",
      "Express",
      "PostgreSQL",
      "TypeScript",
      "React",
      "Next.js",
      "API design",
      "Docker",
      "CI/CD",
    ],
    worksFor: {
      "@type": "Organization",
      name: allExperience[0].company,
    },
    hasOccupation: allExperience.map((role) => ({
      "@type": "Occupation",
      name: role.title,
      occupationLocation: {
        "@type": "Organization",
        name: role.company,
      },
    })),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    url: absoluteUrl("/"),
    name: siteConfig.title,
    description: siteConfig.description,
    inLanguage: "en",
    publisher: { "@id": personId },
  };
}

export function blogPostingSchema(post: BlogPost) {
  const url = absoluteUrl(`/blog/${post.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.description,
    url,
    mainEntityOfPage: url,
    datePublished: post.dateISO,
    // Falls back to the publication date so an unrevised post does not claim
    // to have changed; `updated` is the only thing that moves this.
    dateModified: post.updated ?? post.dateISO,
    keywords: post.tags,
    // Only posts vary; the site chrome and static pages stay English.
    inLanguage: post.lang,
    author: { "@id": personId },
    publisher: { "@id": personId },
    // A real cover photo beats the generated title card when one exists.
    image: absoluteUrl(post.cover ?? `/blog/${post.slug}/opengraph-image`),
  };
}

export function blogSchema(
  posts: Pick<BlogPost, "slug" | "title" | "description" | "dateISO" | "lang">[]
) {
  const url = absoluteUrl("/blog");
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${url}#blog`,
    url,
    name: `${siteConfig.name} - Blog`,
    description: siteConfig.description,
    inLanguage: "en",
    isPartOf: { "@id": websiteId },
    author: { "@id": personId },
    publisher: { "@id": personId },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      "@id": `${absoluteUrl(`/blog/${post.slug}`)}#article`,
      headline: post.title,
      description: post.description,
      url: absoluteUrl(`/blog/${post.slug}`),
      datePublished: post.dateISO,
      inLanguage: post.lang,
      author: { "@id": personId },
    })),
  };
}

export function projectSchema(project: Project) {
  const url = absoluteUrl(`/projects/${project.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${url}#project`,
    name: project.title,
    description: project.description,
    url,
    dateCreated: project.year,
    keywords: project.tags,
    genre: project.category,
    // The real cover photo, not the generated card, is the better entity image.
    image: projectOgImage(project),
    creator: { "@id": personId },
    ...(project.liveUrl ? { sameAs: project.liveUrl } : {}),
  };
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

export function collectionPageSchema({
  path,
  name,
  description,
  items,
}: {
  path: string;
  name: string;
  description: string;
  items: { name: string; path: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    url: absoluteUrl(path),
    name,
    description,
    inLanguage: "en",
    isPartOf: { "@id": websiteId },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: absoluteUrl(item.path),
      })),
    },
  };
}
