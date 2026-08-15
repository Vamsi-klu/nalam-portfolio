/**
 * Headline numbers, counting up as they scroll into view.
 *
 * This is a rendered section that is deliberately absent from the `nav` array, so it has
 * no nav link and the sidebar doesn't highlight while you scroll past it.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { site } from "@/content/site";

/** Rounds during the animation so intermediate frames don't show noisy decimals. */
function formatMetric(value: number, decimals: number): string {
  if (decimals > 0) return value.toFixed(decimals);
  return Math.round(value).toString();
}

/**
 * Animates 0 -> `value` on first scroll into view, then snaps to `display`.
 *
 * The two-value split is what allows a suffixed label: the animation needs a number to
 * interpolate (`value`), while the final rendering is a string (`display`, e.g. `100+`).
 * If the two disagree the number visibly jumps on the last frame.
 */
function CountUp({
  value,
  suffix,
  display,
}: {
  value: number;
  suffix: string;
  display: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  // `once: true` matches Reveal — the count never replays on scroll-back.
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const decimals = Number.isInteger(value) ? 0 : 1;
  const [text, setText] = useState(`0${suffix}`);

  useEffect(() => {
    if (reduce || !inView) return;

    const durationMs = 1400;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      // Cubic ease-out: fast at first, decelerating into the final value, which reads as
      // a counter settling rather than a linear ramp.
      const eased = 1 - Math.pow(1 - t, 3);
      if (t >= 1) {
        // Land on the authored string so suffixes like "+" appear exactly as written.
        setText(display);
        return;
      }
      setText(`${formatMetric(value * eased, decimals)}${suffix}`);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, value, suffix, display, decimals]);

  return (
    // `tabular-nums` fixes digit width so the surrounding layout doesn't shift while the
    // number changes on every frame.
    <span ref={ref} className="tabular-nums">
      {reduce ? display : text}
    </span>
  );
}

export function Impact() {
  return (
    <section id="impact" className="section">
      <Reveal>
        <h2 className="section-title">impact</h2>
      </Reveal>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {site.metrics.map((metric, i) => (
          <Reveal key={metric.label} delay={0.05 * i}>
            <article className="card-lift flex h-full flex-col rounded border border-lightest-navy bg-light-navy/30 p-5">
              <p className="mb-2 font-mono text-2xl font-semibold text-accent md:text-3xl">
                <CountUp
                  value={metric.value}
                  suffix={metric.suffix}
                  display={metric.display}
                />
              </p>
              <p className="text-xs leading-snug text-slate md:text-sm">
                {metric.label}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
