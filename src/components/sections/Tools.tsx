import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import CardDemo from "../cards-demo-3";

import { ReactNode } from "react";

interface ToolItem {
  name: string;
  icon: ReactNode;
}

interface ToolCategory {
  category: string;
  items: ToolItem[];
}

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
const tools: ToolCategory[] = [
  {
    category: "Frontend",
    items: [
      {
        name: "Next.js",
        icon: <SiNextdotjs className="h-12 w-12 " />,
      },
      {
        name: "React",
        icon: <SiReact className="h-12 w-12 " />,
      },
      {
        name: "Redux",
        icon: <SiRedux className="h-12 w-12 " />,
      },
      {
        name: "Framer Motion",
        icon: <SiFramer className="h-12 w-12 text-foreground" />,
      },
      {
        name: "Typescript",
        icon: <SiTypescript className="h-12 w-12 text-foreground" />,
      },
    ],
  },
  {
    category: "Backend",
    items: [
      {
        name: "Node.js",
        icon: <SiNodedotjs className="h-12 w-12 text-foreground" />,
      },
      {
        name: "Express",
        icon: <SiExpress className="h-12 w-12 text-foreground" />,
      },
      {
        name: "Go",
        icon: <SiGo className="h-12 w-12 text-foreground" />,
      },
      {
        name: "MongoDB",
        icon: <SiMongodb className="h-12 w-12 text-foreground" />,
      },
      {
        name: "PostgreSQL",
        icon: <SiPostgresql className="h-12 w-12 text-foreground" />,
      },
      {
        name: "Prisma",
        icon: <SiPrisma className="h-12 w-12 text-foreground" />,
      },
    ],
  },
  {
    category: "Tools",
    items: [
      {
        name: "GitHub",
        icon: <SiGithub className="h-12 w-12 text-foreground" />,
      },

      {
        name: "Docker",
        icon: <SiDocker className="h-12 w-12 text-foreground" />,
      },
      {
        name: "GitHub Actions",
        icon: (
          <SiGithubactions className="h-12 w-12 text-foreground" />
        ),
      },
      {
        name: "Jenkins",
        icon: <SiJenkins className="h-12 w-12 text-foreground" />,
      },
      {
        name: "AWS",
        icon: <FaAws className="h-12 w-12 text-foreground" />,
      },

      {
        name: "Bash",
        icon: <SiGnubash className="h-12 w-12 text-foreground" />,
      },
    ],
  },
];

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
