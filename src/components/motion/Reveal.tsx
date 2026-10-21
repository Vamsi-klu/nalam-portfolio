"use client";

import { useEffect, useRef, type ReactNode } from "react";
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
  useEffect(() => {
    const node = element.current;
    if (!node || reducedMotion || !("IntersectionObserver" in window)) return;
    let animation: Animation | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        animation = node.animate(
          [
            { opacity: 0, transform: "translateY(16px)" },
            { opacity: 1, transform: "translateY(0)" },
          ],
          {
            duration: 600,
            delay: delay * 1000,
            easing: "cubic-bezier(.22,1,.36,1)",
            fill: "backwards",
          },
        );
        observer.disconnect();
      },
      { threshold: 0.08 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      animation?.cancel();
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
