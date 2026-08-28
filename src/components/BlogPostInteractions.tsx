"use client";

import { Heart, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * Like counter and share row. Client-only so the surrounding article can be
 * statically rendered on the server.
 */
export default function BlogPostInteractions({ slug }: { slug: string }) {
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    const savedLikes = localStorage.getItem("blogLikes");
    const savedHasLiked = localStorage.getItem("blogHasLiked");

    if (savedLikes) {
      const parsed = JSON.parse(savedLikes) as Record<string, number>;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating persisted client-only state after mount
      setLikes(parsed[slug] ?? 0);
    }
    if (savedHasLiked) {
      const parsed = JSON.parse(savedHasLiked) as Record<string, boolean>;
      setHasLiked(Boolean(parsed[slug]));
    }
  }, [slug]);

  const handleLike = () => {
    if (hasLiked) return;

    const nextCount = likes + 1;
    setLikes(nextCount);
    setHasLiked(true);

    const savedLikes = JSON.parse(
      localStorage.getItem("blogLikes") ?? "{}"
    ) as Record<string, number>;
    const savedHasLiked = JSON.parse(
      localStorage.getItem("blogHasLiked") ?? "{}"
    ) as Record<string, boolean>;

    localStorage.setItem(
      "blogLikes",
      JSON.stringify({ ...savedLikes, [slug]: nextCount })
    );
    localStorage.setItem(
      "blogHasLiked",
      JSON.stringify({ ...savedHasLiked, [slug]: true })
    );
  };

  return (
    <div className="mt-12 pt-6 border-t flex flex-wrap gap-y-3 justify-between items-center">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className={`flex items-center gap-2 min-h-11 px-3 transition-all ${
            hasLiked ? "text-red-500 border-red-200 dark:border-red-800" : ""
          }`}
          onClick={handleLike}
          disabled={hasLiked}
          aria-label={hasLiked ? "Already liked" : "Like this post"}
        >
          <Heart size={16} className={hasLiked ? "fill-red-500" : ""} />
          {likes} Likes
        </Button>

        <Button variant="outline" size="sm" asChild className="min-h-11 px-3">
          <a href="#comments" className="flex items-center gap-2">
            <MessageSquare size={16} />
            Comments
          </a>
        </Button>
      </div>
    </div>
  );
}
