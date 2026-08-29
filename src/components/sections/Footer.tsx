import Link from "next/link";
import { Container } from "@/components/ui/section";
import { siteConfig } from "@/lib/site";

const pageLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const socialLinks = [
  { href: siteConfig.socials.facebook, label: "Facebook" },
  { href: siteConfig.socials.x, label: "X" },
  { href: siteConfig.socials.github, label: "GitHub" },
  { href: siteConfig.socials.linkedin, label: "LinkedIn" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-accent/20 to-transparent blur-3xl"
      />
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h2 className="mb-4 text-lg font-semibold">{siteConfig.name}</h2>
            <p className="max-w-[45ch] text-muted-foreground">
              {siteConfig.jobTitle} in {siteConfig.location.city},{" "}
              {siteConfig.location.country}. Interfaces, APIs and the
              pipelines that ship them.
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="mb-4 text-lg font-semibold">Links</h2>
            <ul className="space-y-2">
              {pageLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground transition-colors hover:text-brand"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="mb-4 text-lg font-semibold">Connect</h2>
            <ul className="flex flex-wrap gap-x-4 gap-y-2">
              {socialLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-muted-foreground transition-colors hover:text-brand"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>
            © {currentYear} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
