"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  const handleScroll = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="max-w-7xl mx-auto ">
      <section className="min-h-[90vh] flex items-center ">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="animate-slide-down space-y-6">
              <div>
                <p className="inline-flex items-center rounded-full px-4 py-1 text-sm font-medium bg-muted/30 text-[#ff914d] mb-4">
                  <span className="animate-pulse mr-1">●</span> Available for
                  hire
                </p>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
                <span className="block">Hello, I'm</span>
                <span className="bg-gradient-to-r from-[#ff914d] to-orange-400 bg-clip-text text-transparent">
                  Your Name
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
                A Next.js developer who creates modern, responsive, and
                user-friendly web applications that bring ideas to life.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button
                  asChild
                  size="lg"
                  className="shadow-lg shadow-[#ff914d]/20 hover:shadow-[#ff914d]/40 transition-all"
                >
                  <Link href="#projects" onClick={handleScroll("projects")}>
                    View My Work
                  </Link>
                </Button>
                <Button variant="outline" asChild size="lg" className="group">
                  <Link href="#contact" onClick={handleScroll("contact")}>
                    Get In Touch
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ml-1 transition-transform group-hover:translate-x-1"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Graphic Section */}
            <div className="hidden lg:block relative animate-slide-up">
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff914d]/20 to-transparent rounded-lg blur-3xl opacity-50 -z-10"></div>
              <div className="bg-gradient-to-br from-muted/30 to-transparent border border-white/10 backdrop-blur-sm aspect-square rounded-lg flex items-center justify-center text-6xl">
                <div className="relative">
                  <div className="">
                    <Image
                      src="https://i.ibb.co.com/93wSjCPM/IMG-2129-removebg-preview.png"
                      width={900}
                      height={900}
                      alt="Picture of the author"
                    />
                  </div>
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-transparent via-[#ff914d]/40 to-transparent rounded-full blur-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
