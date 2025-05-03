import Header from "./components/Header";
import FeaturedProjects from "./components/sections/FeaturedProjects";
import Hero from "./components/sections/Hero";

export default function Home() {
  return (
    <div>
      <Header></Header>
      <Hero></Hero>
      <FeaturedProjects></FeaturedProjects>
    </div>
  );
}
