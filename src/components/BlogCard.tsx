import Image from "next/image";
import Link from "next/link";
import { coverGradient, tagToSlug } from "@/lib/content";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface BlogCardProps {
  post: {
    id: string;
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    slug: string;
    tags: string[];
    lang?: string;
    cover?: string;
    coverAlt?: string;
  };
}

/** Beyond this many, the rest collapse into a "+N" pill so a long tag list cannot grow the card. */
const VISIBLE_TAGS = 2;

export default function BlogCard({ post }: BlogCardProps) {
  const visibleTags = post.tags.slice(0, VISIBLE_TAGS);
  const hiddenTagCount = post.tags.length - visibleTags.length;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col gap-3 py-4">
      {/*
       * Decorative, so it is hidden from assistive tech and skipped by the
       * keyboard: the title link below is the real target, and a second tab stop
       * to the same page would only slow a keyboard user down.
       */}
      <Link
        href={`/blog/${post.slug}`}
        className="relative block aspect-[16/10] overflow-hidden bg-muted"
        tabIndex={-1}
        aria-hidden="true"
      >
        {post.cover ? (
          <Image
            src={post.cover}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          /*
           * No cover yet. Deliberately wordless: the post's generated OG card
           * would fit here, but it carries the title and date that the card
           * already prints directly underneath, so every tile would say the same
           * thing twice. A plain tint gives the row rhythm without repeating it.
           */
          <div
            className="h-full w-full"
            style={{ backgroundImage: coverGradient(post.slug) }}
          />
        )}
      </Link>
      <CardHeader className="px-4 gap-1">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>{post.date}</span>
          <span aria-hidden="true">&bull;</span>
          <span>{post.readTime}</span>
        </div>
        {/*
         * lang goes on the title block, not the link inside it: the block is
         * what generates the line boxes, so it is what the Bangla leading
         * override in globals.css has to land on. It also lets the browser pick
         * the right face per script and lets a screen reader switch voice.
         */}
        <CardTitle lang={post.lang} className="line-clamp-2 text-base">
          <Link href={`/blog/${post.slug}`} className="hover:text-brand">
            {post.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 flex-grow flex flex-col gap-2">
        <p lang={post.lang} className="text-sm text-muted-foreground line-clamp-2">
          {post.excerpt}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
          {visibleTags.map((tag) => (
            <Link
              key={tag}
              href={`/blog/tag/${tagToSlug(tag)}`}
              className="rounded px-1.5 py-0.5 text-xs bg-muted hover:bg-accent hover:text-accent-foreground"
            >
              {tag}
            </Link>
          ))}
          {hiddenTagCount > 0 ? (
            <span className="px-1 text-xs text-muted-foreground">+{hiddenTagCount}</span>
          ) : null}
          <Link
            href={`/blog/${post.slug}`}
            className="ml-auto text-xs font-medium underline-offset-4 hover:underline"
          >
            Read more &rarr;
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
