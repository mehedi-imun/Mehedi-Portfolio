"use client";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/section";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Eye, Menu, X } from "lucide-react";
import { motion, useScroll, useSpring } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

const RESUME_URL = siteConfig.resumeUrl;

const navigation = [
  { name: "Home", href: "/", isSection: false },
  { name: "About", href: "/about", isSection: false },
  { name: "Projects", href: "/#projects", isSection: true },
  { name: "Experience", href: "/#experience", isSection: true },
  { name: "Tools", href: "/#tools", isSection: true },
  { name: "Contact", href: "/#contact", isSection: true },
  { name: "Blog", href: "/blog", isSection: false },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  // Read on the client only, after mount: the server has no location, so
  // deriving it during render would desync the active-link classes/aria-current
  // on hydration.
  const [hash, setHash] = useState("");

  // Reading progress, doubling as the header's bottom border.
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.2,
  });

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash);
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  // Handle smooth scroll to section
  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    isSection: boolean
  ) => {
    if (isSection && href.startsWith("/#")) {
      const id = href.split("#")[1];
      const section = document.getElementById(id);
      if (section) {
        e.preventDefault();
        section.scrollIntoView({ behavior: "smooth" });
        setIsOpen(false);
      }
    } else {
      setIsOpen(false);
    }
  };

  // Determine active link
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return hash === href.slice(1);
    return pathname === href;
  };

  return (
    <header className="fixed left-0 top-8 z-50 w-full border-b border-border bg-background/70 backdrop-blur-xl">
      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-brand"
      />
      <Container className="flex items-center justify-between py-3">
        {/* Logo */}
        <Link
          href="/"
          className="bg-gradient-to-r from-brand to-brand-accent bg-clip-text text-2xl font-bold text-transparent"
        >
          MEHEDI
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={(e) => handleClick(e, item.href, item.isSection)}
              className={cn(
                "relative text-sm font-medium transition after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-0 after:bg-brand after:transition-all hover:text-brand hover:after:w-full",
                isActive(item.href)
                  ? "text-brand after:w-full"
                  : "text-foreground/80"
              )}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.name}
            </Link>
          ))}
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant={"outline"}>
              Resume <Eye />
            </Button>
          </a>
          <ThemeToggle />
        </nav>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center">
          <a href={RESUME_URL} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" aria-label="View Resume">
              <Eye />
            </Button>
          </a>
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
            className="ml-2"
          >
            {isOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </Container>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="border-t border-border bg-background/95 px-6 py-4 backdrop-blur-lg md:hidden">
          <nav className="space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => handleClick(e, item.href, item.isSection)}
                className={cn(
                  "block py-2 text-base font-medium transition hover:text-brand",
                  isActive(item.href) ? "text-brand" : "text-foreground/80"
                )}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                {item.name}
              </Link>
            ))}
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 py-2 text-base font-medium text-foreground/80 transition hover:text-brand"
            >
              Resume <Eye className="h-4 w-4" />
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
