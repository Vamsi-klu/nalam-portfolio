import { NavBar } from "@/components/layout/NavBar";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Impact } from "@/components/sections/Impact";
import { Experience } from "@/components/sections/Experience";
import { Work } from "@/components/sections/Work";
import { Oss } from "@/components/sections/Oss";
import { Builds } from "@/components/sections/Builds";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <NavBar />
      <SidebarNav />
      <main className="flex-1">
        <Hero />
        <About />
        <Impact />
        <Experience />
        <Work />
        <Oss />
        <Builds />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
