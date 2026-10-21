"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "section" | "article";
};

export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: RevealProps) {
  const element = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  useLayoutEffect(() => {
    const node = element.current;
    if (!node || !("IntersectionObserver" in window) || !node.animate) return;
    const preference = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    let animation: Animation | undefined;
    const prefersReducedMotion = () => preference?.matches ?? reducedMotion;
    const show = () => {
      animation?.cancel();
      animation = undefined;
    };
    const prepare = () => {
      if (prefersReducedMotion() || node.contains(document.activeElement)) {
        show();
        return;
      }
      if (animation?.playState === "paused") return;
      show();
      const entrance = node.animate(
        [
          { opacity: 0, transform: "translateY(16px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: 600,
          delay: delay * 1000,
          easing: "cubic-bezier(.22,1,.36,1)",
          fill: "both",
        },
      );
      entrance.pause();
      entrance.currentTime = 0;
      entrance.onfinish = () => {
        if (animation === entrance) show();
      };
      animation = entrance;
    };
    const isOffscreen = (bounds: DOMRectReadOnly) =>
      bounds.top >= window.innerHeight || bounds.bottom <= 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (prefersReducedMotion()) return;
        if (node.contains(document.activeElement)) {
          show();
        } else if (entry.isIntersecting) {
          animation?.play();
        } else if (isOffscreen(entry.boundingClientRect)) {
          prepare();
        }
      },
      { threshold: 0 },
    );
    const synchronize = () => {
      observer.disconnect();
      show();
      if (prefersReducedMotion()) return;
      // Hydrated content already in view must never disappear to begin an entrance.
      if (isOffscreen(node.getBoundingClientRect())) prepare();
      observer.observe(node);
    };
    synchronize();
    // The installed Motion hook snapshots its initial value; native changes stay live.
    preference?.addEventListener("change", synchronize);
    node.addEventListener("focusin", show);
    return () => {
      observer.disconnect();
      preference?.removeEventListener("change", synchronize);
      node.removeEventListener("focusin", show);
      show();
    };
  }, [delay, reducedMotion]);
  const Component = as;
  return (
    <Component
      ref={(node: HTMLElement | null) => {
        element.current = node;
      }}
      className={className}
    >
      {children}
    </Component>
  );
}
