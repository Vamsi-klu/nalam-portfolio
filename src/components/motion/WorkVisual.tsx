"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function WorkVisual({ children }: { children: ReactNode }) {
  const media = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = media.current;
    if (!node) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let visible = false;

    const update = () => {
      frame = 0;
      const bounds = node.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (innerHeight - bounds.top) / (innerHeight + bounds.height)));
      const scale = preference.matches ? 1 : 1.12 - progress * 0.1;
      const overfill = Math.max(0, bounds.height * (scale - 1) / 2 - 1);
      const shift = Math.max(-overfill, Math.min(overfill, (0.5 - progress) * 20));
      node.style.setProperty("--work-image-scale", String(scale));
      node.style.setProperty("--work-image-shift", `${shift}px`);
    };
    const schedule = () => {
      if (visible && !document.hidden && !frame) frame = requestAnimationFrame(update);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
      else { cancelAnimationFrame(frame); frame = 0; }
    });
    observer.observe(node);
    const preferenceChange = () => { cancelAnimationFrame(frame); update(); };
    const visibilityChange = () => {
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
      else schedule();
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    preference.addEventListener("change", preferenceChange);
    document.addEventListener("visibilitychange", visibilityChange);
    update();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      preference.removeEventListener("change", preferenceChange);
      document.removeEventListener("visibilitychange", visibilityChange);
    };
  }, []);

  return <div ref={media} className="work-story-media">{children}</div>;
}
