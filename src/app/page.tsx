import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Impact } from "@/components/sections/Impact";
import { Experience } from "@/components/sections/Experience";
import { Work } from "@/components/sections/Work";
import { Oss } from "@/components/sections/Oss";
import { Builds } from "@/components/sections/Builds";
import { Contact } from "@/components/sections/Contact";
import { editorial } from "@/content/site";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        {editorial.navigation.skip}
      </a>
      <NavBar />
      <main id="main">
        <Hero />
        <Impact />
        <Work />
        <Oss />
        <Builds />
        <About />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
