/**
 * The Hero portrait, rendered as a field of ASCII characters that assemble into the
 * photo and scatter under the cursor.
 *
 * Pipeline: draw `/profile.jpg` to an offscreen canvas -> sample its pixels on a grid ->
 * map each sample's brightness to a character -> animate those characters in from
 * scattered positions and hold them there with a spring.
 *
 * ## Constraints worth knowing before editing
 *
 * - **The source image can't go through the optimizer.** `getImageData` needs the
 *   unprocessed original, which is why `/profile.jpg` is referenced as a raw path and
 *   the fallback below uses a bare `<img>` with an eslint disable.
 * - **Replacing the photo changes the output.** The brightness ramp has only ten steps,
 *   so a high-contrast, centered, head-and-shoulders shot converts well and a busy or
 *   low-contrast one turns to mush.
 * - **Per-frame state lives in refs**, never state — the loop must not re-render React.
 * - **The reduced-motion branch is the source of the repo's one standing lint error**
 *   (`react-hooks/set-state-in-effect`). Fixing it means deriving the fallback during
 *   render, e.g. `useSyncExternalStore` over the media query, and should be its own
 *   change verified in both motion modes.
 *
 * @see docs/ARCHITECTURE.md
 * @see CONTRIBUTING.md#one-pre-existing-lint-error
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Brightness ramp, darkest to lightest. A space renders nothing, so dark regions of the
 * photo become empty canvas and the portrait reads as light-on-dark. Ten steps is the
 * whole tonal range available, which is why source contrast matters so much.
 */
const CHARS = " .:-=+*#%@".split("");
/**
 * The theme accent as an RGB triple rather than a hex string, so per-particle alpha can
 * be interpolated into `rgba(...)`. Duplicated from `--accent` in globals.css, which
 * canvas drawing can't read.
 */
const ACCENT = "0, 199, 183";
const IMAGE_SRC = "/profile.jpg";

/** A character mid-flight: current position and velocity, plus where it belongs. */
type Particle = {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  char: string;
  fontSize: number;
  /** Opacity derived from source brightness — the particle's resting opacity. */
  baseAlpha: number;
  /** Opacity this frame, after fade-in and shimmer are applied. */
  currentAlpha: number;
  /** Per-particle start offset in seconds, so the portrait assembles instead of snapping. */
  delay: number;
  /** Random phase offset, so the idle shimmer isn't synchronized across particles. */
  shimmer: number;
};

/** One sampled pixel. Cached and reused; cheap to keep, expensive to recompute. */
type RawParticle = {
  x: number;
  y: number;
  char: string;
  alpha: number;
};

/**
 * Canvas edge length for a given viewport width.
 *
 * Subtracts the surrounding page padding on small screens so the square never overflows,
 * and caps at 400px on desktop — past that the character grid gets sparse enough that
 * the likeness breaks down.
 */
function calcSize(width: number) {
  if (width <= 480) return Math.min(240, width - 48);
  if (width <= 768) return Math.min(300, width - 64);
  return 400;
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Converts the source photo into a grid of characters.
 *
 * The expensive step in this component — a full `getImageData` read plus a nested scan —
 * which is why results are cached per size by the caller and never recomputed for a size
 * already seen.
 */
function processImage(img: HTMLImageElement, targetSize: number): RawParticle[] {
  const offscreen = document.createElement("canvas");
  // `willReadFrequently` tells the browser to keep this surface in software memory
  // rather than on the GPU, since the one thing we do with it is read pixels back.
  const offCtx = offscreen.getContext("2d", { willReadFrequently: true });
  if (!offCtx) return [];

  offscreen.width = targetSize;
  offscreen.height = targetSize;

  // Inset the photo slightly so characters at the edge of the head aren't clipped by the
  // canvas bounds when they drift outward under the cursor.
  const scale = 0.88;
  const imgAspect = img.width / img.height;
  let drawHeight = targetSize * scale;
  let drawWidth = drawHeight * imgAspect;
  if (drawWidth > targetSize * scale) {
    drawWidth = targetSize * scale;
    drawHeight = drawWidth / imgAspect;
  }
  const offsetX = (targetSize - drawWidth) / 2;
  const offsetY = (targetSize - drawHeight) / 2;

  // Fill with the page background before drawing, so transparent regions of a PNG
  // sample as dark and drop out below rather than reading as bright.
  offCtx.fillStyle = "#0a192f";
  offCtx.fillRect(0, 0, targetSize, targetSize);
  offCtx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

  const { data } = offCtx.getImageData(0, 0, targetSize, targetSize);
  const isMobile = targetSize <= 280;
  const fontSize = isMobile ? 5 : 7;
  // Monospace glyphs are taller than they are wide, so sampling on a square grid would
  // stretch the portrait vertically. Stepping narrower horizontally than vertically
  // (0.7 vs 1.1) compensates and keeps the aspect ratio true.
  const colGap = fontSize * 0.7;
  const rowGap = fontSize * 1.1;
  const raw: RawParticle[] = [];

  for (let y = 0; y < targetSize; y += rowGap) {
    for (let x = 0; x < targetSize; x += colGap) {
      // getImageData returns a flat RGBA array: 4 bytes per pixel, row-major.
      const i = (Math.floor(y) * targetSize + Math.floor(x)) * 4;
      const a = data[i + 3];
      // Skip near-transparent pixels.
      if (a < 40) continue;

      // Unweighted RGB mean. Perceptual luminance weighting would be more accurate, but
      // a flat mean spreads midtones more evenly across a ten-step ramp, which matters
      // more than color fidelity for legibility here.
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (r + g + b) / (3 * 255);
      // Drop near-black pixels entirely rather than emitting a space, which keeps the
      // particle count (and so the per-frame cost) down.
      if (brightness < 0.06) continue;

      // `min` guards the exact-1.0 case, which would otherwise index past the ramp.
      const charIndex = Math.min(
        CHARS.length - 1,
        Math.floor(brightness * (CHARS.length - 1)),
      );
      raw.push({
        // Rounded to keep the cached payload small — sub-pixel precision is invisible
        // at a 5-7px glyph size.
        x: Number(x.toFixed(1)),
        y: Number(y.toFixed(1)),
        char: CHARS[charIndex],
        // Floor the opacity at 0.45 so even dim characters stay legible; brightness only
        // modulates the remaining range.
        alpha: Number((0.45 + brightness * 0.55).toFixed(2)),
      });
    }
  }
  return raw;
}

/**
 * Expands cached samples into animatable particles.
 *
 * Kept separate from {@link processImage} so a cache hit can rebuild the animation state
 * — scatter positions, delays, shimmer phases are all re-randomized — without redoing
 * the pixel work.
 */
function toParticles(raw: RawParticle[], isMobile: boolean): Particle[] {
  const fontSize = isMobile ? 5 : 7;
  // How far characters start from where they belong. Smaller on mobile so they don't
  // begin far outside the visible canvas.
  const scatter = isMobile ? 220 : 320;
  return raw.map((p) => ({
    x: p.x + (Math.random() - 0.5) * scatter,
    y: p.y + (Math.random() - 0.5) * scatter,
    targetX: p.x,
    targetY: p.y,
    vx: 0,
    vy: 0,
    char: p.char,
    fontSize,
    baseAlpha: p.alpha,
    currentAlpha: 0,
    delay: Math.random() * 0.45,
    shimmer: Math.random() * Math.PI * 2,
  }));
}

type AsciiPortraitProps = {
  className?: string;
};

export function AsciiPortrait({ className }: AsciiPortraitProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Two pointer refs: `mouseRef` is the smoothed position the physics reads, and
  // `mouseTargetRef` is the raw last-known position. The gap between them is eased each
  // frame, which turns a jumpy pointer stream into a gliding influence.
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const mouseTargetRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const startTimeRef = useRef<number | null>(null);
  /** Sampled pixels keyed by canvas size, so a resize back to a seen size is instant. */
  const cacheRef = useRef<Record<number, RawParticle[]>>({});
  const [size, setSize] = useState(360);
  const [ready, setReady] = useState(false);
  const [staticFallback, setStaticFallback] = useState(false);

  // Track viewport width and derive the canvas size from it.
  useEffect(() => {
    const update = () => setSize(calcSize(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Load and process the image, or bail out to the static fallback.
  useEffect(() => {
    // Reduced motion: skip the canvas pipeline entirely and render a plain <img>.
    //
    // These two synchronous setState calls are what trip react-hooks/set-state-in-effect
    // under the React Compiler rules — the repo's one standing lint error. See the file
    // header for the fix direction.
    if (prefersReducedMotion()) {
      setStaticFallback(true);
      setReady(true);
      return;
    }

    const isMobile = size <= 280;
    // Cache hit: rebuild particles from stored samples, skipping the image decode and
    // the getImageData scan.
    if (cacheRef.current[size]) {
      particlesRef.current = toParticles(cacheRef.current[size], isMobile);
      startTimeRef.current = performance.now();
      setReady(true);
      return;
    }

    // `cancelled` guards against the effect re-running (a resize) before the image
    // finishes loading — without it, a stale onload would overwrite newer particles.
    let cancelled = false;
    const img = new Image();
    img.decoding = "async";
    img.src = IMAGE_SRC;
    img.onload = () => {
      if (cancelled) return;
      const raw = processImage(img, size);
      cacheRef.current[size] = raw;
      particlesRef.current = toParticles(raw, isMobile);
      startTimeRef.current = performance.now();
      setReady(true);
    };
    // A failed load degrades to the same static <img> as reduced motion, so a broken
    // asset shows the photo rather than an empty canvas.
    img.onerror = () => {
      if (!cancelled) setStaticFallback(true);
    };
    return () => {
      cancelled = true;
    };
  }, [size]);

  // The animation loop, started once particles are ready.
  useEffect(() => {
    if (staticFallback || !ready) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Cap DPR at 2; beyond that the cost climbs with no visible gain.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let raf = 0;

    const draw = () => {
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, size, size);

      const particles = particlesRef.current;
      if (!particles.length || startTimeRef.current == null) return;

      const mouse = mouseRef.current;
      const mouseTarget = mouseTargetRef.current;
      const elapsed = (performance.now() - startTimeRef.current) / 1000;

      // Ease the smoothed pointer 15% toward the raw one each frame, so the influence
      // trails the cursor slightly instead of teleporting between pointer events.
      mouse.x += (mouseTarget.x - mouse.x) * 0.15;
      mouse.y += (mouseTarget.y - mouse.y) * 0.15;

      const isMobile = size <= 280;
      const fontSize = isMobile ? 5 : 7;
      ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (const p of particles) {
        // Each particle runs on its own clock, offset by its stagger delay.
        const particleTime = elapsed - p.delay;
        if (particleTime < 0) continue;

        // Fade in over 1.5s, quadratic ease-out.
        const fadeProgress = Math.min(particleTime / 1.5, 1);
        const easedFade = 1 - (1 - fadeProgress) ** 2;
        // "Active" means the portrait is still assembling, or the cursor is engaged.
        // Once neither holds, the extra per-frame work below is skipped and particles
        // are allowed to freeze — this is what keeps an idle portrait cheap.
        const isActive = mouse.active || particleTime < 3;
        const shimmerVal = isActive
          ? Math.sin(elapsed * 2 + p.shimmer) * 0.1
          : 0;
        p.currentAlpha = Math.max(0, p.baseAlpha * easedFade + shimmerVal);

        // Assembly progress on a cubic ease-out, driving the spring strength below.
        const moveProgress = Math.min(particleTime / 2.5, 1);
        const easedMove = 1 - (1 - moveProgress) ** 3;

        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          // Influence radius scales with the canvas, so the interaction feels the same
          // at every breakpoint.
          const maxDist = size * 0.2;
          if (dist < maxDist && dist > 0) {
            // Repulsion accumulates into velocity here (unlike PipelineParticles, which
            // displaces position), so characters get flung and then spring back — the
            // scatter-and-reform effect.
            const force = (1 - dist / maxDist) * 4;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        // Spring toward the target. Pull strength ramps from 0.01 to 0.09 as assembly
        // progresses, so characters drift in loosely at first and are held firmly once
        // the portrait has formed.
        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;
        const pull = 0.01 + easedMove * 0.08;
        p.vx += dx * pull;
        p.vy += dy * pull;

        if (isActive) {
          // Low-frequency noise keyed to each particle's target position, so the
          // portrait breathes rather than sitting perfectly still. Damping at 0.92
          // leaves enough energy for that motion to stay visible.
          p.vx += Math.sin(elapsed * 0.5 + p.targetY * 0.1) * 0.15;
          p.vy += Math.cos(elapsed * 0.5 + p.targetX * 0.1) * 0.15;
          p.vx *= 0.92;
          p.vy *= 0.92;
        } else {
          // Idle: damp harder to settle quickly, then snap exactly onto the target and
          // zero the velocity. Without this the spring would oscillate forever at
          // sub-pixel amplitude, burning frames on invisible motion.
          p.vx *= 0.85;
          p.vy *= 0.85;
          if (particleTime > 4 && Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) {
            p.x = p.targetX;
            p.y = p.targetY;
            p.vx = 0;
            p.vy = 0;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        ctx.fillStyle = `rgba(${ACCENT}, ${p.currentAlpha})`;
        ctx.fillText(p.char, p.x, p.y);
      }
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseTargetRef.current.x = e.clientX - rect.left;
      mouseTargetRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };
    const onTouch = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const t = e.touches[0];
      mouseTargetRef.current.x = t.clientX - rect.left;
      mouseTargetRef.current.y = t.clientY - rect.top;
      mouseRef.current.active = true;
      // Suppress the page scroll so dragging across the portrait interacts with it.
      // Requires the non-passive listener registration below; `touch-none` on the canvas
      // handles the same thing at the CSS level.
      if (e.cancelable) e.preventDefault();
    };
    const onLeave = () => {
      mouseRef.current.active = false;
      mouseTargetRef.current.x = -1000;
      mouseTargetRef.current.y = -1000;
    };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    canvas.addEventListener("touchmove", onTouch, { passive: false });
    canvas.addEventListener("touchend", onLeave);
    draw();

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      canvas.removeEventListener("touchmove", onTouch);
      canvas.removeEventListener("touchend", onLeave);
    };
  }, [size, ready, staticFallback]);

  // Reduced motion, or the image failed to load: show the photo itself.
  if (staticFallback) {
    return (
      // Raw <img> rather than next/image, deliberately — the canvas path needs the
      // unoptimized original at this exact URL, and keeping both paths on one source
      // avoids shipping two encodings of the same photo.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={IMAGE_SRC}
        alt="Ramachandra Nalam"
        className={cn(
          "h-full w-full max-h-[400px] max-w-[400px] rounded-md object-cover object-top opacity-90",
          className,
        )}
        width={400}
        height={400}
      />
    );
  }

  return (
    // A canvas is opaque to assistive tech, so this carries role="img" and a description
    // — unlike the decorative PipelineParticles, which is aria-hidden. `touch-none`
    // prevents the browser's default touch scrolling over the canvas, and the crosshair
    // cursor signals that the surface is interactive.
    <canvas
      ref={canvasRef}
      className={cn("mx-auto block cursor-crosshair touch-none", className)}
      style={{ width: size, height: size }}
      aria-label="Interactive ASCII portrait of Ramachandra Nalam"
      role="img"
    />
  );
}
