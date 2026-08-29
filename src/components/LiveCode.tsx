"use client";

import { useEffect, useRef, useState } from "react";

/*
 * Code typing itself out behind the hero heading.
 *
 * Decorative and aria-hidden, so it renders empty on the server and fills in
 * after mount. That avoids a hydration mismatch and, more importantly, keeps a
 * wall of pretend source code out of the markup a crawler reads -- the heading
 * underneath is the content; this is texture.
 *
 * The snippet is real Express and Prisma rather than lorem ipsum, because
 * anyone who slows down enough to read it is exactly the audience worth not
 * lying to.
 */
/*
 * Fourteen lines, deliberately. At the measured 28.5px rhythm that lands the
 * block at ~400px tall, matching the reference's 414px box; the previous
 * eighteen lines overshot it to 513px and pushed the tail down past the photo.
 */
export const API_SNIPPET = `// spec in, deploy out
import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const db = new PrismaClient();

app.get("/api/projects", async (_req, res) => {
  const rows = await db.project.findMany({
    where: { published: true },
    orderBy: { year: "desc" },
  });
  res.json({ data: rows });
});`;

/* A second stream so the two blocks never read as the same text twice. */
export const DEPLOY_SNIPPET = `FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

COPY . .
RUN npm run build

FROM node:22-alpine
COPY --from=build /app ./
HEALTHCHECK CMD curl -f localhost:3000/health
CMD ["node", "server.js"]

$ docker build -t api:sha-9f2c1b .
$ docker push registry/api:sha-9f2c1b
> deployed in 41s`;

const TYPE_MS = 18;
const HOLD_MS = 4200;

export default function LiveCode({
  className,
  snippet = API_SNIPPET,
  startDelay = 0,
}: {
  className?: string;
  snippet?: string;
  /** Staggers a second instance so the two do not type in lockstep. */
  startDelay?: number;
}) {
  const [text, setText] = useState("");
  const frame = useRef(0);

  useEffect(() => {
    const SNIPPET = snippet;
    // Deferred to a frame rather than set inline: a synchronous setState in an
    // effect body triggers a cascading render, which the React compiler rules
    // reject.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      frame.current = requestAnimationFrame(() => setText(SNIPPET));
      return () => cancelAnimationFrame(frame.current);
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const run = () => {
      const start = performance.now();

      const step = (now: number) => {
        if (cancelled) return;
        const chars = Math.floor((now - start) / TYPE_MS);

        if (chars >= SNIPPET.length) {
          setText(SNIPPET);
          timer = setTimeout(() => {
            if (cancelled) return;
            setText("");
            run();
          }, HOLD_MS);
          return;
        }

        setText(SNIPPET.slice(0, chars));
        frame.current = requestAnimationFrame(step);
      };

      frame.current = requestAnimationFrame(step);
    };

    timer = setTimeout(run, startDelay);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame.current);
      if (timer) clearTimeout(timer);
    };
  }, [snippet, startDelay]);

  return (
    <pre aria-hidden className={className}>
      {text}
      <span className="animate-caret-blink text-brand">▍</span>
    </pre>
  );
}
