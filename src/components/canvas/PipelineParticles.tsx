"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const ACCENT = "#00c7b7";
const STAGES = ["Extract", "Transform", "Serve"] as const;
const REPEL_RADIUS = 90;
const REPEL_STRENGTH = 0.55;
const PARTICLE_COUNT_BASE = 48;

type Particle = {
  x: number;
  y: number;
  vx: number;
  baseY: number;
  radius: number;
  alpha: number;
  trail: number;
};

type PipelineParticlesProps = {
  className?: string;
};

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

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

    const resize = () => {
      const parent = canvas.parentElement;
      const rect = parent?.getBoundingClientRect() ?? canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(
        28,
        Math.floor((PARTICLE_COUNT_BASE * width * height) / (520 * 360)),
      );
      particles = Array.from({ length: count }, () =>
        createParticle(width, height),
      );
    };

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

    const step = () => {
      if (!running) return;

      ctx.clearRect(0, 0, width, height);
      drawStageGuides();

      const mouse = mouseRef.current;

      for (const p of particles) {
        p.x += p.vx;

        // soft return to lane
        p.y += (p.baseY - p.y) * 0.02;

        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < REPEL_RADIUS && dist > 0.01) {
            const force =
              ((REPEL_RADIUS - dist) / REPEL_RADIUS) * REPEL_STRENGTH;
            p.x += (dx / dist) * force * 6;
            p.y += (dy / dist) * force * 6;
          }
        }

        if (p.x > width + 20) {
          p.x = -20;
          p.y = p.baseY + (Math.random() - 0.5) * height * 0.08;
          p.baseY = Math.min(
            height * 0.72,
            Math.max(height * 0.28, p.y),
          );
        }

        // trail
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
    onMotionChange();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement ?? canvas);

    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);
    media.addEventListener("change", onMotionChange);
    window.addEventListener("resize", resize);

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
    <canvas
      ref={canvasRef}
      className={cn("block h-full w-full", className)}
      aria-hidden
    />
  );
}
