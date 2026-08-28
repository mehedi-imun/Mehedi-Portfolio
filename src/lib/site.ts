/**
 * Single source of truth for site-wide SEO values.
 *
 * Canonical URLs, the sitemap, robots.txt and all OpenGraph image URLs are
 * derived from `url`. Set NEXT_PUBLIC_SITE_URL to override it for a preview or
 * staging origin; production falls back to the real domain below.
 */
export const siteConfig = {
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://mehediimun.com").replace(/\/$/, ""),
  name: "Mehedi Imun",
  jobTitle: "Full Stack Web Developer",
  title: "Mehedi Imun - Full Stack Web Developer",
  description:
    "Full stack web developer in Dhaka, Bangladesh building scalable backends with Node.js, Express, PostgreSQL and TypeScript. 4 years of experience in API design, Docker and CI/CD.",
  locale: "en_US",
  email: "mehediimun@gmail.com",
  location: {
    city: "Dhaka",
    country: "Bangladesh",
  },
  keywords: [
    "Mehedi Imun",
    "full stack developer",
    "Node.js developer",
    "Next.js developer",
    "TypeScript developer",
    "PostgreSQL",
    "API design",
    "web developer Bangladesh",
  ],
  socials: {
    github: "https://github.com/mehedi-imun",
    linkedin: "https://www.linkedin.com/in/mehedi-imun/",
    x: "https://x.com/mehediimun",
    facebook: "https://www.facebook.com/mehediimun",
  },
  resumeUrl:
    "https://drive.google.com/file/d/1WzqGN9kf2jtiDm-mzn8VYQKuMSJSFySq/view?usp=sharing",
} as const;

export const socialProfiles = Object.values(siteConfig.socials);

/** Build an absolute URL for canonicals, sitemap entries and OG images. */
export function absoluteUrl(path = "/"): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
