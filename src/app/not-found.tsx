import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
  // A 404 must never be indexed, and must not pass link equity onward.
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-0 py-32 mt-20">
      <div className="max-w-xl mx-auto text-center">
        <p className="text-sm font-medium text-[#ff914d] mb-4">Error 404</p>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Page not found</h1>
        <p className="text-lg text-muted-foreground mb-8">
          The page you are looking for has been moved or never existed.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button asChild size="lg">
            <Link href="/">Back to home</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/projects">Browse projects</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/blog">Read the blog</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
