"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const CHARS = " .:-=+*#%@".split("");
const ACCENT = "0, 199, 183";
const IMAGE_SRC = "/profile.jpg";

type Particle = {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  char: string;
  fontSize: number;
  baseAlpha: number;
  currentAlpha: number;
  delay: number;
  shimmer: number;
};

type RawParticle = {
  x: number;
  y: number;
  char: string;
  alpha: number;
};

function calcSize(width: number) {
  if (width <= 480) return Math.min(240, width - 48);
  if (width <= 768) return Math.min(300, width - 64);
  return 400;
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function processImage(img: HTMLImageElement, targetSize: number): RawParticle[] {
  const offscreen = document.createElement("canvas");
  const offCtx = offscreen.getContext("2d", { willReadFrequently: true });
  if (!offCtx) return [];

  offscreen.width = targetSize;
  offscreen.height = targetSize;

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

  offCtx.fillStyle = "#0a192f";
  offCtx.fillRect(0, 0, targetSize, targetSize);
  offCtx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

  const { data } = offCtx.getImageData(0, 0, targetSize, targetSize);
  const isMobile = targetSize <= 280;
  const fontSize = isMobile ? 5 : 7;
  const colGap = fontSize * 0.7;
  const rowGap = fontSize * 1.1;
  const raw: RawParticle[] = [];

  for (let y = 0; y < targetSize; y += rowGap) {
    for (let x = 0; x < targetSize; x += colGap) {
      const i = (Math.floor(y) * targetSize + Math.floor(x)) * 4;
      const a = data[i + 3];
      if (a < 40) continue;

      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (r + g + b) / (3 * 255);
      if (brightness < 0.06) continue;

      const charIndex = Math.min(
        CHARS.length - 1,
        Math.floor(brightness * (CHARS.length - 1)),
      );
      raw.push({
        x: Number(x.toFixed(1)),
        y: Number(y.toFixed(1)),
        char: CHARS[charIndex],
        alpha: Number((0.45 + brightness * 0.55).toFixed(2)),
      });
    }
  }
  return raw;
}

function toParticles(raw: RawParticle[], isMobile: boolean): Particle[] {
  const fontSize = isMobile ? 5 : 7;
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
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const mouseTargetRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const cacheRef = useRef<Record<number, RawParticle[]>>({});
  const [size, setSize] = useState(360);
  const [ready, setReady] = useState(false);
  const [staticFallback, setStaticFallback] = useState(false);

  useEffect(() => {
    const update = () => setSize(calcSize(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setStaticFallback(true);
      setReady(true);
      return;
    }

    const isMobile = size <= 280;
    if (cacheRef.current[size]) {
      particlesRef.current = toParticles(cacheRef.current[size], isMobile);
      startTimeRef.current = performance.now();
      setReady(true);
      return;
    }

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
    img.onerror = () => {
      if (!cancelled) setStaticFallback(true);
    };
    return () => {
      cancelled = true;
    };
  }, [size]);

  useEffect(() => {
    if (staticFallback || !ready) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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

      mouse.x += (mouseTarget.x - mouse.x) * 0.15;
      mouse.y += (mouseTarget.y - mouse.y) * 0.15;

      const isMobile = size <= 280;
      const fontSize = isMobile ? 5 : 7;
      ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (const p of particles) {
        const particleTime = elapsed - p.delay;
        if (particleTime < 0) continue;

        const fadeProgress = Math.min(particleTime / 1.5, 1);
        const easedFade = 1 - (1 - fadeProgress) ** 2;
        const isActive = mouse.active || particleTime < 3;
        const shimmerVal = isActive
          ? Math.sin(elapsed * 2 + p.shimmer) * 0.1
          : 0;
        p.currentAlpha = Math.max(0, p.baseAlpha * easedFade + shimmerVal);

        const moveProgress = Math.min(particleTime / 2.5, 1);
        const easedMove = 1 - (1 - moveProgress) ** 3;

        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          const maxDist = size * 0.2;
          if (dist < maxDist && dist > 0) {
            const force = (1 - dist / maxDist) * 4;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;
        const pull = 0.01 + easedMove * 0.08;
        p.vx += dx * pull;
        p.vy += dy * pull;

        if (isActive) {
          p.vx += Math.sin(elapsed * 0.5 + p.targetY * 0.1) * 0.15;
          p.vy += Math.cos(elapsed * 0.5 + p.targetX * 0.1) * 0.15;
          p.vx *= 0.92;
          p.vy *= 0.92;
        } else {
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

  if (staticFallback) {
    return (
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
    <canvas
      ref={canvasRef}
      className={cn("mx-auto block cursor-crosshair touch-none", className)}
      style={{ width: size, height: size }}
      aria-label="Interactive ASCII portrait of Ramachandra Nalam"
      role="img"
    />
  );
}
