import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import Terminal from "@/components/Terminal";
import { Badge } from "@/components/ui/badge";
import { Section, SectionHeading } from "@/components/ui/section";
import { Timeline } from "@/components/ui/timeline";
import { blogPostSummaries } from "@/lib/blog";
import { allExperience, experienceGroups } from "@/lib/experience";
import { projects } from "@/lib/projects";
import { personId } from "@/lib/seo";
import { absoluteUrl, siteConfig } from "@/lib/site";
import type { TerminalContext } from "@/lib/terminal-commands";
import { GridBackgroundDemo } from "../components/GridBackgroundDemo";
import ContactSection from "../components/sections/ContactSection";
import Faq from "../components/sections/Faq";
import FeaturedProjects from "../components/sections/FeaturedProjects";
import Footer from "../components/sections/Footer";
import Hero from "../components/sections/Hero";
import Services from "../components/sections/Services";
import Stats from "../components/sections/Stats";
import Tools from "../components/sections/Tools";
import Writing from "../components/sections/Writing";

/*
 * Counted once here rather than duplicated in Stats: the Tools section is the
 * canonical list, so if a technology is added there the proof panel follows.
 */
const TECHNOLOGY_COUNT = 17;

const writingPosts = blogPostSummaries.slice(0, 5).map((post) => ({
  slug: post.slug,
  title: post.title,
  date: post.date,
  readTime: post.readTime,
  tags: post.tags,
}));

export const metadata: Metadata = {
  // Absolute so the brand suffix is not appended twice on the homepage.
  title: {
    absolute: siteConfig.title,
  },
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    title: siteConfig.title,
    description: siteConfig.description,
  },
};

const profileSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: absoluteUrl("/"),
  name: siteConfig.title,
  description: siteConfig.description,
  inLanguage: "en",
  mainEntity: { "@id": personId },
};

/*
 * Built here, on the server, and handed to <Terminal> as a prop. The terminal
 * is a client component, so it can never import lib/projects or lib/blog
 * itself -- both read the filesystem at module scope.
 */
const terminalContext: TerminalContext = {
  projects: projects.map((project) => ({
    slug: project.slug,
    title: project.title,
    excerpt: project.excerpt,
    category: project.category,
    year: project.year,
    role: project.role,
    stack: project.stack,
    liveUrl: project.liveUrl,
    repoUrl: project.repoUrl,
    timeline: project.timeline,
  })),
  posts: blogPostSummaries.slice(0, 6).map((post) => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
    readTime: post.readTime,
    tags: post.tags,
  })),
  experience: allExperience.map((role) => ({
    title: role.title,
    company: role.company,
    duration: role.duration,
  })),
  site: siteConfig,
};

export default function Home() {
  const timelineData = experienceGroups.map((group) => ({
    title: group.title,
    content: (
      // Keyed because this element is created inside a map and rendered by
      // Timeline as a child of its own list.
      <div key={group.title} className="max-w-3xl mx-auto">
        {group.items.map((experience) => (
          <div
            key={experience.id}
            className="mb-10 relative pl-8 before:content-[''] before:absolute before:left-0 before:top-2 before:w-3 before:h-3 before:bg-brand before:rounded-full before:ring-4 before:ring-brand/20 last:before:h-3"
          >
            <div className="absolute left-1.5 top-5 w-[1px] h-[calc(100%-24px)] bg-border"></div>
            <div>
              <Badge className="mb-4 inline-flex items-center rounded-full border border-brand/40 bg-transparent px-4 py-1 font-mono text-xs uppercase tracking-[0.18em] text-brand">
                {experience.duration}
              </Badge>

              <h3 className="text-xl font-bold">{experience.title}</h3>
              <p className="text-brand font-medium mb-2">{experience.company}</p>
              <p className="text-muted-foreground">{experience.description}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  }));

  return (
    <div>
      {/*
       * Every other route already wraps its content in <main>; the home page
       * was the one exception, so the page had no main landmark at all and
       * skip-to-content never had a target. The footer stays outside it.
       */}
      <main>
        <Hero />

        <Services />

        <Stats technologyCount={TECHNOLOGY_COUNT} />

        <GridBackgroundDemo>
          <FeaturedProjects />
        </GridBackgroundDemo>

        <section
          className="relative w-full overflow-clip"
          id="experience"
          aria-labelledby="experience-heading"
        >
          <Timeline data={timelineData} headingId="experience-heading" />
        </section>

        <Tools />

        <Writing posts={writingPosts} />

        <Section id="terminal" aria-labelledby="terminal-heading">
          <SectionHeading
            id="terminal-heading"
            index="07"
            eyebrow="Try it"
            title="Explore from the command line"
            lead="This page's own data, queryable. Every command reads the same modules the rest of the site renders from, so it can never drift out of date."
            className="mb-8"
          />
          <Terminal context={terminalContext} />
        </Section>

        <Faq />

        <ContactSection />
      </main>

      <Footer />
      <JsonLd schema={profileSchema} />
    </div>
  );
}
