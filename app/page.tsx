"use client";

import Navigation from "@/components/ui/Navigation";
import Hero from "@/components/home/Hero";
import WhyIBuild from "@/components/home/WhyIBuild";
import ProjectsHighlight from "@/components/home/ProjectsHighlight";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <ProjectsHighlight />
      <WhyIBuild />
    </main>
  );
}
