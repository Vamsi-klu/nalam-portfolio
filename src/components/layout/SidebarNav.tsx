/**
 * Vertical section rail on large screens, with scroll-spy highlighting.
 *
 * Shares the `nav` array with `NavBar`. Hidden below `lg`, where `NavBar`'s overlay menu
 * covers the same job.
 *
 * @see docs/ARCHITECTURE.md
 */

"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { nav } from "@/content/site";
import { cn } from "@/lib/utils";

export function SidebarNav() {
  const [active, setActive] = useState<string>(nav[0].id);
  const reduce = useReducedMotion();

  useEffect(() => {
    // Only observe sections that actually exist. A `nav` entry whose id doesn't match a
    // rendered section is silently skipped here — which is exactly why a typo in `nav`
    // produces no error, just a link that highlights nothing.
    const ids = nav.map((item) => item.id);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Several sections can straddle the band at once, so pick the one occupying most
        // of it rather than whichever entry happened to fire last.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActive(visible[0].target.id);
        }
      },
      {
        // Shrink the viewport to a band roughly in its middle fifth, so a section
        // becomes "active" when it reaches reading position rather than the moment its
        // top edge appears. Multiple thresholds keep intersectionRatio updating as
        // sections cross, instead of only firing at full entry and exit.
        rootMargin: "-35% 0px -45% 0px",
        threshold: [0, 0.25, 0.5, 1],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    // The aside itself is pointer-transparent so its empty vertical strip never
    // intercepts clicks meant for page content; the inner <nav> re-enables events for
    // the links themselves.
    <motion.aside
      className="pointer-events-none fixed top-1/2 left-6 z-40 hidden -translate-y-1/2 lg:block xl:left-10"
      initial={reduce ? false : { opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
      aria-label="Section navigation"
    >
      <nav className="pointer-events-auto flex flex-col gap-3">
        {nav.map((item) => {
          const isActive = active === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={cn(
                "group flex items-center gap-1 font-mono text-[12px] tracking-wide transition-colors",
                isActive
                  ? "text-accent"
                  : "text-slate hover:text-lightest-slate"
              )}
              aria-current={isActive ? "true" : undefined}
            >
              <span
                className={cn(
                  "transition-colors",
                  isActive ? "text-accent" : "text-accent/60 group-hover:text-accent"
                )}
              >
                /
              </span>
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>
    </motion.aside>
  );
}
