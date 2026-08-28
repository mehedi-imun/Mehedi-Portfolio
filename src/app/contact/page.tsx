import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/sections/Footer";
import { breadcrumbSchema, personId } from "@/lib/seo";
import { absoluteUrl, siteConfig } from "@/lib/site";

const title = "Contact";
const description =
  "Get in touch with Mehedi Imun, full stack web developer in Dhaka, Bangladesh. Available for backend and full stack work in Node.js, TypeScript and Next.js.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    url: "/contact",
    title,
    description,
  },
};

const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  url: absoluteUrl("/contact"),
  name: `Contact ${siteConfig.name}`,
  description,
  inLanguage: "en",
  mainEntity: { "@id": personId },
};

export default function ContactPage() {
  return (
    <>
      <main className="mt-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-0 pt-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Contact Mehedi Imun
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl normal-case">
            {description}
          </p>
        </div>

        <ContactSection />

        <JsonLd
          schema={[
            contactPageSchema,
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Contact", path: "/contact" },
            ]),
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
