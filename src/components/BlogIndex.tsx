"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { BlogPostSummary } from "@/lib/blog";
import BlogCard from "./BlogCard";

interface BlogIndexProps {
  posts: BlogPostSummary[];
  tags: string[];
}

/**
 * Bengali conjuncts can be encoded in more than one Unicode normalization form,
 * so two visually identical words compare unequal unless both sides are folded
 * to the same form first. Applied to the query and the content equally.
 */
function normalizeForSearch(value: string): string {
  return value.toLowerCase().normalize("NFC");
}

/**
 * Search and tag filtering only. Kept separate from the route so that
 * app/blog/page.tsx can stay a server component and export metadata.
 */
export default function BlogIndex({ posts, tags }: BlogIndexProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredPosts = useMemo(() => {
    const query = normalizeForSearch(searchQuery);
    return posts.filter((post) => {
      const matchesSearch =
        normalizeForSearch(post.title).includes(query) ||
        normalizeForSearch(post.excerpt).includes(query);

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => post.tags.includes(tag));

      return matchesSearch && matchesTags;
    });
  }, [posts, searchQuery, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <>
      <div className="mb-8">
        <Input
          type="search"
          placeholder="Search articles..."
          aria-label="Search articles"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4"
        />

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Button
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              size="sm"
              aria-pressed={selectedTags.includes(tag)}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          {/*
            * Nothing published at all is a different situation from a filter
            * that matched nothing -- telling a first visitor their "criteria"
            * failed, when they never typed any, just reads as broken.
            */}
          <p className="text-xl text-muted-foreground normal-case">
            {posts.length === 0
              ? "No articles yet. The first one is on its way."
              : "No articles match your search."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </>
  );
}
