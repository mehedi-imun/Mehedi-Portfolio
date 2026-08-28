import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { Badge } from "@/components/ui/badge";
import { Timeline } from "@/components/ui/timeline";
import { experienceGroups } from "@/lib/experience";
import { personId } from "@/lib/seo";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { GridBackgroundDemo } from "../components/GridBackgroundDemo";
import ContactSection from "../components/sections/ContactSection";
import FeaturedProjects from "../components/sections/FeaturedProjects";
import Footer from "../components/sections/Footer";
import Hero from "../components/sections/Hero";
import Tools from "../components/sections/Tools";

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
              <Badge className="inline-flex items-center rounded-full px-4 py-1 text-sm font-medium bg-muted/30 text-[#ff914d] mb-4">
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
      <Hero />
      <GridBackgroundDemo>
        <FeaturedProjects />
      </GridBackgroundDemo>

      <section
        className="relative w-full overflow-clip px-4 lg:px-0"
        id="experience"
        aria-labelledby="experience-heading"
      >
        <h2 id="experience-heading" className="sr-only">
          Work experience
        </h2>
        <Timeline data={timelineData} />
      </section>

      <Tools />

      <ContactSection />

      <Footer />
      <JsonLd schema={profileSchema} />
    </div>
  );
}
