"use client";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Eye, Menu, X } from "lucide-react";
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
    <header className=" fixed top-0 left-0 w-full z-50 bg-white/30 dark:bg-black/30 backdrop-blur-xl border-b border-white/10 shadow-md">
      <div className="max-w-7xl mx-auto px-4 lg:px-0  py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold bg-gradient-to-r from-[#ff914d] to-orange-400 bg-clip-text text-transparent"
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
                "text-sm font-medium transition hover:text-[#ff914d] relative after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-0 after:bg-[#ff914d] after:transition-all hover:after:w-full",
                isActive(item.href)
                  ? "text-[#ff914d] after:w-full"
                  : "text-black/80 dark:text-white/80"
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
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden px-4 py-4 bg-white/70 dark:bg-black/50 backdrop-blur-lg">
          <nav className="space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => handleClick(e, item.href, item.isSection)}
                className={cn(
                  "block py-2 text-base font-medium transition hover:text-[#ff914d]",
                  isActive(item.href)
                    ? "text-[#ff914d]"
                    : "text-black/80 dark:text-white/80"
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
              className="flex items-center gap-2 py-2 text-base font-medium text-black/80 dark:text-white/80 transition hover:text-[#ff914d]"
            >
              Resume <Eye className="h-4 w-4" />
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
