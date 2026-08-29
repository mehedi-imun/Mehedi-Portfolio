import { allExperience } from "./experience";

/*
 * Editorial content for the home page's service, proof and FAQ sections.
 *
 * REVIEW BEFORE SHIPPING. The services and FAQ answers below are drafts: they
 * describe what someone with this CV can credibly offer, but they are claims
 * made on your behalf, not facts derived from the repo. Edit them so they say
 * what you actually want to sell and how you actually work.
 *
 * The statistics are the opposite -- every one is computed from data already in
 * the codebase, so they cannot drift or overstate. Nothing there is invented.
 */

export interface Service {
  /** Two-digit ordinal shown on the card. */
  index: string;
  title: string;
  summary: string;
  tags: string[];
}

/*
 * Ordered deliberately. The full-stack build leads because that is the
 * positioning; the API card follows as the thing that makes it credible rather
 * than as the headline offer.
 */
export const services: Service[] = [
  {
    index: "01",
    title: "Full stack product build",
    summary:
      "Take a product from spec to something people can use — interface and API built together, typed end to end, server-rendered where it matters, with the seams between the two actually thought through.",
    tags: ["Next.js", "React", "TypeScript", "Prisma"],
  },
  {
    index: "02",
    title: "APIs & data layers",
    summary:
      "The service layer underneath: REST or GraphQL endpoints, a schema that survives its third migration, auth, caching, and the load testing to prove it holds.",
    tags: ["Node.js", "Express", "PostgreSQL", "Redis"],
  },
  {
    index: "03",
    title: "Deployment & CI/CD",
    summary:
      "Containerise it, get it building on every push, and make deploys boring — so releasing on a Friday is a scheduling decision rather than a gamble.",
    tags: ["Docker", "GitHub Actions", "AWS", "Observability"],
  },
];

export interface Faq {
  question: string;
  answer: string;
}

export const faqs: Faq[] = [
  {
    question: "What kind of work are you looking for?",
    answer:
      "Full stack engineering — building interfaces, the APIs behind them, and the deployment pipeline around both. Full-time roles and fixed-scope contracts both work.",
  },
  {
    question: "Which timezone do you work in?",
    answer:
      "UTC+6, based in Dhaka. That overlaps a full working day with Europe and the morning with the US East Coast, and I keep hours that make standups workable either way.",
  },
  {
    question: "What does your stack actually look like?",
    answer:
      "TypeScript throughout. Node and Express on the server, PostgreSQL or MongoDB for data, Redis for caching, Next.js and React on the frontend, Docker and GitHub Actions to ship it.",
  },
  {
    question: "Can you work with an existing codebase?",
    answer:
      "Yes — most work is. I read before I write, keep changes reviewable, and would rather leave a codebase more consistent than I found it than rewrite it out from under you.",
  },
  {
    question: "How do we start?",
    answer:
      "Email me with roughly what you need and any constraints you already know about. I will tell you honestly whether it is something I am the right person for.",
  },
];

export interface Stat {
  value: string;
  label: string;
  detail: string;
}

/*
 * Derived, never hand-written. If a role is added to lib/experience.ts these
 * numbers move on their own, which is the only way a "proof in numbers" panel
 * stays honest over time.
 */
export function buildStats(technologyCount: number): Stat[] {
  const startYears = allExperience
    .map((role) => Number(role.startDate.slice(0, 4)))
    .filter((year) => Number.isFinite(year));

  const earliest = startYears.length ? Math.min(...startYears) : null;
  const years = earliest ? new Date().getFullYear() - earliest : 0;

  const companies = new Set(allExperience.map((role) => role.company));

  return [
    {
      value: `${years}+`,
      label: "Years shipping",
      detail: `Production work since ${earliest ?? "—"}`,
    },
    {
      value: String(allExperience.length),
      label: "Engineering roles",
      detail: `Across ${companies.size} ${
        companies.size === 1 ? "company" : "companies"
      }`,
    },
    {
      value: String(technologyCount),
      label: "Technologies",
      detail: "Used day to day, not once in a tutorial",
    },
    {
      value: "UTC+6",
      label: "Timezone",
      detail: "Overlaps EU fully, US mornings",
    },
  ];
}
