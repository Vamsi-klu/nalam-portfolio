"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ProjectGalleryProps = {
  children: ReactNode;
  label: string;
  previous: string;
  next: string;
};

export function ProjectGallery({
  children,
  label,
  previous,
  next,
}: ProjectGalleryProps) {
  const viewport = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const node = viewport.current;
    if (!node) return;
    const update = () => {
      const start = node.scrollLeft <= 2;
      const end = node.scrollLeft + node.clientWidth >= node.scrollWidth - 2;
      setEdges((current) =>
        current.start === start && current.end === end
          ? current
          : { start, end },
      );
    };
    const observer = new ResizeObserver(update);
    observer.observe(node);
    node.addEventListener("scroll", update, { passive: true });
    return () => {
      observer.disconnect();
      node.removeEventListener("scroll", update);
    };
  }, []);

  function move(direction: number) {
    const node = viewport.current;
    const firstCard = node?.querySelector<HTMLElement>(".project-card");
    if (!node || !firstCard) return;
    const gap = Number.parseFloat(getComputedStyle(node).columnGap) || 0;
    node.scrollBy({
      left: direction * (firstCard.offsetWidth + gap),
      behavior: reducedMotion ? "instant" : "smooth",
    });
  }

  return (
    <div className="project-gallery">
      <div
        ref={viewport}
        id="project-gallery"
        className="project-gallery-track"
        role="region"
        aria-label={label}
        tabIndex={0}
      >
        {children}
      </div>
      <div className="project-gallery-controls">
        <button
          type="button"
          onClick={() => move(-1)}
          disabled={edges.start}
          aria-label={previous}
          aria-controls="project-gallery"
        >
          <ChevronLeft size={24} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => move(1)}
          disabled={edges.end}
          aria-label={next}
          aria-controls="project-gallery"
        >
          <ChevronRight size={24} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
