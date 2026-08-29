import GithubSlugger from "github-slugger";
import type { MDXRemote } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeUnwrapImages from "rehype-unwrap-images";
import remarkGfm from "remark-gfm";
import type { ComponentProps } from "react";

/**
 * Derived from the component rather than imported: next-mdx-remote does not
 * re-export SerializeOptions publicly, and this stays correct if it changes.
 * The annotation also matters functionally -- without it the plugin tuples
 * widen to arrays and no longer satisfy PluggableList.
 */
type MdxRemoteOptions = NonNullable<ComponentProps<typeof MDXRemote>["options"]>;

/**
 * MDX pipeline shared by every post body.
 *
 * Plugin order matters: rehype-slug must assign heading ids before
 * rehype-autolink-headings can link to them.
 *
 * `keepBackground: false` drops Shiki's own theme background so the code block
 * keeps the surface defined in globals.css and stays consistent with the card
 * it sits on. Highlighting is applied at build time, so this ships no client JS.
 */
export const mdxOptions: MdxRemoteOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      // Markdown wraps images in <p>, which breaks next/image layout and makes
      // a <figure> invalid nesting. Must run before the components map sees it.
      rehypeUnwrapImages,
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "append",
          properties: {
            className: ["heading-anchor"],
            ariaLabel: "Permalink to this section",
          },
          content: {
            type: "element",
            tagName: "span",
            properties: { ariaHidden: "true" },
            children: [{ type: "text", value: "#" }],
          },
        },
      ],
      [
        rehypePrettyCode,
        {
          theme: { light: "github-light", dark: "github-dark-dimmed" },
          keepBackground: false,
          defaultLang: "plaintext",
        },
      ],
    ],
  },
};

export interface TocEntry {
  depth: 2 | 3;
  text: string;
  slug: string;
}

const FENCED_BLOCK = /^```[\s\S]*?^```/gm;
const ATX_HEADING = /^(#{2,3})\s+(.+?)\s*#*\s*$/gm;

/**
 * Heading text reaches rehype-slug already parsed, so `` `motion` `` has become
 * "motion" by the time it is slugged. Strip the same inline markers here or the
 * table of contents would link to anchors that do not exist.
 */
function stripInlineMarkdown(text: string): string {
  return text
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .trim();
}

/**
 * Table of contents built from the raw MDX rather than the rendered tree, so it
 * stays available synchronously. Uses the same slugger as rehype-slug, and the
 * same fresh-instance-per-document behaviour, so duplicate headings receive the
 * identical `-1` suffixes and every link resolves.
 */
export function getTableOfContents(source: string): TocEntry[] {
  const slugger = new GithubSlugger();
  // Fenced blocks can contain lines starting with #; those are not headings.
  const prose = source.replace(FENCED_BLOCK, "");
  const entries: TocEntry[] = [];

  for (const match of prose.matchAll(ATX_HEADING)) {
    const text = stripInlineMarkdown(match[2]);
    if (!text) continue;
    entries.push({
      depth: match[1].length as 2 | 3,
      text,
      slug: slugger.slug(text),
    });
  }

  return entries;
}
