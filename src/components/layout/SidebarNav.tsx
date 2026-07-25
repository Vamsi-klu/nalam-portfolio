"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { nav } from "@/content/site";
import { cn } from "@/lib/utils";

export function SidebarNav() {
  const [active, setActive] = useState<string>(nav[0].id);
  const reduce = useReducedMotion();

  useEffect(() => {
    const ids = nav.map((item) => item.id);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
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
