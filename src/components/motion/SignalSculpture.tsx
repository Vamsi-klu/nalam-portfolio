"use client";

import { useEffect, useRef } from "react";

type SignalScene = {
  render: (progress: number) => void;
  resize: (width: number, height: number, pixelRatio: number, portrait: boolean) => void;
  dispose: () => void;
};

export function SignalSculpture() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const motion = useRef({ current: 0, target: 0, frame: 0, previous: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const artwork = canvas?.parentElement;
    const track = artwork?.closest<HTMLElement>(".hero-scroll-track");
    if (!canvas || !artwork || !track) return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-height: 650px)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const state = motion.current;
    let scene: SignalScene | undefined;
    let visible = false;
    let disposed = false;
    let failed = false;
    let loading = false;
    let generation = 0;
    let idle = 0;

    const eligible = () =>
      !disposed && !failed && visible && !document.hidden &&
      !preference.matches && !compact.matches && !connection?.saveData;

    const stop = () => {
      cancelAnimationFrame(state.frame);
      state.frame = 0;
      state.previous = 0;
    };

    const release = () => {
      generation += 1;
      stop();
      artwork.removeAttribute("data-scene-ready");
      scene?.dispose();
      scene = undefined;
    };

    const draw = (now: number) => {
      state.frame = 0;
      if (!scene || !eligible()) return;
      const delta = state.previous ? Math.min(64, now - state.previous) : 16;
      state.previous = now;
      state.current += (state.target - state.current) * (1 - Math.exp(-delta / 70));
      if (Math.abs(state.target - state.current) < 0.0001) state.current = state.target;
      try {
        scene.render(state.current);
      } catch {
        failed = true;
        release();
        return;
      }
      if (state.current !== state.target) state.frame = requestAnimationFrame(draw);
      else state.previous = 0;
    };

    const schedule = () => {
      if (scene && eligible() && !state.frame) state.frame = requestAnimationFrame(draw);
    };

    const dimensions = () => {
      const width = artwork.clientWidth;
      const height = artwork.clientHeight;
      const portrait = window.innerWidth <= 800;
      const pixels = portrait ? 2_000_000 : 4_000_000;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(pixels / Math.max(1, width * height)));
      return { width, height, pixelRatio, portrait };
    };

    const initialize = async () => {
      if (scene || loading || !eligible()) return;
      loading = true;
      const ticket = generation;
      try {
        // Changing the responsive source can cancel decode without breaking the image.
        await artwork.querySelector("img")?.decode().catch(() => undefined);
        if (ticket !== generation || !eligible()) return;
        const context = canvas.getContext("webgl2", { alpha: true, antialias: true, powerPreference: "high-performance" });
        if (!context) { failed = true; return; }
        const { createSignalScene } = await import("@/lib/signal-scene");
        if (ticket !== generation || !eligible()) return;
        const styles = getComputedStyle(document.documentElement);
        scene = createSignalScene(canvas, {
          ...dimensions(),
          context,
          colors: {
            paper: styles.getPropertyValue("--on-dark").trim(),
            ink: styles.getPropertyValue("--black").trim(),
            accent: styles.getPropertyValue("--accent-light").trim(),
          },
        });
        state.current = state.target;
        scene.render(state.current);
        artwork.setAttribute("data-scene-ready", "true");
      } catch {
        if (ticket === generation && !disposed) {
          failed = true;
          release();
        }
      } finally {
        loading = false;
        if (!scene && eligible()) queueInitialization();
      }
    };

    const queueInitialization = () => {
      if (!eligible() || scene || idle) return;
      // The server-rendered poster paints before the optional renderer is loaded.
      idle = window.setTimeout(() => { idle = 0; void initialize(); }, 180);
    };

    const progress = (event: Event) => {
      state.target = (event as CustomEvent<number>).detail;
      queueInitialization();
      schedule();
    };

    const resize = () => {
      if (scene) {
        const size = dimensions();
        scene.resize(size.width, size.height, size.pixelRatio, size.portrait);
        schedule();
      } else queueInitialization();
    };

    const preferenceChange = () => {
      if (preference.matches || compact.matches) release();
      else queueInitialization();
    };
    const visibilityChange = () => {
      if (document.hidden) stop();
      else { queueInitialization(); schedule(); }
    };
    const contextLost = (event: Event) => {
      event.preventDefault();
      failed = true;
      release();
    };

    state.target = Number(track.style.getPropertyValue("--scene-progress")) || 0;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) { queueInitialization(); schedule(); }
      else stop();
    });
    observer.observe(artwork);
    const resizer = new ResizeObserver(resize);
    resizer.observe(artwork);
    track.addEventListener("signal-progress", progress);
    preference.addEventListener("change", preferenceChange);
    compact.addEventListener("change", preferenceChange);
    document.addEventListener("visibilitychange", visibilityChange);
    canvas.addEventListener("webglcontextlost", contextLost);

    return () => {
      disposed = true;
      window.clearTimeout(idle);
      observer.disconnect();
      resizer.disconnect();
      track.removeEventListener("signal-progress", progress);
      preference.removeEventListener("change", preferenceChange);
      compact.removeEventListener("change", preferenceChange);
      document.removeEventListener("visibilitychange", visibilityChange);
      canvas.removeEventListener("webglcontextlost", contextLost);
      release();
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-sculpture" aria-hidden="true" />;
}
