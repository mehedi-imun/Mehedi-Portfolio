"use client";

import { useEffect, useState } from "react";

const GOATCOUNTER_CODE = process.env.NEXT_PUBLIC_GOATCOUNTER_CODE;

/**
 * View count via GoatCounter's public per-path count endpoint -- free,
 * privacy-friendly, and no backend of ours, the same trust class as giscus
 * already used for Comments.tsx. Renders nothing unless
 * NEXT_PUBLIC_GOATCOUNTER_CODE is set, same convention as Comments.tsx: a
 * half-configured widget is worse than none. See AGENTS.md for setup.
 */
export function PostViews({ path }: { path: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!GOATCOUNTER_CODE) return;

    const controller = new AbortController();
    fetch(
      `https://${GOATCOUNTER_CODE}.goatcounter.com/counter/${encodeURIComponent(path)}.json`,
      { signal: controller.signal }
    )
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { count?: string } | null) => {
        if (!data?.count) return;
        setCount(Number(data.count.replace(/[^\d]/g, "")));
      })
      .catch(() => {
        // Network hiccup or an ad-blocker -- the count is decorative, so fail
        // silently rather than show an error state for it.
      });

    return () => controller.abort();
  }, [path]);

  if (!GOATCOUNTER_CODE || count === null || Number.isNaN(count)) return null;

  // The leading separator lives here, not in the caller: the caller cannot
  // know in advance whether this renders anything (it depends on a fetch
  // that may still be in flight, or on the env var), so a bullet placed
  // before this component would otherwise dangle with nothing after it.
  return (
    <>
      <span aria-hidden="true">&bull;</span>
      <span>{count.toLocaleString()} views</span>
    </>
  );
}

export default PostViews;
