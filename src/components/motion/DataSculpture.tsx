"use client";

import { useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { editorial } from "@/content/site";

export function DataSculpture() {
  const reducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  return (
    <div className="sculpture-shell">
      <div className="sculpture-art" aria-hidden="true">
        <div className="art-grid" />
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />
        <svg
          className="data-sculpture"
          viewBox="0 0 640 640"
          fill="none"
          style={{
            animationPlayState: paused || reducedMotion ? "paused" : "running",
          }}
        >
          <defs>
            <linearGradient
              id="ribbon"
              x1="100"
              y1="100"
              x2="530"
              y2="520"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="var(--sculpture-light)" />
              <stop offset=".24" stopColor="var(--sculpture-mid)" />
              <stop offset=".49" stopColor="var(--sculpture-shine)" />
              <stop offset=".68" stopColor="var(--sculpture-deep)" />
              <stop offset="1" stopColor="var(--forest)" />
            </linearGradient>
            <linearGradient
              id="rim"
              x1="80"
              y1="180"
              x2="540"
              y2="450"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="var(--sculpture-mid)" />
              <stop offset=".5" stopColor="var(--sculpture-shine)" />
              <stop offset="1" stopColor="var(--sculpture-deep)" />
            </linearGradient>
            <filter
              id="sculpture-shadow"
              x="-50%"
              y="-100%"
              width="200%"
              height="300%"
            >
              <feGaussianBlur stdDeviation="17" />
            </filter>
          </defs>
          <ellipse
            cx="325"
            cy="535"
            rx="155"
            ry="22"
            fill="var(--forest)"
            opacity=".13"
            filter="url(#sculpture-shadow)"
          />
          <g transform="rotate(-30 320 310)">
            <ellipse cx="320" cy="310" rx="207" ry="191" fill="url(#ribbon)" />
            {[150, 105, 57, 13].map((radius) => (
              <ellipse
                key={`v${radius}`}
                cx="320"
                cy="310"
                rx={radius}
                ry="191"
                stroke="url(#rim)"
                strokeWidth="2"
              />
            ))}
            {[148, 103, 54, 12].map((radius) => (
              <ellipse
                key={`h${radius}`}
                cx="320"
                cy="310"
                rx="207"
                ry={radius}
                stroke="url(#rim)"
                strokeWidth="2"
              />
            ))}
            <ellipse
              cx="320"
              cy="310"
              rx="208"
              ry="192"
              stroke="url(#rim)"
              strokeWidth="2"
            />
            <ellipse
              cx="320"
              cy="310"
              rx="269"
              ry="69"
              stroke="var(--accent)"
              strokeOpacity=".35"
            />
            <path
              d="M 55 298 A 269 69 0 0 0 583 325"
              stroke="var(--paper)"
              strokeWidth="8"
            />
            <path
              d="M 55 298 A 269 69 0 0 0 583 325"
              stroke="var(--sculpture-mid)"
              strokeWidth="1.5"
            />
            <circle cx="557" cy="342" r="10" fill="var(--clay)" />
            <circle cx="557" cy="342" r="4" fill="var(--sand)" />
          </g>
        </svg>
        <p className="art-caption art-top">
          <span>+</span>
          {editorial.hero.artTop}
        </p>
        <p className="art-caption art-bottom">
          <span className="status-dot" />
          {editorial.hero.artBottom}
          <span className="art-index">{editorial.hero.artIndex}</span>
        </p>
      </div>
      <button
        type="button"
        className="motion-toggle"
        aria-pressed={paused}
        onClick={() => setPaused(!paused)}
      >
        {paused ? editorial.hero.resume : editorial.hero.pause}
        {paused ? (
          <Play size={11} aria-hidden="true" />
        ) : (
          <Pause size={11} aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
