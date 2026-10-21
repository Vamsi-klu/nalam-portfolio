"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function HeroVisual({ children }: { children: ReactNode }) {
  const element = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = element.current;
    if (!node) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const section = node.closest("section");
      if (!section) return;
      const bounds = section.getBoundingClientRect();
      const progress = preference.matches
        ? 0
        : Math.max(0, Math.min(1, -bounds.top / bounds.height));
      node.style.setProperty("--hero-progress", String(progress));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    preference.addEventListener("change", schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      preference.removeEventListener("change", schedule);
    };
  }, []);
  return (
    <div ref={element} className="hero-product" aria-hidden="true">
      {children}
    </div>
  );
}
