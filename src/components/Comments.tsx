"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

/**
 * Comments backed by GitHub Discussions via giscus.
 *
 * Replaces a localStorage "comment" form whose submissions were visible to
 * nobody but the person who typed them. Real comments need somewhere to live;
 * giscus uses the repo's Discussions, so there is no database to run and no
 * moderation panel to build.
 *
 * Configuration comes from env, and the widget renders nothing unless every
 * value is present -- a half-configured giscus mounts a broken iframe, which is
 * worse than no comments. See AGENTS.md for the setup steps.
 */
const config = {
  repo: process.env.NEXT_PUBLIC_GISCUS_REPO,
  repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID,
  category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY,
  categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
};

const GISCUS_ORIGIN = "https://giscus.app";

const isConfigured = Boolean(
  config.repo && config.repoId && config.category && config.categoryId
);

export function Comments({ term }: { term: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const giscusTheme = resolvedTheme === "dark" ? "dark_dimmed" : "light";

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isConfigured) return;

    const script = document.createElement("script");
    script.src = `${GISCUS_ORIGIN}/client.js`;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-repo", config.repo!);
    script.setAttribute("data-repo-id", config.repoId!);
    script.setAttribute("data-category", config.category!);
    script.setAttribute("data-category-id", config.categoryId!);
    // Mapped by slug rather than URL, so a thread survives a domain or
    // canonical change.
    script.setAttribute("data-mapping", "specific");
    script.setAttribute("data-term", term);
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", giscusTheme);
    script.setAttribute("data-lang", "en");
    script.setAttribute("data-loading", "lazy");

    container.appendChild(script);
    return () => {
      container.innerHTML = "";
    };
  }, [term, giscusTheme]);

  useEffect(() => {
    // Once the iframe exists a theme switch is a postMessage, not a remount --
    // remounting would discard a half-typed comment.
    document
      .querySelector<HTMLIFrameElement>("iframe.giscus-frame")
      ?.contentWindow?.postMessage(
        { giscus: { setConfig: { theme: giscusTheme } } },
        GISCUS_ORIGIN
      );
  }, [giscusTheme]);

  if (!isConfigured) return null;

  return <div ref={containerRef} />;
}
