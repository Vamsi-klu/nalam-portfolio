/**
 * Landing section — the full-viewport introduction.
 *
 * The only section that doesn't use the shared `.section` class, because it's
 * `min-h-screen` and lays out as a two-column split (copy on the left, interactive ASCII
 * portrait on the right) rather than a centered content column.
 *
 * A Client Component for the typewriter effect and the staggered entrance.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { AsciiPortrait } from "@/components/canvas/AsciiPortrait";
import { site } from "@/content/site";

/**
 * Parent variant. Animating the container drives its children through Framer Motion's
 * variant propagation, so each child inherits the `show` state on a stagger instead of
 * needing its own delay.
 */
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  },
};

/** Child variant: rise and fade, on a sharp ease-out so the entrance settles quickly. */
const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      id="intro"
      className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-10 px-6 py-28 md:flex-row md:items-center md:gap-8 md:px-8 lg:gap-14"
    >
      {/* `initial={false}` under reduced motion skips the entrance entirely and mounts
          in the final state, rather than animating quickly. */}
      <motion.div
        className="relative z-10 max-w-xl flex-1"
        variants={container}
        initial={reduce ? false : "hidden"}
        animate="show"
      >
        <motion.p
          variants={item}
          className="mb-2 font-mono text-sm text-accent md:text-base"
        >
          Hi,
        </motion.p>

        <motion.h1
          variants={item}
          className="mb-3 text-4xl font-bold leading-tight tracking-tight text-lightest-slate sm:text-5xl md:text-6xl"
        >
          <span className="text-accent">
            {reduce ? (
              site.shortName
            ) : (
              <TypeAnimation
                sequence={[site.shortName]}
                wrapper="span"
                speed={40}
                repeat={0}
                cursor={false}
              />
            )}
          </span>{" "}
          <span className="text-lightest-slate">here.</span>
          {!reduce && <span className="intro-cursor" aria-hidden />}
        </motion.h1>

        <motion.h2
          variants={item}
          className="mb-4 text-2xl font-semibold text-slate sm:text-3xl md:text-4xl"
        >
          {site.title}
        </motion.h2>

        <motion.p
          variants={item}
          className="mb-3 min-h-[1.75rem] font-mono text-sm text-accent md:text-base"
        >
          {/* Reduced motion falls back to the first line, which is why `heroLines[0]`
              should be the strongest of the three. */}
          {reduce ? (
            site.heroLines[0]
          ) : (
            // TypeAnimation takes a flat alternating sequence of [text, pauseMs, ...],
            // hence the flatMap: each line is followed by a 2.2s hold before the next.
            // `min-h` on the parent reserves the line box so the layout doesn't jump as
            // lines of different lengths type in and out.
            <TypeAnimation
              sequence={site.heroLines.flatMap((line) => [line, 2200])}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              cursor={false}
            />
          )}
        </motion.p>

        <motion.p
          variants={item}
          className="mb-10 max-w-md text-base leading-relaxed text-light-slate md:text-lg"
        >
          {site.tagline}
        </motion.p>

        <motion.div
          variants={item}
          className="flex flex-wrap items-center gap-3 sm:gap-4"
        >
          <a href="#work" className="btn-accent">
            View work
          </a>
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-accent"
          >
            GitHub
          </a>
          <a href="#contact" className="btn-ghost">
            Say hi →
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        className="relative mx-auto flex w-full max-w-[420px] flex-1 items-center justify-center md:mx-0"
        initial={reduce ? false : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
      >
        <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,199,183,0.12),transparent_65%)]" />
        <AsciiPortrait />
        <p className="pointer-events-none absolute -bottom-8 left-1/2 hidden -translate-x-1/2 font-mono text-[11px] text-slate/70 md:block">
          move cursor over portrait
        </p>
      </motion.div>
    </section>
  );
}
