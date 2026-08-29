import type { CSSProperties } from "react";
import type { IconType } from "react-icons";
import { FaAws } from "react-icons/fa";
import {
  SiDocker,
  SiExpress,
  SiFramer,
  SiGithub,
  SiGithubactions,
  SiGnubash,
  SiGo,
  SiJenkins,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPrisma,
  SiReact,
  SiRedux,
  SiTypescript,
} from "react-icons/si";

import CardDemo from "@/components/cards-demo-3";
import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";

interface ToolBrand {
  name: string;
  Icon: IconType;
  /** Rendered on the light card. */
  light: string;
  /** Rendered on the dark card. */
  dark: string;
}

interface ToolCategory {
  category: string;
  items: ToolBrand[];
}

/*
 * Logos render in their real brand colours rather than in the foreground
 * colour, because the colour is half of what makes a mark recognisable at
 * 48px -- a monochrome Docker whale and a monochrome MongoDB leaf read as the
 * same silhouette.
 *
 * Both surfaces are named because both can fail, and the pair is not
 * "brand colour plus an exception". A mark that is officially black (Next.js,
 * Express, GitHub) disappears into the dark card; a saturated mid-tone one
 * (Node, MongoDB, Docker, Bash) is too light against the near-white plate,
 * and AWS orange is worst of all there at 1.96:1. Where the vendor publishes a
 * second value for exactly this reason it is used -- react.dev's #087EA4,
 * go.dev's #007D9C, MongoDB forest #00684A, the AWS wordmark navy -- and the
 * rest are the brand hue moved just far enough to clear 3:1 against its card,
 * which is what WCAG 1.4.11 asks of a graphic that carries meaning.
 */
const toolCategories: ToolCategory[] = [
  {
    category: "Frontend",
    items: [
      { name: "Next.js", Icon: SiNextdotjs, light: "#000000", dark: "#FFFFFF" },
      { name: "React", Icon: SiReact, light: "#087EA4", dark: "#61DAFB" },
      { name: "Redux", Icon: SiRedux, light: "#764ABC", dark: "#A98BE8" },
      {
        name: "Framer Motion",
        Icon: SiFramer,
        light: "#0055FF",
        dark: "#4D8DFF",
      },
      {
        name: "TypeScript",
        Icon: SiTypescript,
        light: "#2C6CB5",
        dark: "#4C9BE8",
      },
    ],
  },
  {
    category: "Backend",
    items: [
      { name: "Node.js", Icon: SiNodedotjs, light: "#339933", dark: "#5FA04E" },
      { name: "Express", Icon: SiExpress, light: "#000000", dark: "#FFFFFF" },
      { name: "Go", Icon: SiGo, light: "#007D9C", dark: "#00ADD8" },
      { name: "MongoDB", Icon: SiMongodb, light: "#00684A", dark: "#47A248" },
      {
        name: "PostgreSQL",
        Icon: SiPostgresql,
        light: "#4169E1",
        dark: "#6E8FF0",
      },
      { name: "Prisma", Icon: SiPrisma, light: "#2D3748", dark: "#E2E8F0" },
    ],
  },
  {
    category: "Tools",
    items: [
      { name: "GitHub", Icon: SiGithub, light: "#181717", dark: "#FFFFFF" },
      { name: "Docker", Icon: SiDocker, light: "#1D7FD4", dark: "#2496ED" },
      {
        name: "GitHub Actions",
        Icon: SiGithubactions,
        light: "#2088FF",
        dark: "#2088FF",
      },
      { name: "Jenkins", Icon: SiJenkins, light: "#D24939", dark: "#E8695C" },
      { name: "AWS", Icon: FaAws, light: "#232F3E", dark: "#FF9900" },
      { name: "Bash", Icon: SiGnubash, light: "#3E8E1E", dark: "#4EAA25" },
    ],
  },
];

/*
 * The pair is handed to CSS as two custom properties and picked by the dark
 * variant, rather than branched in JS. A server component cannot know the
 * visitor's theme, so choosing here would make every icon flash the wrong
 * colour until next-themes hydrates.
 */
function ToolIcon({ Icon, light, dark }: ToolBrand) {
  return (
    <Icon
      className="h-12 w-12 text-[color:var(--tool-icon)] dark:text-[color:var(--tool-icon-dark)]"
      style={
        {
          "--tool-icon": light,
          "--tool-icon-dark": dark,
        } as CSSProperties
      }
    />
  );
}

const tools = toolCategories.map((group) => ({
  category: group.category,
  items: group.items.map((brand) => ({
    name: brand.name,
    icon: <ToolIcon {...brand} />,
  })),
}));

export default function Tools() {
  return (
    <Section id="tools" aria-labelledby="tools-heading">
      <Reveal>
        <SectionHeading
          id="tools-heading"
          index="05"
          eyebrow="Toolkit"
          title="Tools & Technologies"
          lead="What I reach for day to day, grouped by where it sits in the stack."
          className="mb-12"
        />
      </Reveal>
      <Reveal delay={0.1}>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <CardDemo tools={tools} />
        </div>
      </Reveal>
    </Section>
  );
}
