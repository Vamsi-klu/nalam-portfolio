/**
 * Decorative canvas: an Extract -> Transform -> Serve data pipeline with particles
 * streaming through it.
 *
 * A visual metaphor for the site's subject matter — dashed guide rails, a node per
 * stage, arrows between them, and packets of data flowing left to right and scattering
 * away from the cursor.
 *
 * ## Currently mounted nowhere
 *
 * This component is complete and working, but `app/page.tsx` doesn't render it. That's a
 * known state, not a bug. To use it, drop it into a section as an absolutely-positioned
 * background layer — it sizes itself to its parent via ResizeObserver, so the parent
 * needs `position: relative` and a real height.
 *
 * ## Canvas conventions
 *
 * Per-frame state lives in refs, never state, so the animation loop never triggers a
 * React render. DPR is capped at 2. The effect's cleanup cancels the frame and removes
 * every listener — an uncancelled rAF loop keeps running after unmount.
 *
 * @see docs/ARCHITECTURE.md
 */

"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Canvas draws outside the CSS cascade and can't read custom properties, so the accent
 * is duplicated here from `--accent` in globals.css. Changing the theme accent means
 * changing this too (and the RGB triple in AsciiPortrait).
 */
const ACCENT = "#00c7b7";
const STAGES = ["Extract", "Transform", "Serve"] as const;
/** Pointer influence radius, in CSS pixels. */
const REPEL_RADIUS = 90;
const REPEL_STRENGTH = 0.55;
/** Particle density reference, scaled by actual canvas area at runtime. */
const PARTICLE_COUNT_BASE = 48;

type Particle = {
  x: number;
  y: number;
  /** Horizontal speed. Varies per particle so the stream never looks like a marching grid. */
  vx: number;
  /** The lane this particle drifts back toward after being pushed off course. */
  baseY: number;
  radius: number;
  alpha: number;
  /** Length of the gradient tail behind the particle, suggesting motion blur. */
  trail: number;
};

type PipelineParticlesProps = {
  className?: string;
};

/** Guarded for SSR — this module is client-only, but the check keeps it safe to import. */
function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Seeds one particle with randomized lane, speed, size, opacity, and trail length.
 *
 * Lanes are confined to the middle ~44% of the height (28%-72%) so the stream reads as
 * flowing along the pipeline band rather than filling the whole canvas. Starting `x` is
 * random across the full width so the field looks already-running on the first frame
 * instead of pouring in from the left edge.
 */
function createParticle(width: number, height: number): Particle {
  const lane = 0.28 + Math.random() * 0.44;
  return {
    x: Math.random() * width,
    y: height * lane,
    baseY: height * lane,
    vx: 0.55 + Math.random() * 1.1,
    radius: 1.2 + Math.random() * 1.8,
    alpha: 0.35 + Math.random() * 0.55,
    trail: 8 + Math.random() * 18,
  };
}

export function PipelineParticles({ className }: PipelineParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles: Particle[] = [];
    let running = !prefersReducedMotion();

    /** Re-derives dimensions from the parent and repopulates the particle field. */
    const resize = () => {
      // Measure the parent, not the canvas: the canvas is sized *by* this function, so
      // measuring itself would feed back on its own output.
      const parent = canvas.parentElement;
      const rect = parent?.getBoundingClientRect() ?? canvas.getBoundingClientRect();
      // Cap DPR at 2 — beyond that the fill-rate cost climbs with no visible gain.
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      // Backing store in device pixels, CSS box in layout pixels, then scale the context
      // so all drawing code below can work in CSS pixels and stay crisp on retina.
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Scale count with area against a 520x360 reference so density stays constant
      // across sizes, with a floor so a small canvas still reads as a stream.
      const count = Math.max(
        28,
        Math.floor((PARTICLE_COUNT_BASE * width * height) / (520 * 360)),
      );
      particles = Array.from({ length: count }, () =>
        createParticle(width, height),
      );
    };

    /**
     * Draws the static pipeline diagram: dashed rails, stage nodes, connecting arrows,
     * and labels. Redrawn every frame (canvas is cleared each tick), and also drawn on
     * its own when motion is disabled, so the diagram still appears without the stream.
     */
    const drawStageGuides = () => {
      const padX = width * 0.08;
      const usable = width - padX * 2;
      const bandY = height * 0.5;
      const bandH = height * 0.42;

      ctx.save();
      ctx.strokeStyle = "rgba(0, 199, 183, 0.12)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 8]);
      ctx.beginPath();
      ctx.moveTo(padX, bandY - bandH / 2);
      ctx.lineTo(width - padX, bandY - bandH / 2);
      ctx.moveTo(padX, bandY + bandH / 2);
      ctx.lineTo(width - padX, bandY + bandH / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      STAGES.forEach((label, i) => {
        // Center each node in its equal share of the usable width: the +0.5 puts it at
        // the midpoint of its slot rather than on the boundary.
        const x = padX + (usable * (i + 0.5)) / STAGES.length;
        const nodeR = 10;

        ctx.beginPath();
        ctx.arc(x, bandY, nodeR, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 199, 183, 0.08)";
        ctx.fill();
        ctx.strokeStyle = "rgba(0, 199, 183, 0.45)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x, bandY, 3, 0, Math.PI * 2);
        ctx.fillStyle = ACCENT;
        ctx.fill();

        // Connector to the next stage; skipped after the last node. Both ends are inset
        // by the node radius plus a few pixels so the line doesn't touch the circles.
        if (i < STAGES.length - 1) {
          const nextX =
            padX + (usable * (i + 1.5)) / STAGES.length;
          ctx.strokeStyle = "rgba(0, 199, 183, 0.25)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x + nodeR + 4, bandY);
          ctx.lineTo(nextX - nodeR - 4, bandY);
          ctx.stroke();

          // arrow head
          ctx.beginPath();
          ctx.moveTo(nextX - nodeR - 4, bandY);
          ctx.lineTo(nextX - nodeR - 10, bandY - 4);
          ctx.lineTo(nextX - nodeR - 10, bandY + 4);
          ctx.closePath();
          ctx.fillStyle = "rgba(0, 199, 183, 0.35)";
          ctx.fill();
        }

        ctx.font =
          "500 11px var(--font-geist-mono), ui-monospace, monospace";
        ctx.fillStyle = "rgba(168, 178, 209, 0.75)";
        ctx.textAlign = "center";
        ctx.fillText(label, x, bandY + nodeR + 18);
      });

      ctx.restore();
    };

    /** One animation frame: clear, redraw the diagram, then advance and draw particles. */
    const step = () => {
      if (!running) return;

      ctx.clearRect(0, 0, width, height);
      drawStageGuides();

      const mouse = mouseRef.current;

      for (const p of particles) {
        p.x += p.vx;

        // Ease back toward the assigned lane. The 2% pull is gentle enough that a
        // cursor push produces a visible arc rather than an instant snap back.
        p.y += (p.baseY - p.y) * 0.02;

        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          // The `dist > 0.01` guard avoids dividing by ~zero when the pointer lands
          // exactly on a particle, which would fling it off screen.
          if (dist < REPEL_RADIUS && dist > 0.01) {
            // Force falls off linearly to zero at the radius edge, so particles drift
            // out of the way rather than popping at the boundary.
            const force =
              ((REPEL_RADIUS - dist) / REPEL_RADIUS) * REPEL_STRENGTH;
            // Position is displaced directly rather than accumulated into velocity, so
            // the effect is a local bulge that heals as soon as the cursor moves on.
            p.x += (dx / dist) * force * 6;
            p.y += (dy / dist) * force * 6;
          }
        }

        // Wrap to the left edge once fully off-screen, re-randomizing the lane slightly
        // (clamped to the band) so the stream doesn't settle into fixed rows over time.
        if (p.x > width + 20) {
          p.x = -20;
          p.y = p.baseY + (Math.random() - 0.5) * height * 0.08;
          p.baseY = Math.min(
            height * 0.72,
            Math.max(height * 0.28, p.y),
          );
        }

        // Trail: a gradient stroke fading from transparent at the tail to the particle's
        // own alpha at the head, which reads as motion blur without per-frame history.
        const gradient = ctx.createLinearGradient(
          p.x - p.trail,
          p.y,
          p.x,
          p.y,
        );
        gradient.addColorStop(0, "rgba(0, 199, 183, 0)");
        gradient.addColorStop(1, `rgba(0, 199, 183, ${p.alpha * 0.45})`);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = p.radius * 0.9;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(p.x - p.trail, p.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 199, 183, ${p.alpha})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(step);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const onPointerLeave = () => {
      mouseRef.current.active = false;
    };

    // Reduced motion. CSS and Framer Motion can't reach canvas drawing, so this queries
    // the media list directly and subscribes to changes, letting the animation start and
    // stop live when the OS setting is toggled. Stopped state still paints the static
    // diagram, so the component degrades to an illustration rather than a blank box.
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = () => {
      running = !media.matches;
      cancelAnimationFrame(raf);
      if (running) {
        raf = requestAnimationFrame(step);
      } else {
        ctx.clearRect(0, 0, width, height);
        drawStageGuides();
      }
    };

    resize();
    // Doubles as the initial start: kicks off the loop, or paints the static frame.
    onMotionChange();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement ?? canvas);

    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);
    media.addEventListener("change", onMotionChange);
    window.addEventListener("resize", resize);

    // Full teardown. `running = false` stops any in-flight step from scheduling another
    // frame, then everything registered above is unwound. Missing any of these leaves a
    // loop or listener alive after unmount.
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      media.removeEventListener("change", onMotionChange);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    // Purely decorative, so hidden from assistive tech entirely — unlike AsciiPortrait,
    // which conveys content and carries role="img" plus a label.
    <canvas
      ref={canvasRef}
      className={cn("block h-full w-full", className)}
      aria-hidden
    />
  );
}
