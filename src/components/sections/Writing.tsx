import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";

export interface WritingPost {
  slug: string;
  title: string;
  lang?: string;
  date: string;
  readTime: string;
  tags: string[];
}

/*
 * Posts arrive as a prop rather than being imported here. lib/blog.ts reads the
 * filesystem at module scope, so keeping this component free of that import is
 * what lets it be moved or made interactive later without dragging node:fs into
 * the client bundle.
 */
export default function Writing({ posts }: { posts: WritingPost[] }) {
  if (posts.length === 0) return null;

  return (
    <Section id="writing" aria-labelledby="writing-heading">
      <Reveal>
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            id="writing-heading"
            index="06"
            eyebrow="Writing"
            title="Notes from the build"
            lead="What I learned the hard way, written down while it was still fresh."
          />
          <Link
            href="/blog"
            className="group inline-flex shrink-0 items-center gap-2 font-mono text-xs uppercase tracking-[0.22em]"
          >
            All posts
            <span className="inline-block h-px w-6 bg-brand transition-all duration-300 group-hover:w-10" />
          </Link>
        </div>
      </Reveal>

      <ul className="border-t border-border">
        {posts.map((post, i) => (
          // Reveal renders a div, so it has to sit *inside* the li -- wrapping
          // the li in it puts a div directly under the ul, which is invalid.
          <li key={post.slug} className="border-b border-border">
            <Reveal delay={i * 0.06}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex flex-col gap-3 py-6 transition-colors hover:bg-muted/30 md:flex-row md:items-baseline md:gap-8 md:px-4"
              >
                <span className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground md:w-40 md:shrink-0">
                  {post.date}
                </span>
                <span
                  lang={post.lang}
                  data-post-title
                  className="flex-1 text-lg font-medium tracking-tight transition-colors group-hover:text-brand md:text-xl"
                >
                  {post.title}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {post.readTime}
                </span>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
