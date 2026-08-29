import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import Footer from "@/components/sections/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { experienceGroups } from "@/lib/experience";
import { breadcrumbSchema, personId } from "@/lib/seo";
import { absoluteUrl, siteConfig } from "@/lib/site";

const title = "About";
const description =
  "Mehedi Imun is a full stack web developer in Dhaka, Bangladesh with 4 years of experience in Node.js, Express, PostgreSQL and TypeScript, and 3 years teaching web development.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about" },
  openGraph: {
    type: "profile",
    url: "/about",
    title,
    description,
  },
};

const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  url: absoluteUrl("/about"),
  name: `About ${siteConfig.name}`,
  description,
  inLanguage: "en",
  mainEntity: { "@id": personId },
};

export default function AboutPage() {
  return (
    <>
      <main className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10 py-12 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              About Mehedi Imun
            </h1>
            <p className="text-lg text-muted-foreground normal-case mb-6">
              {description}
            </p>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">What I work on</h2>
              <p className="text-muted-foreground normal-case mb-4">
                I build the parts of an application that have to keep working
                when traffic is uneven and the data is messy: API design,
                database schemas, background jobs and the deployment pipeline
                around them. Most of that work is Node.js and Express over
                PostgreSQL, written in TypeScript, containerised with Docker and
                shipped through CI.
              </p>
              <p className="text-muted-foreground normal-case">
                On the frontend I work in React and Next.js, with a bias toward
                server rendering and shipping as little JavaScript as the
                interface actually needs.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Teaching</h2>
              <p className="text-muted-foreground normal-case">
                For three years I taught web development at Programming Hero,
                running deep-dive sessions on backend and frontend topics and
                supporting the instructor team. Explaining a system to someone
                learning it is the fastest way to find the parts you only
                thought you understood, and it changed how I write code and
                documentation.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Experience</h2>
              {experienceGroups.map((group) => (
                <div key={group.title} className="mb-8">
                  {group.items.map((experience) => (
                    <div
                      key={experience.id}
                      className="mb-8 relative pl-8 before:content-[''] before:absolute before:left-0 before:top-2 before:w-3 before:h-3 before:bg-brand before:rounded-full before:ring-4 before:ring-brand/20"
                    >
                      <Badge className="inline-flex items-center rounded-full border border-brand/40 bg-transparent px-4 py-1 font-mono text-xs uppercase tracking-[0.18em] text-brand mb-3">
                        {experience.duration}
                      </Badge>
                      <h3 className="text-xl font-bold">{experience.title}</h3>
                      <p className="text-brand font-medium mb-2">
                        {experience.company}
                      </p>
                      <p className="text-muted-foreground normal-case">
                        {experience.description}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Get in touch</h2>
              <p className="text-muted-foreground normal-case mb-6">
                I am open to backend and full stack work. The fastest way to
                reach me is email.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/contact">Contact me</Link>
                </Button>
                <Button variant="outline" asChild size="lg">
                  <Link href="/projects">See my projects</Link>
                </Button>
              </div>
            </section>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <div className="relative aspect-square rounded-xl overflow-hidden border bg-muted/30">
                <Image
                  src="/hero-portrait.png"
                  alt="Mehedi Imun, full stack web developer based in Dhaka, Bangladesh"
                  fill
                  sizes="320px"
                  className="object-contain object-bottom"
                />
              </div>
              <dl className="mt-6 space-y-4 text-sm">
                <div>
                  <dt className="font-medium">Location</dt>
                  <dd className="text-muted-foreground">
                    {siteConfig.location.city}, {siteConfig.location.country}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium">Email</dt>
                  <dd>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="text-muted-foreground hover:text-brand normal-case"
                    >
                      {siteConfig.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-medium">Focus</dt>
                  <dd className="text-muted-foreground">
                    Node.js, Express, PostgreSQL, TypeScript, Next.js
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>

        <JsonLd
          schema={[
            aboutPageSchema,
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "About", path: "/about" },
            ]),
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
