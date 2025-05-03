"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Download, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

const navigation = [
  { name: "Home", href: "/", isSection: false },
  { name: "Projects", href: "/#projects", isSection: true },
  { name: "Experience", href: "/#experience", isSection: true },
  { name: "Tools", href: "/#tools", isSection: true },
  { name: "Contact", href: "/#contact", isSection: true },
  { name: "Blog", href: "/blog", isSection: false },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const hash = typeof window !== "undefined" ? window.location.hash : "";

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
          Portfolio
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
          <Button variant={"outline"}>
            Resume <Download></Download>
          </Button>
          <ThemeToggle />
        </nav>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
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
                  "block text-base font-medium transition hover:text-[#ff914d]",
                  isActive(item.href)
                    ? "text-[#ff914d]"
                    : "text-black/80 dark:text-white/80"
                )}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
