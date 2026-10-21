"use client";

import { useEffect, useRef, type ReactNode } from "react";

function phase(progress: number, start: number, end: number) {
  const value = Math.min(1, Math.max(0, (progress - start) / (end - start)));
  return value * value * (3 - 2 * value);
}

export function HeroVisual({ children }: { children: ReactNode }) {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = track.current;
    if (!node) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let relevant = true;

    const update = () => {
      frame = 0;
      const stage = node.firstElementChild as HTMLElement | null;
      if (!stage) return;
      const bounds = node.getBoundingClientRect();
      const top = Number.parseFloat(getComputedStyle(stage).top) || 0;
      const travel = node.offsetHeight - stage.offsetHeight;
      const progress =
        preference.matches || travel <= 0
          ? 0
          : Math.min(1, Math.max(0, (top - bounds.top) / travel));
      const reveal = phase(progress, 0.64, 0.8);
      node.style.setProperty("--scene-progress", String(progress));
      node.style.setProperty(
        "--intro-opacity",
        String(1 - phase(progress, 0.06, 0.24)),
      );
      node.style.setProperty(
        "--intro-shift",
        -phase(progress, 0.06, 0.24) * 32 + "px",
      );
      node.style.setProperty(
        "--art-scale",
        String(1 + phase(progress, 0.08, 0.58) * 0.06),
      );
      node.style.setProperty(
        "--art-shift",
        -phase(progress, 0.1, 0.6) * 5 + "%",
      );
      node.style.setProperty(
        "--art-opacity",
        String(1 - phase(progress, 0.54, 0.76) * 0.88),
      );
      node.style.setProperty("--story-opacity", String(reveal));
      node.style.setProperty("--story-shift", (1 - reveal) * 36 + "px");
      node.dispatchEvent(new CustomEvent("signal-progress", { detail: progress }));
    };
    const schedule = () => {
      if (relevant && !frame) frame = requestAnimationFrame(update);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        relevant = entry.isIntersecting;
        if (relevant) schedule();
      },
      { rootMargin: "120px" },
    );
    observer.observe(node);
    const onPreferenceChange = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      update();
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("pageshow", schedule);
    preference.addEventListener("change", onPreferenceChange);
    update();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pageshow", schedule);
      preference.removeEventListener("change", onPreferenceChange);
    };
  }, []);

  return (
    <div ref={track} className="hero-scroll-track">
      <div className="hero-stage">{children}</div>
    </div>
  );
}
