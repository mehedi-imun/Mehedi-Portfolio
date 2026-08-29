import type { BlogPostSummary } from "./blog";
import type { Experience } from "./experience";
import type { Project } from "./projects";
import type { siteConfig } from "./site";

/*
 * The command layer for the home page terminal.
 *
 * Type-only imports above are load-bearing. `blog.ts` and `projects.ts` call
 * readFileSync at module scope, so a value import from either would pull
 * node:fs into the client bundle and fail the build. Everything this file
 * needs arrives through TerminalContext instead, which the server page fills
 * in and passes down as a prop -- the same rule ProjectsGrid follows for its
 * category list.
 */

/** The subset of a project the terminal renders. Keeps the prop payload small. */
export type TerminalProject = Pick<
  Project,
  "slug" | "title" | "excerpt" | "category" | "year" | "role" | "stack"
> &
  Partial<Pick<Project, "liveUrl" | "repoUrl" | "timeline">>;

export type TerminalPost = Pick<
  BlogPostSummary,
  "slug" | "title" | "date" | "readTime" | "tags"
>;

export type TerminalExperience = Pick<
  Experience,
  "title" | "company" | "duration"
>;

export interface TerminalContext {
  projects: TerminalProject[];
  posts: TerminalPost[];
  experience: TerminalExperience[];
  site: typeof siteConfig;
}

export type TerminalLine =
  | { kind: "text"; value: string; tone?: "muted" | "brand" | "error" }
  | { kind: "rows"; rows: { label: string; value: string }[] }
  | { kind: "list"; items: string[] }
  | { kind: "link"; label: string; href: string; external: boolean };

/**
 * Commands never touch the DOM. Anything with a side effect returns an intent
 * and lets the component carry it out, which keeps this module testable and
 * safe to import from anywhere.
 */
export type TerminalEffect =
  | { type: "clear" }
  | { type: "navigate"; href: string }
  | { type: "openExternal"; href: string }
  | { type: "setTheme"; theme: "dark" | "light" };

export interface TerminalResult {
  lines: TerminalLine[];
  effect?: TerminalEffect;
}

/** One completion candidate: the token to insert, plus what choosing it does. */
export interface Suggestion {
  value: string;
  hint: string;
}

export interface TerminalCommand {
  name: string;
  summary: string;
  usage?: string;
  /** Candidate completions for this command's argument. */
  complete?: (ctx: TerminalContext) => Suggestion[];
  run: (args: string[], ctx: TerminalContext) => TerminalResult;
}

const text = (
  value: string,
  tone?: "muted" | "brand" | "error"
): TerminalLine => ({ kind: "text", value, tone });

const error = (value: string): TerminalResult => ({
  lines: [text(value, "error")],
});

const projectSuggestions = (ctx: TerminalContext): Suggestion[] =>
  ctx.projects.map((project) => ({
    value: project.slug,
    hint: `${project.year} · ${project.category}`,
  }));

export const commands: TerminalCommand[] = [
  {
    name: "help",
    summary: "List every command",
    run: () => ({
      lines: [
        text("Available commands", "brand"),
        {
          kind: "rows",
          rows: commands.map((command) => ({
            label: command.usage ?? command.name,
            value: command.summary,
          })),
        },
        text("Tab completes, arrow keys walk history.", "muted"),
      ],
    }),
  },
  {
    name: "whoami",
    summary: "Who is behind this site",
    run: (_args, ctx) => ({
      lines: [
        {
          kind: "rows",
          rows: [
            { label: "name", value: ctx.site.name },
            { label: "role", value: ctx.site.jobTitle },
            {
              label: "location",
              value: `${ctx.site.location.city}, ${ctx.site.location.country}`,
            },
            { label: "email", value: ctx.site.email },
          ],
        },
      ],
    }),
  },
  {
    name: "ls",
    summary: "List projects or posts",
    usage: "ls [projects|posts]",
    complete: () => [
      { value: "projects", hint: "Every case study" },
      { value: "posts", hint: "Recent writing" },
    ],
    run: (args, ctx) => {
      const target = args[0] ?? "projects";
      if (target === "projects") {
        return {
          lines: [
            {
              kind: "rows",
              rows: ctx.projects.map((project) => ({
                label: `${project.slug}/`,
                value: `${project.year}  ${project.category}`,
              })),
            },
            text(
              `${ctx.projects.length} project(s). cat <slug> for detail.`,
              "muted"
            ),
          ],
        };
      }
      if (target === "posts") {
        return {
          lines: [
            {
              kind: "rows",
              rows: ctx.posts.map((post) => ({
                label: post.slug,
                value: `${post.date}  ${post.readTime}`,
              })),
            },
          ],
        };
      }
      return error(`ls: no such directory: ${target}`);
    },
  },
  {
    name: "cat",
    summary: "Read one project",
    usage: "cat <project-slug>",
    complete: projectSuggestions,
    run: (args, ctx) => {
      const slug = args[0];
      if (!slug) return error("cat: missing operand. Try: cat <project-slug>");

      const project = ctx.projects.find((p) => p.slug === slug);
      if (!project) {
        return error(
          `cat: ${slug}: No such project. Run 'ls projects' to see them all.`
        );
      }

      const rows = [
        { label: "title", value: project.title },
        { label: "role", value: project.role },
        { label: "year", value: project.year },
        { label: "stack", value: project.stack.join(", ") },
      ];
      if (project.timeline) {
        rows.push({ label: "timeline", value: project.timeline });
      }

      const lines: TerminalLine[] = [
        { kind: "rows", rows },
        text(project.excerpt, "muted"),
        {
          kind: "link",
          label: "Read the case study",
          href: `/projects/${project.slug}`,
          external: false,
        },
      ];
      if (project.liveUrl) {
        lines.push({
          kind: "link",
          label: "Live site",
          href: project.liveUrl,
          external: true,
        });
      }
      if (project.repoUrl) {
        lines.push({
          kind: "link",
          label: "Source",
          href: project.repoUrl,
          external: true,
        });
      }
      return { lines };
    },
  },
  {
    name: "stack",
    summary: "Technologies across every project",
    run: (_args, ctx) => {
      const counts = new Map<string, number>();
      for (const project of ctx.projects) {
        for (const item of project.stack) {
          counts.set(item, (counts.get(item) ?? 0) + 1);
        }
      }
      if (counts.size === 0) return error("stack: nothing indexed yet.");
      const ranked = [...counts.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .map(([name, count]) => `${name} (${count})`);
      return { lines: [{ kind: "list", items: ranked }] };
    },
  },
  {
    name: "experience",
    summary: "Roles, most recent first",
    run: (_args, ctx) => ({
      lines: [
        {
          kind: "rows",
          rows: ctx.experience.map((role) => ({
            label: role.duration,
            value: `${role.title} @ ${role.company}`,
          })),
        },
      ],
    }),
  },
  {
    name: "blog",
    summary: "Latest writing",
    run: (_args, ctx) => {
      if (ctx.posts.length === 0) return error("blog: no published posts yet.");
      return {
        lines: [
          {
            kind: "rows",
            rows: ctx.posts.map((post) => ({
              label: post.date,
              value: post.title,
            })),
          },
          {
            kind: "link",
            label: "Open the blog",
            href: "/blog",
            external: false,
          },
        ],
      };
    },
  },
  {
    name: "contact",
    summary: "How to reach me",
    run: (_args, ctx) => ({
      lines: [
        {
          kind: "link",
          label: ctx.site.email,
          href: `mailto:${ctx.site.email}`,
          external: true,
        },
        {
          kind: "link",
          label: "GitHub",
          href: ctx.site.socials.github,
          external: true,
        },
        {
          kind: "link",
          label: "LinkedIn",
          href: ctx.site.socials.linkedin,
          external: true,
        },
      ],
    }),
  },
  {
    name: "resume",
    summary: "Open the CV in a new tab",
    run: (_args, ctx) => ({
      lines: [text("Opening resume...", "muted")],
      effect: { type: "openExternal", href: ctx.site.resumeUrl },
    }),
  },
  {
    name: "open",
    summary: "Navigate to a project page",
    usage: "open <project-slug>",
    complete: projectSuggestions,
    run: (args, ctx) => {
      const slug = args[0];
      if (!slug) return error("open: missing operand. Try: open <project-slug>");
      if (!ctx.projects.some((p) => p.slug === slug)) {
        return error(`open: ${slug}: No such project.`);
      }
      return {
        lines: [text(`Opening /projects/${slug}`, "muted")],
        effect: { type: "navigate", href: `/projects/${slug}` },
      };
    },
  },
  {
    name: "theme",
    summary: "Switch colour scheme",
    usage: "theme <dark|light>",
    complete: () => [
      { value: "dark", hint: "Dim surfaces" },
      { value: "light", hint: "Bright surfaces" },
    ],
    run: (args) => {
      const next = args[0];
      if (next !== "dark" && next !== "light") {
        return error("theme: expected 'dark' or 'light'.");
      }
      return {
        lines: [text(`Theme set to ${next}.`, "muted")],
        effect: { type: "setTheme", theme: next },
      };
    },
  },
  {
    name: "clear",
    summary: "Clear the screen",
    run: () => ({ lines: [], effect: { type: "clear" } }),
  },
  {
    name: "sudo",
    summary: "Try it",
    run: () =>
      error(
        "sudo: mehedi is not in the sudoers file. This incident will be reported."
      ),
  },
];

const commandByName = new Map(commands.map((command) => [command.name, command]));

/** Rendered into static HTML so the terminal is not an empty box without JS. */
export const commandSummaries = commands.map((command) => ({
  name: command.usage ?? command.name,
  summary: command.summary,
}));

function editDistance(a: string, b: string): number {
  const rows = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) =>
      i === 0 ? j : j === 0 ? i : 0
    )
  );
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      rows[i][j] = Math.min(
        rows[i - 1][j] + 1,
        rows[i][j - 1] + 1,
        rows[i - 1][j - 1] + cost
      );
    }
  }
  return rows[a.length][b.length];
}

function closestCommand(input: string): string | undefined {
  let best: { name: string; distance: number } | undefined;
  for (const command of commands) {
    const distance = editDistance(input, command.name);
    if (!best || distance < best.distance) {
      best = { name: command.name, distance };
    }
  }
  // Beyond two edits the suggestion is noise rather than help.
  return best && best.distance <= 2 ? best.name : undefined;
}

export function runCommand(input: string, ctx: TerminalContext): TerminalResult {
  const trimmed = input.trim();

  // The joke has to be matched before tokenising, or "rm" gets a did-you-mean.
  if (trimmed.startsWith("rm -rf")) {
    return error(
      "rm: permission denied. Nice try -- this portfolio is immutable."
    );
  }

  const tokens = trimmed.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return { lines: [] };

  const [name, ...args] = tokens;
  const command = commandByName.get(name.toLowerCase());
  if (command) return command.run(args, ctx);

  const suggestion = closestCommand(name.toLowerCase());
  return error(
    suggestion
      ? `command not found: ${name}. Did you mean '${suggestion}'?`
      : `command not found: ${name}. Type 'help' for the list.`
  );
}

/** The token the caret sits on. Empty when the input ends in whitespace. */
export function activeToken(input: string): string {
  if (/\s$/.test(input)) return "";
  const tokens = input.trimStart().split(/\s+/).filter(Boolean);
  return tokens.length === 0 ? "" : tokens[tokens.length - 1];
}

/** Swaps the token under the caret for a completion, ready for the next one. */
export function applyCompletion(input: string, value: string): string {
  const tokens = input.trimStart().split(/\s+/).filter(Boolean);
  const head = /\s$/.test(input) ? tokens : tokens.slice(0, -1);
  return `${[...head, value].join(" ")} `;
}

/**
 * Backs both the inline ghost completion and the suggestion list: command
 * names while the first token is still being typed, that command's own
 * candidates once it is complete.
 */
export function suggestInput(input: string, ctx: TerminalContext): Suggestion[] {
  const commandNames = commands.map((command) => ({
    value: command.name,
    hint: command.summary,
  }));

  const tokens = input.trimStart().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return commandNames;

  const prefix = activeToken(input).toLowerCase();
  const startsWithPrefix = (suggestion: Suggestion) =>
    suggestion.value.toLowerCase().startsWith(prefix);

  if (tokens.length === 1 && !/\s$/.test(input)) {
    return commandNames.filter(startsWithPrefix);
  }

  const command = commandByName.get(tokens[0].toLowerCase());
  if (!command?.complete) return [];
  return command.complete(ctx).filter(startsWithPrefix);
}
