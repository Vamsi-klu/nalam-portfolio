/**
 * The only route in the app: `/`.
 *
 * Pure composition — no state, no data fetching, no props. A Server Component, so all
 * of this markup is prerendered into static HTML at build time; the `next build` output
 * confirms it as `○ (Static)`.
 *
 * The section order below is the visual order of the page, and it must stay in sync with
 * the `nav` array in `src/content/site.ts`, which drives both navigations and derives
 * its `01.` / `02.` numbering from array position.
 *
 * ## Adding a section
 *
 * 1. Create the component in `src/components/sections/`.
 * 2. Give its root `<section>` an `id` and `className="section"`.
 * 3. Put the copy in `src/content/site.ts`.
 * 4. Render it here, in the right position.
 * 5. Add a matching `{ id, label }` to `nav` — this is the step that gets missed, and
 *    the id must match exactly or the anchor and scroll-spy silently break.
 *
 * Sections are imported directly rather than through `sections/index.ts`; that barrel
 * only re-exports half of them and nothing uses it.
 *
 * @see docs/ARCHITECTURE.md
 */

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
      {/* Fixed chrome, rendered outside <main> so it isn't part of the main landmark. */}
      <NavBar />
      <SidebarNav />
      {/* `flex-1` claims the leftover height from the body flex column, pushing the
          footer to the bottom when the page is shorter than the viewport. */}
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
