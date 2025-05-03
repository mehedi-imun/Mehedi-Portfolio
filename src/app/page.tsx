import { Timeline } from "@/components/ui/timeline";
import { GridBackgroundDemo } from "../components/GridBackgroundDemo";
import ContactSection from "../components/sections/ContactSection";
import FeaturedProjects from "../components/sections/FeaturedProjects";
import Footer from "../components/sections/Footer";
import Hero from "../components/sections/Hero";
import Tools from "../components/sections/Tools";

export default function Home() {
  const data = [
    {
      title: "2025 - Present",
      content: (
        <div>
          <div>
            <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
              Senior Frontend Developer
            </p>
            <p className="text-primary font-medium mb-2">Programming Hero</p>
            <p className="text-muted-foreground">
              Developing and maintaining high-quality web applications using
              Next.js and React. Leading a team of 5 developers and implementing
              modern frontend architecture. 2018 - 2020
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://assets.aceternity.com/features-section.png"
              alt="feature template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
            <img
              src="https://assets.aceternity.com/pro/bento-grids.png"
              alt="bento template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Early 2023",
      content: (
        <div>
          <div>
            <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
              Senior Frontend Developer
            </p>
            <p className="text-primary font-medium mb-2">Programming Hero</p>
            <p className="text-muted-foreground">
              Developing and maintaining high-quality web applications using
              Next.js and React. Leading a team of 5 developers and implementing
              modern frontend architecture. 2018 - 2020
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://assets.aceternity.com/features-section.png"
              alt="feature template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
            <img
              src="https://assets.aceternity.com/pro/bento-grids.png"
              alt="bento template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
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

      <div className="relative w-full overflow-clip px-4 lg:px-0" id="experience">
        <Timeline data={data} />
      </div>
      <Tools></Tools>
      <ContactSection></ContactSection>
      <Footer></Footer>
    </div>
  );
}
