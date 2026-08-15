/**
 * Shared scroll-entrance wrapper — a 20px rise and fade the first time an element
 * scrolls into view.
 *
 * This exists so that sections can stay Server Components. `About`, `Work`, `Oss`,
 * `Builds`, and `Contact` all render on the server and pass their already-rendered
 * markup into this client wrapper as `children`, so the client bundle carries only the
 * animation, not the content. Prefer that shape over marking a whole section
 * `"use client"` just to animate it.
 *
 * Use this instead of writing Framer Motion props inline, so entrance timing stays
 * consistent across the site.
 *
 * @see docs/ARCHITECTURE.md
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /**
   * Seconds to wait before animating. Stagger a list by scaling this with the index,
   * e.g. `delay={0.06 * (i + 1)}`.
   */
  delay?: number;
  /**
   * Element to render. Exists so the wrapper doesn't break list or landmark semantics —
   * a `<Reveal>` inside a `<ul>` should be an `li`, not a `div`.
   */
  as?: "div" | "li" | "section" | "article";
};

export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();
  const Component = motion[as];

  // Reduced motion: render the final state immediately with no animation machinery.
  //
  // Known wart — this ignores `as`, so a `<Reveal as="li">` inside a `<ul>` becomes a
  // `<div>` child of `<ul>`. It renders fine but is technically invalid HTML. Threading
  // `as` through here would fix it.
  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    // `once: true` means the animation never replays on scroll-back, which keeps long
    // scrolls calm. The negative viewport margin delays the trigger until the element is
    // ~40px past the edge, so it isn't already half-visible when it starts.
    <Component
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, ease: "easeOut", delay }}
    >
      {children}
    </Component>
  );
}
