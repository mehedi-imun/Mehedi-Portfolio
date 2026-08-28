export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  /** Card copy on the blog index. */
  excerpt: string;
  /** 120-160 chars, used verbatim as the meta description. */
  description: string;
  /** Human-readable display date. */
  date: string;
  /** YYYY-MM-DD, used for datePublished and sitemap lastModified. */
  dateISO: string;
  readTime: string;
  tags: string[];
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "getting-started-with-nextjs",
    title: "Getting Started with Next.js",
    excerpt:
      "Learn how to build modern web applications with Next.js, the React framework for production.",
    description:
      "A practical introduction to Next.js: project setup, file-system routing, the rendering strategies it offers, and when to reach for each one.",
    date: "May 2, 2025",
    dateISO: "2025-05-02",
    readTime: "5 min read",
    tags: ["Next.js", "React", "Tutorial"],
    content: `
      <p class="lead">Next.js is a React framework that handles the parts of a production app you would otherwise build yourself: routing, rendering strategy, bundling and caching. This post walks through setting up a project and the features you will actually use in the first week.</p>
      <h2>What Next.js gives you over plain React</h2>
      <p>A plain React app ships an empty HTML document and builds the page in the browser. Next.js renders on the server first, so the HTML that arrives already contains your content. That matters for perceived load time and it matters for anything that reads your page without executing much JavaScript.</p>
      <h2>Creating a project</h2>
      <p>The official generator sets up TypeScript, ESLint and the App Router for you:</p>
      <pre><code>npx create-next-app@latest my-app</code></pre>
      <p>Answer yes to TypeScript and the App Router unless you have a specific reason not to. The App Router is where new framework features land.</p>
      <h2>File-system routing</h2>
      <p>Directories under <code>app/</code> become URL segments, and a <code>page.tsx</code> inside a directory makes that segment routable. A file at <code>app/blog/page.tsx</code> serves <code>/blog</code>. A directory named with brackets, <code>app/blog/[slug]/page.tsx</code>, serves every URL under <code>/blog/</code> and receives the segment as a parameter.</p>
      <h3>Layouts nest</h3>
      <p>A <code>layout.tsx</code> wraps every page beneath it and does not re-render when you navigate between sibling pages. Put your header, footer and providers there once rather than repeating them per page.</p>
      <h2>Server and client components</h2>
      <p>Components in the App Router are server components by default. They run on the server, never ship to the browser, and can read data directly. Adding the "use client" directive at the top of a file opts that component and everything it imports into the browser bundle.</p>
      <p>The practical rule: keep pages as server components and push interactivity down into small client components. That way you keep the ability to export metadata from the page, and you ship less JavaScript.</p>
      <h3>Rendering strategies</h3>
      <ul>
        <li><strong>Static</strong> - rendered at build time. The default, and the fastest thing you can serve.</li>
        <li><strong>Dynamic</strong> - rendered per request, for anything that depends on cookies or the incoming request.</li>
        <li><strong>Incremental</strong> - static, but revalidated on a timer so content stays fresh without a rebuild.</li>
      </ul>
      <h2>Data fetching</h2>
      <p>Server components can be async. You await your data directly in the component body, with no effect hook and no loading state to manage:</p>
      <pre><code>export default async function Page() {
  const posts = await getPosts()
  return &lt;PostList posts={posts} /&gt;
}</code></pre>
      <h2>Where to go next</h2>
      <p>Once routing feels comfortable, read up on the metadata API for per-page titles and descriptions, and on <code>generateStaticParams</code> for pre-rendering dynamic routes. Those two together are what turn a working Next.js app into one that performs well and is properly indexable.</p>
    `,
  },
  {
    id: "2",
    slug: "why-i-switched-to-tailwind-css",
    title: "Why I Switched to Tailwind CSS",
    excerpt:
      "After years of using traditional CSS and various preprocessors, I made the switch to Tailwind CSS. Here is why.",
    description:
      "Why I moved from Sass and BEM to Tailwind CSS: the maintenance problems it solved, the objections I had to work through, and where it still falls short.",
    date: "April 28, 2025",
    dateISO: "2025-04-28",
    readTime: "7 min read",
    tags: ["CSS", "Tailwind", "Web Development"],
    content: `
      <p class="lead">After years of writing Sass with BEM naming, I moved to Tailwind CSS. The change was not about typing less. It was about deleting confidently.</p>
      <h2>The problem was not writing CSS</h2>
      <p>Writing CSS was never the bottleneck. The bottleneck was that on a project of any age, nobody could tell whether a rule was still in use. Deleting a component left its styles behind, because removing them meant proving nothing else depended on them. Stylesheets only grew.</p>
      <p>Preprocessors made this worse in one specific way. Nesting and mixins made it easy to write rules whose final specificity was hard to predict, so the fix for a stubborn style was another, more specific rule.</p>
      <h2>What Tailwind actually changes</h2>
      <p>Tailwind moves styles into the markup as utility classes. The consequence that matters is <strong>locality</strong>: when you delete a component, its styling leaves with it. There is no orphaned stylesheet, because there is no stylesheet.</p>
      <h3>Constraints instead of choices</h3>
      <p>Utilities come from a scale. Spacing is a fixed set of steps, not any pixel value you feel like typing. That constraint is the real value, and it is why a Tailwind codebase touched by four developers still looks consistent.</p>
      <pre><code>&lt;div class="flex items-center gap-4 rounded-lg border p-6"&gt;</code></pre>
      <p>You can read the box model, the layout and the spacing without opening another file.</p>
      <h2>The objections I had to work through</h2>
      <h3>Separation of concerns</h3>
      <p>This was my strongest objection and I no longer hold it. Separation of concerns is about coupling, not about file extensions. In a component-based app the component <em>is</em> the unit of concern, and its styles belong to it as much as its markup does. Splitting them across two files was never decoupling, only relocation.</p>
      <h3>Unreadable markup</h3>
      <p>Partly fair. An element with twenty utilities is genuinely hard to scan. The answer is that an element needing twenty utilities is usually doing too much and should be split. When a pattern genuinely repeats, extract a component, not a CSS class.</p>
      <h2>Where it still falls short</h2>
      <ul>
        <li>Complex keyframe animations are clearer in real CSS. Write them in a stylesheet and reference them.</li>
        <li>Long arbitrary-value utilities are worse than a plain CSS rule. If you are writing brackets, consider dropping to CSS.</li>
        <li>The learning curve is real for anyone joining who does not know the scale by heart.</li>
      </ul>
      <h2>Would I do it again</h2>
      <p>Yes, for anything component-based. The gain was not development speed, it was that stylesheets stopped growing monotonically. Being able to delete a component and know its styles went with it changed how willing I was to refactor.</p>
    `,
  },
  {
    id: "3",
    slug: "creating-smooth-animations-with-framer-motion",
    title: "Creating Smooth Animations with Framer Motion",
    excerpt:
      "Learn how to add beautiful animations to your React applications using Framer Motion.",
    description:
      "How to build smooth, interruptible React animations with Framer Motion: the motion component, layout animations, exit transitions and staying on the compositor.",
    date: "April 21, 2025",
    dateISO: "2025-04-21",
    readTime: "6 min read",
    tags: ["React", "Animation", "Framer Motion"],
    content: `
      <p class="lead">Framer Motion, published as the <code>motion</code> package, turns animation into a declarative prop rather than an imperative sequence. This post covers the parts you need for real interface work, and the performance rules that decide whether it feels smooth.</p>
      <h2>The motion component</h2>
      <p>Every animation starts with a <code>motion</code> element, which is an ordinary DOM element that accepts animation props:</p>
      <pre><code>&lt;motion.div
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
/&gt;</code></pre>
      <p>The <code>initial</code> prop is the state before mount, <code>animate</code> is the target. When the target changes, the animation runs from wherever the element currently is. That last part is what makes it feel good: an interrupted animation redirects rather than restarting.</p>
      <h2>Variants for coordinated motion</h2>
      <p>Named states let a parent orchestrate its children, which is how you get a staggered list without hand-computing delays:</p>
      <pre><code>const list = {
  visible: { transition: { staggerChildren: 0.06 } },
}
const item = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
}</code></pre>
      <p>The parent sets the list variants, each child sets the item variants, and the stagger is derived rather than specified per element.</p>
      <h2>Exit animations</h2>
      <p>React removes elements from the tree immediately, so an unmounting element has nothing left to animate. <code>AnimatePresence</code> holds it in the DOM until its exit animation finishes. Give every child a stable <code>key</code> or the presence tracking cannot tell what left.</p>
      <h2>Layout animations</h2>
      <p>Adding the <code>layout</code> prop to a motion element animates position and size changes that come from a layout shift, not from an animated property. Reordering a list, expanding a card, moving an element between containers - all become smooth without you calculating coordinates. Under the hood it measures before and after and applies a transform, which is why it stays cheap.</p>
      <h2>Staying at 60fps</h2>
      <p>This is the part that decides whether your animation feels expensive. Animate <code>opacity</code> and <code>transform</code> only. Those two are handled by the compositor without touching layout or paint. Animating <code>width</code>, <code>height</code>, <code>top</code> or <code>margin</code> forces layout recalculation on every frame, and on a mid-range phone that is where the jank comes from.</p>
      <ul>
        <li>Prefer <code>scale</code> over animating width and height.</li>
        <li>Prefer <code>x</code> and <code>y</code> over <code>top</code> and <code>left</code>.</li>
        <li>Use the <code>layout</code> prop when a real layout change is unavoidable.</li>
        <li>Do not animate a blur filter across large areas.</li>
      </ul>
      <h2>Respect reduced motion</h2>
      <p>Some people get motion sickness from parallax and large transitions, and the operating system exposes that preference. The <code>useReducedMotion</code> hook reads it, and honouring it is a one-line change: fall back to a plain opacity fade, or to no animation at all. Shipping without this check is an accessibility bug, not a missing nicety.</p>
      <h2>One caveat about server rendering</h2>
      <p>If an element's initial state is invisible, that is what lands in the server-rendered HTML. Anything important - your headline, your intro paragraph - should render visible and animate from there, or you have made your main content dependent on JavaScript running successfully.</p>
    `,
  },
  {
    id: "4",
    slug: "building-a-custom-react-hook",
    title: "Building a Custom React Hook",
    excerpt:
      "A step-by-step guide to creating your own custom React hooks for reusable logic.",
    description:
      "A step-by-step guide to writing custom React hooks: extracting stateful logic, handling cleanup, avoiding stale closures and knowing when not to write one.",
    date: "April 15, 2025",
    dateISO: "2025-04-15",
    readTime: "8 min read",
    tags: ["React", "Hooks", "JavaScript"],
    content: `
      <p class="lead">A custom hook is a function whose name starts with <code>use</code> and which calls other hooks. That is the entire specification. The interesting question is not how to write one, but when a hook is the right shape for the problem.</p>
      <h2>Extracting your first hook</h2>
      <p>Take a component that persists a value to local storage. The logic is three concerns tangled together: reading the initial value, writing on change, and exposing a setter. Pulled out, it becomes:</p>
      <pre><code>function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(initialValue)

  useEffect(() =&gt; {
    const stored = window.localStorage.getItem(key)
    if (stored !== null) setValue(JSON.parse(stored))
  }, [key])

  useEffect(() =&gt; {
    window.localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}</code></pre>
      <p>Note that the initial read happens in an effect rather than in <code>useState</code>. Reading local storage during render would produce different output on the server than in the browser, and hydration would mismatch.</p>
      <h2>Always clean up</h2>
      <p>Any hook that subscribes to something must unsubscribe. An effect's return value is its cleanup function, and React calls it before re-running the effect and on unmount:</p>
      <pre><code>useEffect(() =&gt; {
  const controller = new AbortController()
  fetch(url, { signal: controller.signal })
    .then((r) =&gt; r.json())
    .then(setData)
    .catch((e) =&gt; { if (e.name !== "AbortError") setError(e) })
  return () =&gt; controller.abort()
}, [url])</code></pre>
      <p>Without the abort, a fast sequence of prop changes leaves several requests in flight and whichever resolves last wins. That is the classic race that shows up as the wrong data flashing on screen.</p>
      <h2>The stale closure trap</h2>
      <p>An effect closes over the values from the render in which it ran. If it reads state but that state is not in the dependency array, it keeps reading the old value forever. Two ways out:</p>
      <ul>
        <li>Use the functional form of the setter so you never need to read the current value.</li>
        <li>Keep the value in a ref when you genuinely need the latest value without re-subscribing.</li>
      </ul>
      <p>Do not silence the exhaustive-deps lint rule to make the warning go away. It is almost always describing a real bug.</p>
      <h2>Stable return values</h2>
      <p>If your hook returns an object or a function, it returns a new one on every render. Any consumer that memoises on it will invalidate constantly. Wrap returned functions in <code>useCallback</code> and returned objects in <code>useMemo</code>, or return a tuple of primitives and let the consumer decide.</p>
      <h2>Rules that are not style preferences</h2>
      <p>Hooks must be called unconditionally, at the top level, in the same order every render. React identifies hook state by call order, not by name, so a hook inside a conditional shifts every subsequent hook's identity. This is why the naming convention matters: the linter uses the <code>use</code> prefix to know which functions to check.</p>
      <h2>When not to write a hook</h2>
      <p>Hooks are for reusing <em>stateful</em> logic. If your function does not call another hook, make it a plain function - it will be easier to test and callable from anywhere. And if the logic is used in exactly one component and is not likely to spread, leaving it inline is often clearer than the indirection of a hook.</p>
    `,
  },
  {
    id: "5",
    slug: "understanding-typescript-generics",
    title: "Understanding TypeScript Generics",
    excerpt:
      "A deep dive into TypeScript generics and how they can make your code more flexible and reusable.",
    description:
      "Understand TypeScript generics from first principles: type parameters, constraints, inference, conditional types and where generics stop being worth it.",
    date: "April 7, 2025",
    dateISO: "2025-04-07",
    readTime: "10 min read",
    tags: ["TypeScript", "JavaScript", "Programming"],
    content: `
      <p class="lead">Generics are how you write a function once and keep its type information intact for every caller. Without them you choose between duplicating a function per type or widening to <code>any</code> and losing the guarantees you adopted TypeScript for.</p>
      <h2>The problem generics solve</h2>
      <p>Consider a function that returns the first element of an array. Typed to take and return <code>any</code>, it compiles and tells you nothing. A type parameter connects the input to the output:</p>
      <pre><code>function first&lt;T&gt;(items: T[]): T | undefined {
  return items[0]
}

first([1, 2, 3])        // number | undefined
first(["a", "b"])       // string | undefined</code></pre>
      <p>Here <code>T</code> is a placeholder filled in at each call site. You never pass it explicitly, because TypeScript infers it from the argument.</p>
      <h2>Constraints</h2>
      <p>An unconstrained type parameter could be anything, so you cannot touch its properties. The <code>extends</code> keyword narrows what callers may pass, and in exchange lets you use what you now know is there:</p>
      <pre><code>function longest&lt;T extends { length: number }&gt;(a: T, b: T): T {
  return a.length &gt;= b.length ? a : b
}</code></pre>
      <p>Constraints are the main tool for making a generic both flexible and useful. Too loose and you cannot do anything with the value; too tight and callers cannot use it.</p>
      <h3>Using keyof for property access</h3>
      <p>The canonical example, and worth memorising, is a type-safe property getter:</p>
      <pre><code>function get&lt;T, K extends keyof T&gt;(obj: T, key: K): T[K] {
  return obj[key]
}

get({ name: "Ada", age: 36 }, "name")   // string
get({ name: "Ada", age: 36 }, "email")  // compile error</code></pre>
      <p>The return type <code>T[K]</code> is an indexed access type: the type of property <code>K</code> on <code>T</code>. The typo is caught at compile time rather than producing <code>undefined</code> at runtime.</p>
      <h2>Defaults</h2>
      <p>A type parameter can have a default, which is what lets a generic type be used without arguments:</p>
      <pre><code>interface ApiResponse&lt;T = unknown&gt; {
  data: T
  status: number
}</code></pre>
      <p>Prefer <code>unknown</code> to <code>any</code> as the default. Using <code>unknown</code> forces the consumer to narrow before use; <code>any</code> silently disables checking for everything downstream.</p>
      <h2>Conditional types</h2>
      <p>Types can branch on a condition, which is how the utility types in the standard library are built:</p>
      <pre><code>type Unwrap&lt;T&gt; = T extends Promise&lt;infer U&gt; ? U : T

type A = Unwrap&lt;Promise&lt;string&gt;&gt;  // string
type B = Unwrap&lt;number&gt;            // number</code></pre>
      <p>The <code>infer</code> keyword declares a placeholder that TypeScript fills in by pattern-matching the type. This is the mechanism behind <code>ReturnType</code>, <code>Awaited</code> and <code>Parameters</code>.</p>
      <h2>Distribution over unions</h2>
      <p>A conditional type applied to a bare type parameter distributes across a union, so unwrapping a union of two types gives you a union of two results rather than one result over a union. This surprises people. Wrapping both sides of the check in square brackets opts out of the distribution.</p>
      <h2>Knowing when to stop</h2>
      <p>Generics cost readability. A signature with four type parameters and nested conditionals is a maintenance problem regardless of how clever it is. Two questions before adding a type parameter:</p>
      <ul>
        <li>Does this connect an input type to an output type? If not, you probably want a union or an overload.</li>
        <li>Will a caller be worse off with a concrete type? If not, use the concrete type.</li>
      </ul>
      <p>A generic that exists because it might be needed later is a generic that only makes today's code harder to read.</p>
    `,
  },
  {
    id: "6",
    slug: "the-future-of-web-development",
    title: "The Future of Web Development",
    excerpt:
      "Exploring emerging trends and technologies that will shape the future of web development.",
    description:
      "The trends actually reshaping web development: the server-rendering swing back, edge runtimes, typed end-to-end contracts and the return of platform primitives.",
    date: "March 29, 2025",
    dateISO: "2025-03-29",
    readTime: "9 min read",
    tags: ["Web Development", "Trends", "Technology"],
    content: `
      <p class="lead">Predicting frameworks is a waste of time. Predicting the direction of the constraints is not. Here are the shifts that seem to be holding, and what each one asks you to change.</p>
      <h2>The pendulum swung back to the server</h2>
      <p>For a decade the default was to ship a JavaScript bundle that built the page in the browser. That default is being reversed. Server components, islands architecture and progressively enhanced forms all point the same way: render on the server, hydrate only what needs to be interactive.</p>
      <p>The reason is not fashion, it is that the median device is a mid-range phone. Parsing and executing a megabyte of JavaScript on that device costs seconds you cannot get back with a faster network.</p>
      <p><strong>What it asks of you:</strong> treat client-side JavaScript as a cost you justify per component, not as the default.</p>
      <h2>Compute is moving to the edge</h2>
      <p>Running code in a datacentre near the user removes a round trip that no amount of caching fixes. Edge runtimes are constrained - no full Node API, limited execution time - which is exactly why they are fast to start.</p>
      <p><strong>What it asks of you:</strong> know which of your work is latency-sensitive and portable enough to move, and keep it free of Node-specific dependencies.</p>
      <h2>Types are becoming an end-to-end contract</h2>
      <p>The interesting change is not that people use TypeScript. It is that the type of an API response is increasingly derived from a single definition, rather than written twice and kept in sync by hand. Schema-first validation, generated clients and typed RPC all collapse the gap where client and server drift apart.</p>
      <p><strong>What it asks of you:</strong> pick one place where a shape is defined, and generate everything else from it.</p>
      <h2>The platform absorbed the libraries</h2>
      <p>A steady pattern: something needs a dependency, then it does not. Container queries replaced most of what a JavaScript element-size observer did. CSS nesting removed a common reason to reach for a preprocessor. The view transitions API is doing to page-transition libraries what <code>fetch</code> did to jQuery's ajax.</p>
      <p><strong>What it asks of you:</strong> before adding a dependency, check whether the platform shipped it. The answer is yes more often than it used to be.</p>
      <h2>AI moved into the toolchain, not the output</h2>
      <p>The durable effect of AI on this work so far is on the inside of the process - scaffolding, review, tests, migrations - rather than on what ships. The bottleneck has shifted from producing code to verifying it, which raises the return on tests, types and observability. Those were already good ideas; they are now load-bearing.</p>
      <p><strong>What it asks of you:</strong> invest in the things that let you trust a change you did not write line by line.</p>
      <h2>Performance became a measured budget</h2>
      <p>Core Web Vitals turned "the site feels slow" into three numbers with thresholds. That is a real change in how performance work gets funded, because a regression is now a number someone owns rather than a vague complaint.</p>
      <ul>
        <li><strong>LCP</strong> under 2.5s - how fast the main content appears.</li>
        <li><strong>INP</strong> under 200ms - how fast the page responds to input.</li>
        <li><strong>CLS</strong> under 0.1 - how much the layout jumps while loading.</li>
      </ul>
      <h2>What has not changed</h2>
      <p>Semantic HTML still outlives every framework built on top of it. Accessibility is still cheaper to build in than to retrofit. A page that works before JavaScript loads is still more robust than one that does not. The tools churn; the constraints they are working around do not.</p>
    `,
  },
];

export const allTags: string[] = Array.from(
  new Set(blogPosts.flatMap((post) => post.tags))
);

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

/** Card-shaped subset, so the index does not ship full post bodies to the client. */
export type BlogPostSummary = Omit<BlogPost, "content">;

export const blogPostSummaries: BlogPostSummary[] = blogPosts.map(
  ({ id, slug, title, excerpt, description, date, dateISO, readTime, tags }) => ({
    id,
    slug,
    title,
    excerpt,
    description,
    date,
    dateISO,
    readTime,
    tags,
  })
);
