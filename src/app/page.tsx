import CardDemo from "@/components/cards-demo-3";
import { Badge } from "@/components/ui/badge";
import { Timeline } from "@/components/ui/timeline";
import { GridBackgroundDemo } from "../components/GridBackgroundDemo";
import ContactSection from "../components/sections/ContactSection";
import FeaturedProjects from "../components/sections/FeaturedProjects";
import Footer from "../components/sections/Footer";
import Hero from "../components/sections/Hero";
import Tools from "../components/sections/Tools";
export default function Home() {
  const experiences1 = [
    {
      id: 1,
      title: "Senior Web Instructor",
      company: "Programming Hero",
      duration: "Jun 2024 - Present",
      description:
        "Guide and support the instructor team, ensuring alignment with the company’s vision and mission.Conducted deep-dive conceptual sessions on backend and frontend development, covering technologies like TypeScript, React, Next.js, Node.js, Express, GraphQL, PostgreSQL, MongoDB, Docker, CI/CD, and AWS.Help manage and streamline the teaching process, ensuring high-quality learning experiences for students.Guide and support the instructor team, ensuring alignment with the company’s vision and mission. Conducted deep-dive conceptual sessions on backend and frontend development, covering technologies like TypeScript, React, Next.js, Node.js, Express, GraphQL, PostgreSQL, MongoDB, Docker, CI/CD, and AWS. Help manage and streamline the teaching process, ensuring high-quality learning experiences for students.",
    },
    {
      id: 2,
      title: "web instructor ",
      company: "Programming Hero",
      duration: "May 2023 - Jun 2024",
      description:
        "As a web instructor at Programming Hero, I am responsible for teaching and supporting students in a variety of web development technologies, including Typescript, Express, Mongoose, Rest API, Redux, React, RTK Query, Testing, GraphQL, Deployment, PostgreSQL, Next.js, Docker, CI/CD, VM, and AWS.,My day-to-day responsibilities include developing and delivering engaging and informative lessons, providing personalized feedback and support to students, and collaborating with my colleagues to continuously improve our curriculum and teaching methodologies.",
    },
  ];
  const experiences2 = [
    {
      id: 1,
      title: " Jr. Full Stack Web Developer",
      company: "ProCorp",
      duration: "Oct 2022 - May 2023",
      description:
        " As a Full Stack Developer at ProCorp, I develop web applicationsusing the MERN (MongoDB, Express.js, React, Node.js) stack. My responsibilities include:Collaborating with designers, project managers, and other developers to create scalable, maintainable,and performant applications Developing front-end user interfaces using React.js, Redux, HTML5, CSS3, and JavaScript Designing and implementing RESTful APIs using Node.js, Express.js, and MongoDB Writing clean, efficient, and reusable code that adheres to best practices and industry standards Ensuring the security, reliability, and availability of applications through testing,debugging, and monitoring Continuously learning and keeping up to date with the latest technologies and trends in Full StackDevelopment.",
    },
  ];
  const data = [
    {
      title: "May 2023  - Present",
      content: (
        <div>
          <div className="max-w-3xl mx-auto">
            {experiences1.map((experience, index) => (
              <div
                key={experience.id}
                className="mb-10 relative pl-8 before:content-[''] before:absolute before:left-0 before:top-2 before:w-3 before:h-3 before:bg-brand before:rounded-full before:ring-4 before:ring-brand/20 last:before:h-3"
              >
                {index !== experiences1.length - 0 && (
                  <div className="absolute left-1.5 top-5 w-[1px] h-[calc(100%-24px)] bg-border"></div>
                )}
                <div>
                  <Badge className="mb-2 ">{experience.duration}</Badge>
                  <h3 className="text-xl font-bold">{experience.title}</h3>
                  <p className="text-brand font-medium mb-2">
                    {experience.company}
                  </p>
                  <p className="text-muted-foreground">
                    {experience.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Oct 2022 - May 2023",
      content: (
        <div>
          <div className="max-w-3xl mx-auto">
            {experiences2.map((experience, index) => (
              <div
                key={experience.id}
                className="mb-10 relative pl-8 before:content-[''] before:absolute before:left-0 before:top-2 before:w-3 before:h-3 before:bg-brand before:rounded-full before:ring-4 before:ring-brand/20 last:before:h-3"
              >
                {index !== experiences1.length - 0 && (
                  <div className="absolute left-1.5 top-5 w-[1px] h-[calc(100%-24px)] bg-border"></div>
                )}
                <div>
                  <Badge className="mb-2 ">{experience.duration}</Badge>
                  <h3 className="text-xl font-bold">{experience.title}</h3>
                  <p className="text-brand font-medium mb-2">
                    {experience.company}
                  </p>
                  <p className="text-muted-foreground">
                    {experience.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="">
      <Hero></Hero>
      <GridBackgroundDemo>
        <FeaturedProjects></FeaturedProjects>
      </GridBackgroundDemo>

      <div
        className="relative w-full overflow-clip px-4 lg:px-0"
        id="experience"
      >
        <Timeline data={data} />
      </div>

      <Tools></Tools>
  
      <ContactSection></ContactSection>

      <Footer></Footer>
    </div>
  );
}
