"use client";

import { Terminal as TerminalIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import {
  activeToken,
  applyCompletion,
  runCommand,
  suggestInput,
  type TerminalContext,
  type TerminalLine,
  type TerminalResult,
} from "@/lib/terminal-commands";
import { cn } from "@/lib/utils";

/*
 * Output streams in rather than appearing whole. A step is one character of a
 * text line, or one row/item/link of a structured one, so a table staggers by
 * row while prose types by character. The tick budget is fixed rather than the
 * rate, which keeps a one-line error and a full case study both landing in
 * roughly half a second.
 */
const TYPING_TICKS = 20;
const TYPING_INTERVAL_MS = 24;

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/*
 * The idle demo. It types and runs these on a loop so the panel is doing
 * something when the page loads, rather than sitting as a dead prompt nobody
 * realises is live. Read-only commands only -- anything with a navigate,
 * openExternal or setTheme effect would hijack the page on its own.
 */
const DEMO_SCRIPT = ["whoami", "stack", "ls projects", "experience"] as const;
const DEMO_KEYSTROKE_MS = 70;
const DEMO_BEFORE_ENTER_MS = 380;
const DEMO_AFTER_OUTPUT_MS = 1600;
const DEMO_FIRST_RUN_MS = 1100;

type Entry = {
  id: number;
  /** Absent for output the terminal printed on its own. */
  command?: string;
  result: TerminalResult;
};

type Typing = { id: number; steps: number; total: number };

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function subscribeToVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

/*
 * useSyncExternalStore, not useState + a visibilitychange listener.
 * `visibilitychange` fires only on a transition, never on subscribe, so a
 * listener-only version starts from a guessed default and stays there -- a page
 * opened directly into a background tab would report "visible" forever and run
 * the demo where nobody can see it. A snapshot getter reads the real value on
 * mount and on every change.
 */
function useTabVisible() {
  return useSyncExternalStore(
    subscribeToVisibility,
    () => document.visibilityState === "visible",
    () => true
  );
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false
  );
}

function lineSteps(line: TerminalLine): number {
  switch (line.kind) {
    case "text":
      return Math.max(line.value.length, 1);
    case "rows":
      return Math.max(line.rows.length, 1);
    case "list":
      return Math.max(line.items.length, 1);
    case "link":
      return 1;
  }
}

function sliceLine(line: TerminalLine, steps: number): TerminalLine {
  switch (line.kind) {
    case "text":
      return { ...line, value: line.value.slice(0, steps) };
    case "rows":
      return { ...line, rows: line.rows.slice(0, steps) };
    case "list":
      return { ...line, items: line.items.slice(0, steps) };
    case "link":
      return line;
  }
}

/*
 * Screen readers get the finished result as a single announcement instead of
 * the partial DOM the typing effect produces. The visual log is therefore not
 * a live region -- it stays fully navigable, it just no longer narrates itself
 * one character at a time.
 */
function announce(result: TerminalResult): string {
  return result.lines
    .map((line) => {
      switch (line.kind) {
        case "text":
          return line.value;
        case "rows":
          return line.rows.map((row) => `${row.label}: ${row.value}`).join(". ");
        case "list":
          return line.items.join(", ");
        case "link":
          return line.label;
      }
    })
    .join(". ");
}

function Line({ line }: { line: TerminalLine }) {
  switch (line.kind) {
    case "text":
      return (
        <p
          className={cn(
            "whitespace-pre-wrap break-words",
            line.tone === "muted" && "text-muted-foreground",
            line.tone === "brand" && "text-brand",
            line.tone === "error" && "text-destructive"
          )}
        >
          {line.value}
        </p>
      );

    case "rows":
      return (
        <dl className="grid grid-cols-[minmax(0,auto)_1fr] gap-x-6 gap-y-1">
          {line.rows.map((row) => (
            <div key={row.label} className="contents">
              <dt className="text-brand">{row.label}</dt>
              <dd className="min-w-0 break-words text-foreground">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      );

    case "list":
      return (
        <ul className="flex flex-wrap gap-x-4 gap-y-1">
          {line.items.map((item) => (
            <li key={item} className="text-foreground">
              {item}
            </li>
          ))}
        </ul>
      );

    /*
     * Wrapped in a block element on purpose. The anchors are inline, so as
     * bare children of the output stack several links in a row collapsed onto
     * one line with no separator -- "Read the case studyLive siteSource".
     */
    case "link":
      return (
        <p>
          {line.external ? (
            <a
              href={line.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand underline underline-offset-4 hover:no-underline"
            >
              {line.label}
            </a>
          ) : (
            <Link
              href={line.href}
              className="text-brand underline underline-offset-4 hover:no-underline"
            >
              {line.label}
            </Link>
          )}
        </p>
      );
  }
}

/** Renders the first `steps` steps of a result. Infinity renders all of it. */
function Lines({ lines, steps }: { lines: TerminalLine[]; steps: number }) {
  const visible: ReactNode[] = [];
  let spent = 0;

  for (const [index, line] of lines.entries()) {
    const remaining = steps - spent;
    if (remaining <= 0) break;

    const cost = lineSteps(line);
    if (remaining < cost) {
      visible.push(<Line key={index} line={sliceLine(line, remaining)} />);
      break;
    }

    visible.push(<Line key={index} line={line} />);
    spent += cost;
  }

  return <>{visible}</>;
}

function Prompt() {
  return (
    <span className="shrink-0 select-none" aria-hidden>
      <span className="text-brand">mehedi</span>
      <span className="text-muted-foreground">:~</span>
      <span className="ml-1.5 text-brand">&#10095;</span>
    </span>
  );
}

function Key({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded border border-border bg-background px-1 font-mono text-[10px] text-foreground">
      {children}
    </kbd>
  );
}

export default function Terminal({ context }: { context: TerminalContext }) {
  const router = useRouter();
  const { setTheme } = useTheme();
  const reducedMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);

  /*
   * Seeded with the output of `help`, computed during render rather than in an
   * effect. That puts the full command list in the server-rendered HTML, so
   * the terminal reads as a populated panel -- not an empty black box -- for
   * anyone who never runs the JavaScript. It is also why entry 0 never types:
   * it is already on screen before React hydrates.
   */
  const [entries, setEntries] = useState<Entry[]>(() => [
    { id: 0, command: "help", result: runCommand("help", context) },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [typing, setTyping] = useState<Typing | null>(null);
  const [highlight, setHighlight] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  /*
   * `hovering` pauses the demo for as long as the pointer is over the panel --
   * hover is the handover, so what sits under the cursor is a plain terminal.
   * `engaged` is permanent: once someone has actually typed or run something,
   * the demo must never come back and type over them.
   */
  const [hovering, setHovering] = useState(false);
  const [engaged, setEngaged] = useState(false);
  /*
   * The demo is an animation loop with no natural end, so it also has to stop
   * when nobody can see it: scrolled past the hero, or the tab in the
   * background. Left ungated it competes for the main thread with every
   * interaction further down the page, which is exactly what INP measures.
   */
  const [inView, setInView] = useState(true);
  const tabVisible = useTabVisible();

  const typingId = typing?.id ?? null;
  const typingSteps = typing?.steps ?? 0;
  const typingTotal = typing?.total ?? 0;

  /*
   * Reduced motion opts out entirely: an unprompted animation that also moves
   * the scroll position is exactly what that preference is asking us not to do.
   */
  const demoRunning =
    !reducedMotion && !engaged && !hovering && inView && tabVisible;

  const suggestions = useMemo(
    () => suggestInput(input, context),
    [input, context]
  );
  const token = activeToken(input);

  /*
   * Ghost text is the shell autosuggestion: the rest of the best match, shown
   * behind the caret and taken with Tab or the right arrow. A single match
   * needs no list -- the ghost already shows it -- so the palette opens only
   * once the choice is genuinely ambiguous.
   */
  const ghost =
    token.length > 0 && suggestions.length > 0
      ? suggestions[0].value.slice(token.length)
      : "";
  /*
   * Mid-token, the ghost already spells out a lone match, so the list would
   * only repeat it -- it opens on genuine ambiguity. Just after a space the
   * ghost has nothing to show, so a single argument candidate is worth listing.
   */
  const paletteOpen =
    !demoRunning &&
    !dismissed &&
    input.trim().length > 0 &&
    suggestions.length > (token.length === 0 ? 0 : 1);
  const activeIndex = paletteOpen
    ? Math.min(highlight, suggestions.length - 1)
    : -1;

  /*
   * Advance the reveal on a timer. Depending on the total rather than on
   * `typing` itself keeps the interval from being torn down and rebuilt on
   * every single step.
   */
  useEffect(() => {
    if (typingId === null) return;
    const perTick = Math.max(1, Math.ceil(typingTotal / TYPING_TICKS));

    const timer = window.setInterval(() => {
      setTyping((current) => {
        if (current === null) return null;
        const steps = current.steps + perTick;
        return steps >= current.total ? null : { ...current, steps };
      });
    }, TYPING_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [typingId, typingTotal]);

  /*
   * Keep the newest output in view without scrolling the page itself. While
   * output is streaming the content grows a few pixels at a time, so pinning
   * instantly already reads as a smooth crawl -- easing each tick would only
   * chase a target that has since moved again. The settled scroll, once the
   * result has landed, is the one worth animating.
   */
  useEffect(() => {
    const screen = screenRef.current;
    if (!screen) return;

    const bottom = screen.scrollHeight - screen.clientHeight;
    if (typingId !== null) {
      screen.scrollTop = bottom;
      return;
    }
    screen.scrollTo({
      top: bottom,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }, [entries, typingId, typingSteps, reducedMotion]);

  const resetSuggestions = () => {
    setDismissed(false);
    setHighlight(0);
  };

  const accept = (value: string) => {
    setInput(applyCompletion(input, value));
    resetSuggestions();
    inputRef.current?.focus();
  };

  /*
   * The execution path, independent of where the command came from. The idle
   * demo drives this directly rather than going through the input, so it never
   * has to fake keystrokes into React state to get a command to run.
   */
  const runLine = (command: string) => {
    const result = runCommand(command, context);

    if (result.effect?.type === "clear") {
      setEntries([]);
      setTyping(null);
      return;
    }

    const id = nextId.current++;
    const total = result.lines.reduce((sum, line) => sum + lineSteps(line), 0);
    setEntries((current) => [...current, { id, command, result }]);
    setTyping(reducedMotion || total === 0 ? null : { id, steps: 0, total });

    switch (result.effect?.type) {
      case "navigate":
        router.push(result.effect.href);
        break;
      case "openExternal":
        window.open(result.effect.href, "_blank", "noopener,noreferrer");
        break;
      case "setTheme":
        setTheme(result.effect.theme);
        break;
      default:
        break;
    }
  };

  const submit = () => {
    const command = input;
    setInput("");
    setHistoryIndex(null);
    resetSuggestions();
    setEngaged(true);
    if (command.trim()) setHistory((current) => [...current, command.trim()]);
    runLine(command);
  };

  /*
   * Kept in a ref so the demo effect can call the latest closure without
   * listing it as a dependency -- naming runLine there would tear the loop down
   * and restart it on every render, which is every keystroke it types.
   */
  const runLineRef = useRef(runLine);
  useEffect(() => {
    runLineRef.current = runLine;
  });

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    // observe() always delivers one callback for the current state, so the
    // useState default above self-corrects -- no mount-time read needed here.
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  /*
   * The demo itself. Every state write happens inside a timer continuation
   * rather than in the effect body, so this drives the same input and the same
   * execution path a person would, one keystroke at a time.
   */
  useEffect(() => {
    if (!demoRunning) return;

    let cancelled = false;
    const timers = new Set<number>();
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const id = window.setTimeout(() => {
          timers.delete(id);
          resolve();
        }, ms);
        timers.add(id);
      });

    void (async () => {
      await wait(DEMO_FIRST_RUN_MS);

      for (let cycle = 0; !cancelled; cycle += 1) {
        // Wipe between passes so the transcript cannot grow without bound.
        if (cycle > 0) runLineRef.current("clear");

        for (const command of DEMO_SCRIPT) {
          for (let i = 1; i <= command.length; i += 1) {
            if (cancelled) return;
            setInput(command.slice(0, i));
            await wait(DEMO_KEYSTROKE_MS);
          }

          await wait(DEMO_BEFORE_ENTER_MS);
          if (cancelled) return;

          setInput("");
          runLineRef.current(command);
          await wait(DEMO_AFTER_OUTPUT_MS);
        }
      }
    })();

    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
      // Never leave a half-typed demo command sitting in someone's prompt.
      setInput("");
    };
  }, [demoRunning]);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      submit();
      return;
    }

    if (event.key === "Escape") {
      setDismissed(true);
      return;
    }

    if (event.key === "Tab") {
      // Only swallow Tab when there is something to complete, so the terminal
      // never becomes a keyboard trap.
      if (suggestions.length === 0) return;
      event.preventDefault();
      accept(suggestions[Math.max(activeIndex, 0)].value);
      return;
    }

    if (event.key === "ArrowRight") {
      const caret = event.currentTarget.selectionStart;
      if (ghost.length === 0 || caret !== input.length) return;
      event.preventDefault();
      accept(suggestions[0].value);
      return;
    }

    // The palette owns the vertical arrows while it is open; history takes
    // them back the moment it closes.
    if (event.key === "ArrowUp" && paletteOpen) {
      event.preventDefault();
      setHighlight(Math.max(0, activeIndex - 1));
      return;
    }

    if (event.key === "ArrowDown" && paletteOpen) {
      event.preventDefault();
      setHighlight(Math.min(suggestions.length - 1, activeIndex + 1));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (history.length === 0) return;
      const index =
        historyIndex === null
          ? history.length - 1
          : Math.max(0, historyIndex - 1);
      setHistoryIndex(index);
      setInput(history[index]);
      setDismissed(true);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndex === null) return;
      const index = historyIndex + 1;
      if (index >= history.length) {
        setHistoryIndex(null);
        setInput("");
        return;
      }
      setHistoryIndex(index);
      setInput(history[index]);
      return;
    }

    if (event.key === "l" && event.ctrlKey) {
      event.preventDefault();
      setEntries([]);
      setTyping(null);
    }
  };

  const last = entries[entries.length - 1];

  return (
    /*
     * The widget names itself rather than relying on a wrapping section to do
     * it. It used to sit under a heading that supplied both the landmark and
     * the explanation; in the hero there is no such heading, and without this
     * a screen reader walks straight into the role="log" of boot output with
     * nothing saying what it is.
     */
    <div
      ref={rootRef}
      role="region"
      aria-label="Interactive terminal - explore this site's data from the command line"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      /*
       * Focus is a one-way handover, not a hover: a keyboard user who tabs in
       * has committed, and the pointer may never come near the panel.
       */
      onFocusCapture={() => setEngaged(true)}
      className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-foreground/[0.06]"
    >
      {/* A brand hairline along the top edge, the way a focused window reads. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/70 to-transparent"
      />

      <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-2.5">
        <span className="flex w-12 gap-1.5" aria-hidden>
          <span className="size-3 rounded-full bg-destructive/70" />
          <span className="size-3 rounded-full bg-brand-accent/70" />
          <span className="size-3 rounded-full bg-emerald-500/70" />
        </span>
        <p className="flex flex-1 items-center justify-center gap-1.5 font-mono text-xs text-muted-foreground">
          <TerminalIcon aria-hidden className="size-3.5 text-brand" />
          mehedi@portfolio: ~
        </p>
        {/* Balances the traffic lights so the title sits truly centred. */}
        <span className="w-12" aria-hidden />
      </div>

      {/*
       * Clicking the body focuses the input, the way a real terminal behaves.
       * The input itself is a real <input>, not a styled div with a fake caret,
       * so screen readers, IME input and mobile keyboards all work unchanged.
       */}
      <div
        ref={screenRef}
        onClick={() => inputRef.current?.focus()}
        /*
         * A fixed height, not a min/max range. The demo is continuously adding
         * and clearing output, and a panel that grew and collapsed with it
         * would shove the whole hero around several times a minute.
         */
        className="terminal-scroll h-[17rem] overflow-y-auto p-4 font-mono text-sm leading-relaxed sm:h-[19rem]"
      >
        <div
          role="log"
          aria-live="off"
          aria-label="Terminal output"
          className="space-y-3"
        >
          {entries.map((entry) => (
            <div key={entry.id} className="space-y-1">
              {entry.command !== undefined && (
                <p>
                  <Prompt />{" "}
                  <span className="text-foreground">{entry.command}</span>
                </p>
              )}
              <Lines
                lines={entry.result.lines}
                steps={
                  entry.id === typingId ? typingSteps : Number.POSITIVE_INFINITY
                }
              />
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <Prompt />
          <label htmlFor="terminal-input" className="sr-only">
            Terminal command
          </label>
          <span className="sr-only" id="terminal-hint">
            Type a command and press Enter. Tab or the right arrow accepts the
            suggested completion, the up and down arrows walk history.
          </span>

          <div className="relative min-w-0 flex-1">
            {/*
             * Ghost text sits underneath the real input, offset by an invisible
             * copy of what has been typed so the completion lines up with the
             * caret. Both layers inherit the same mono face and leading, which
             * is what keeps them in register.
             */}
            <p
              aria-hidden
              className="pointer-events-none absolute inset-0 truncate whitespace-pre leading-relaxed text-muted-foreground/60"
            >
              <span className="invisible">{input}</span>
              {ghost}
            </p>
            <input
              id="terminal-input"
              ref={inputRef}
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
                setHistoryIndex(null);
                resetSuggestions();
                setEngaged(true);
              }}
              onKeyDown={handleKeyDown}
              role="combobox"
              aria-expanded={paletteOpen}
              aria-controls="terminal-suggestions"
              aria-autocomplete="list"
              aria-activedescendant={
                activeIndex >= 0
                  ? `terminal-suggestion-${activeIndex}`
                  : undefined
              }
              aria-describedby="terminal-hint"
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              className="relative w-full bg-transparent leading-relaxed text-foreground caret-brand outline-none"
            />
          </div>
        </div>

        <ul
          id="terminal-suggestions"
          role="listbox"
          aria-label="Command suggestions"
          className={cn(
            "terminal-scroll mt-2 max-h-40 overflow-y-auto rounded-lg border border-border bg-muted/40 p-1",
            !paletteOpen && "hidden"
          )}
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.value}
              id={`terminal-suggestion-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              onMouseDown={(event) => {
                // mousedown, not click: by click time the input has already
                // lost focus, which scrolls the completion out from under it.
                event.preventDefault();
                accept(suggestion.value);
              }}
              onMouseEnter={() => setHighlight(index)}
              className={cn(
                "flex cursor-pointer items-baseline gap-3 rounded-md px-2 py-1",
                index === activeIndex
                  ? "bg-brand/15 text-brand"
                  : "text-foreground"
              )}
            >
              <span className="shrink-0">{suggestion.value}</span>
              <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
                {suggestion.hint}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border bg-muted/30 px-4 py-2 font-mono text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <Key>Tab</Key> complete
        </span>
        <span className="flex items-center gap-1">
          <Key>&#8593;</Key>
          <Key>&#8595;</Key> history
        </span>
        <span className="flex items-center gap-1">
          <Key>Ctrl</Key>
          <Key>L</Key> clear
        </span>
      </div>

      <p aria-live="polite" className="sr-only">
        {last && typingId === null ? announce(last.result) : ""}
      </p>
    </div>
  );
}
