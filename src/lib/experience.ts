export interface Experience {
  id: number;
  title: string;
  company: string;
  duration: string;
  /** ISO start date, used for JSON-LD and sorting. */
  startDate: string;
  /** ISO end date, omitted while the role is current. */
  endDate?: string;
  description: string;
}

export interface ExperienceGroup {
  title: string;
  items: Experience[];
}

export const experienceGroups: ExperienceGroup[] = [
  {
    title: "May 2023 - Present",
    items: [
      {
        id: 1,
        title: "Full Stack Developer",
        company: "Programming Hero",
        duration: "Jun 2026 - Present",
        startDate: "2026-06-01",
        description:
          "Built an AI-native ingestion engine using SHA-256 deduplication and two-band semantic cosine matching with LLM judge fallbacks. Developed a multi-platform content generation pipeline using brand-voice RAG retrieval and few-shot conditioning for sub-10s outputs. Implemented decay-aware trend ranking algorithms and background cron schedulers.",
      },
      {
        id: 2,
        title: "Senior Web Instructor",
        company: "Programming Hero",
        duration: "Jun 2024 - Jun 2026",
        startDate: "2024-06-01",
        endDate: "2026-06-01",
        description:
          "Guided and supported the instructor team, ensuring alignment with the company's vision and mission. Conducted deep-dive conceptual sessions on backend and frontend development covering TypeScript, React, Next.js, Node.js, Express, GraphQL, PostgreSQL, MongoDB, Docker, CI/CD and AWS. Managed and streamlined the teaching process to ensure high-quality learning experiences for students.",
      },
      {
        id: 3,
        title: "Web Instructor",
        company: "Programming Hero",
        duration: "May 2023 - Jun 2024",
        startDate: "2023-05-01",
        endDate: "2024-06-01",
        description:
          "Taught and supported students across a range of web development technologies including TypeScript, Express, Mongoose, REST APIs, Redux, React, RTK Query, testing, GraphQL, deployment, PostgreSQL, Next.js, Docker, CI/CD, VMs and AWS. Developed and delivered engaging lessons, provided personalised feedback, and collaborated with colleagues to continuously improve the curriculum and teaching methodology.",
      },
    ],
  },
  {
    title: "Oct 2022 - May 2023",
    items: [
      {
        id: 4,
        title: "Jr. Full Stack Web Developer",
        company: "ProCorp",
        duration: "Oct 2022 - May 2023",
        startDate: "2022-10-01",
        endDate: "2023-05-01",
        description:
          "Developed web applications on the MERN stack. Collaborated with designers, project managers and developers to build scalable, maintainable and performant applications. Built front-end interfaces with React and Redux, designed RESTful APIs with Node.js, Express and MongoDB, and ensured reliability through testing, debugging and monitoring.",
      },
    ],
  },
];

export const allExperience: Experience[] = experienceGroups.flatMap((group) => group.items);
