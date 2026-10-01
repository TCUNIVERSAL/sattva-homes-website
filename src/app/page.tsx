import type { Metadata } from "next";
import HomeHero from "@/components/home/HomeHero";
import WhySattva from "@/components/home/WhySattva";
import HomeDesigns from "@/components/home/HomeDesigns";
import ProcessPreview from "@/components/home/ProcessPreview";
import Lifestyle from "@/components/home/Lifestyle";
import Numbers from "@/components/home/Numbers";
import Visit from "@/components/home/Visit";

export const metadata: Metadata = { alternates: { canonical: "/" } };

// Clarity first: who Sattva is and what it promises, then the homes, the process
// (in full on /how-we-build), local living, the track record and the display home.
export default function HomePage() {
  return (
    <main>
      <HomeHero />
      <WhySattva />
      <HomeDesigns />
      <ProcessPreview />
      <Lifestyle />
      <Numbers />
      <Visit />
    </main>
  );
}
