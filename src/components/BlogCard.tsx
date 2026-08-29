import Image from "next/image";
import { coverGradient } from "@/lib/content";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
      {/*
       * Decorative, so it is hidden from assistive tech and skipped by the
       * keyboard: the title link below is the real target, and a second tab stop
       * to the same page would only slow a keyboard user down.
       */}
      <Link
        href={`/blog/${post.slug}`}
        className="relative block aspect-[16/9] overflow-hidden bg-muted"
        tabIndex={-1}
        aria-hidden="true"
      >
        {post.cover ? (
          <Image
            src={post.cover}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
      <CardHeader>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <span>{post.date}</span>
          <span>•</span>
          <span>{post.readTime}</span>
        </div>
        {/*
         * lang goes on the title block, not the link inside it: the block is
         * what generates the line boxes, so it is what the Bangla leading
         * override in globals.css has to land on. It also lets the browser pick
         * the right face per script and lets a screen reader switch voice.
         */}
        <CardTitle lang={post.lang} className="line-clamp-2">
          <Link href={`/blog/${post.slug}`} className="hover:text-brand">
            {post.title}
          </Link>
        </CardTitle>
        <CardDescription className="flex flex-wrap gap-2 mt-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 bg-muted rounded-md"
            >
              {tag}
            </span>
          ))}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p lang={post.lang} className="text-muted-foreground line-clamp-3">
          {post.excerpt}
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" asChild className="w-full">
          <Link href={`/blog/${post.slug}`}>Read More</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
