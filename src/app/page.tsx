import Preloader from "@/components/home/Preloader";
import Hero from "@/components/home/Hero";
import Manifesto from "@/components/home/Manifesto";
import Marquee from "@/components/home/Marquee";
import Collection from "@/components/home/Collection";
import DayAtHome from "@/components/home/DayAtHome";
import Numbers from "@/components/home/Numbers";
import Values from "@/components/home/Values";
import Build from "@/components/home/Build";
import Visit from "@/components/home/Visit";
import { getAllDesigns, getFeaturedDesigns, getSeries } from "@/lib/designs";

// Section order matters: pinned sections (Hero, Collection, Build) register their
// scroll triggers in page order so everything below them measures correctly.
export default function HomePage() {
  return (
    <main>
      <Preloader />
      <Hero designCount={getAllDesigns().length} />
      <Manifesto />
      <Marquee />
      <Collection designs={getFeaturedDesigns()} series={getSeries()} total={getAllDesigns().length} />
      <DayAtHome />
      <Numbers />
      <Values />
      <Build />
      <Visit />
    </main>
  );
}
