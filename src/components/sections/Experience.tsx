/**
 * Employment history as a tabbed panel — company tabs beside a detail pane.
 *
 * Implements the full ARIA tabs pattern (`tablist` / `tab` / `tabpanel`, `aria-selected`,
 * `aria-controls`, `aria-labelledby`, and roving `tabIndex` so only the selected tab is
 * in the tab order). Preserve that wiring if you restructure the markup.
 *
 * Tabs stack horizontally with a bottom rule on mobile and flip to a vertical list with
 * a left rule at `md`.
 */

"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { experience } from "@/content/site";
import { cn } from "@/lib/utils";

export function Experience() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const job = experience[active];

  return (
    <section id="experience" className="section">
      <Reveal>
        <h2 className="section-title">where I&apos;ve worked</h2>
      </Reveal>

      <Reveal delay={0.1}>
        {/* `min-h` reserves room for the tallest panel so switching tabs doesn't make
            the page below jump. */}
        <div className="flex min-h-[340px] flex-col gap-6 md:flex-row md:gap-10">
          {/* Mobile: horizontal scroll tabs */}
          <div
            role="tablist"
            aria-label="Companies"
            className="relative flex shrink-0 overflow-x-auto border-b border-lightest-navy md:w-40 md:flex-col md:overflow-visible md:border-b-0 md:border-l"
          >
            {experience.map((item, i) => {
              const selected = i === active;
              return (
                <button
                  key={item.company}
                  role="tab"
                  type="button"
                  id={`exp-tab-${i}`}
                  aria-selected={selected}
                  aria-controls={`exp-panel-${i}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  className={cn(
                    "relative whitespace-nowrap px-5 py-3 text-left font-mono text-sm transition-colors md:w-full",
                    selected
                      ? "bg-[var(--accent-tint)] text-accent"
                      : "text-slate hover:bg-light-navy/50 hover:text-light-slate",
                  )}
                >
                  {/* The tab strip is a fixed md:w-40, so long company names need a
                      short label. Add a case here rather than letting a tab overflow. */}
                  {item.company === "University at Buffalo" ? "UB" : item.company}
                  {selected && (
                    // A shared `layoutId` makes Framer Motion slide this bar between
                    // tabs instead of cross-fading it. Dropping the id under reduced
                    // motion turns that into an instant jump.
                    <motion.span
                      layoutId={reduce ? undefined : "exp-indicator"}
                      className="absolute bottom-0 left-0 h-0.5 w-full bg-accent md:bottom-auto md:left-0 md:top-0 md:h-full md:w-0.5"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Content panel */}
          <div className="min-w-0 flex-1">
            {/* `mode="wait"` holds the incoming panel until the outgoing one finishes,
                so the two never overlap mid-transition. Keying on company is what tells
                AnimatePresence a swap happened. */}
            <AnimatePresence mode="wait">
              <motion.div
                key={job.company}
                role="tabpanel"
                id={`exp-panel-${active}`}
                aria-labelledby={`exp-tab-${active}`}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <h3 className="mb-1 text-xl font-semibold text-lightest-slate">
                  {job.role}{" "}
                  <span className="text-accent">@ {job.company}</span>
                </h3>
                <p className="mb-6 font-mono text-xs text-slate">{job.period}</p>
                <ul className="space-y-3">
                  {job.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="skill-bullet text-[0.95rem] leading-relaxed text-slate"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
