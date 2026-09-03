"use client";

import { Check, Copy } from "lucide-react";
import { useRef, useState } from "react";
import type { ComponentPropsWithoutRef } from "react";

/**
 * Overrides `pre` in the MDX component map so every rehype-pretty-code block
 * gets a copy button. The Shiki-highlighted <code> children pass through
 * unchanged -- this only wraps them.
 *
 * rehype-pretty-code renders each line as its own `[data-line]` span inside a
 * `display: grid` <code> (see globals.css) rather than separating lines with
 * real newline characters, so reading `pre.textContent` directly would paste
 * the whole block as one run-on line. Joining the per-line text with "\n"
 * reconstructs the original source.
 */
export function CodeBlock(props: ComponentPropsWithoutRef<"pre">) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const pre = preRef.current;
    if (!pre) return;

    const lines = pre.querySelectorAll("[data-line]");
    const text =
      lines.length > 0
        ? Array.from(lines)
            .map((line) => line.textContent ?? "")
            .join("\n")
        : (pre.textContent ?? "");

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard permission denied -- nothing further to do.
    }
  };

  return (
    <div className="group relative">
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Copied" : "Copy code"}
        className="absolute right-2 top-2 rounded-md border bg-background/80 p-1.5 text-muted-foreground opacity-0 backdrop-blur transition-opacity hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100"
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
      <pre ref={preRef} {...props} />
    </div>
  );
}

export default CodeBlock;
