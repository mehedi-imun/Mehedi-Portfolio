// app/components/Tools.tsx or wherever appropriate

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
        icon: <SiFramer className="h-12 w-12 text-black dark:text-white" />,
      },
      {
        name: "Typescript",
        icon: <SiTypescript className="h-12 w-12 text-black dark:text-white" />,
      },
    ],
  },
  {
    category: "Backend",
    items: [
      {
        name: "Node.js",
        icon: <SiNodedotjs className="h-12 w-12 text-black dark:text-white" />,
      },
      {
        name: "Express",
        icon: <SiExpress className="h-12 w-12 text-black dark:text-white" />,
      },
      {
        name: "Go",
        icon: <SiGo className="h-12 w-12 text-black dark:text-white" />,
      },
      {
        name: "MongoDB",
        icon: <SiMongodb className="h-12 w-12 text-black dark:text-white" />,
      },
      {
        name: "PostgreSQL",
        icon: <SiPostgresql className="h-12 w-12 text-black dark:text-white" />,
      },
      {
        name: "Prisma",
        icon: <SiPrisma className="h-12 w-12 text-black dark:text-white" />,
      },
    ],
  },
  {
    category: "Tools",
    items: [
      {
        name: "GitHub",
        icon: <SiGithub className="h-12 w-12 text-black dark:text-white" />,
      },

      {
        name: "Docker",
        icon: <SiDocker className="h-12 w-12 text-black dark:text-white" />,
      },
      {
        name: "GitHub Actions",
        icon: (
          <SiGithubactions className="h-12 w-12 text-black dark:text-white" />
        ),
      },
      {
        name: "Jenkins",
        icon: <SiJenkins className="h-12 w-12 text-black dark:text-white" />,
      },
      {
        name: "AWS",
        icon: <FaAws className="h-12 w-12 text-black dark:text-white" />,
      },

      {
        name: "Bash",
        icon: <SiGnubash className="h-12 w-12 text-black dark:text-white" />,
      },
    ],
  },
];

export default function Tools() {
  return (
    <section className=" max-w-7xl mx-auto px-4 lg:px-0 py-20" id="tools">
      <div className="">
        <h2 className="text-lg md:text-4xl mb-4 text-black dark:text-white max-w-4xl">Tools & Technologies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <CardDemo tools={tools}></CardDemo>
        </div>
      </div>
    </section>
  );
}
