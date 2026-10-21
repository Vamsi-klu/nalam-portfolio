"use client";

import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { editorial, experience } from "@/content/site";
import { cn } from "@/lib/utils";

export function Experience() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let next: number;
    switch (event.key) {
      case "ArrowDown":
        next = (index + 1) % experience.length;
        break;
      case "ArrowUp":
        next = (index - 1 + experience.length) % experience.length;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = experience.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <section
      id="experience"
      className="section experience-section"
      aria-labelledby="experience-title"
    >
      <div className="section-topline">
        <p className="eyebrow">{editorial.experience.eyebrow}</p>
      </div>
      <Reveal>
        <div className="experience-heading">
          <h2 id="experience-title" className="display-heading">
            {editorial.experience.title}
            <br />
            <em>{editorial.experience.accent}</em>
          </h2>
          <p>{editorial.experience.note}</p>
        </div>
      </Reveal>

      <Reveal>
        <div className="experience-layout">
          <div
            role="tablist"
            aria-labelledby="experience-title"
            aria-orientation="vertical"
            className="experience-tabs"
          >
            {experience.map((item, index) => (
              <button
                key={item.company}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                type="button"
                role="tab"
                id={`exp-tab-${index}`}
                aria-selected={active === index}
                aria-controls={`exp-panel-${index}`}
                tabIndex={active === index ? 0 : -1}
                onClick={() => setActive(index)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                className={cn(
                  "experience-tab",
                  active === index && "is-active",
                )}
              >
                <span className="experience-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="experience-company">
                  <strong>{item.company}</strong>
                  <span>{item.period}</span>
                </span>
                <span className="experience-tab-arrow" aria-hidden="true">
                  ↗
                </span>
              </button>
            ))}
          </div>

          <div className="experience-panels">
            {experience.map((job, index) => (
              <div
                key={job.company}
                role="tabpanel"
                id={`exp-panel-${index}`}
                aria-labelledby={`exp-tab-${index}`}
                tabIndex={0}
                aria-hidden={active !== index}
                inert={active !== index}
                className="experience-panel"
              >
                <p className="eyebrow">{job.company}</p>
                <h3>{job.role}</h3>
                <p className="experience-period">{job.period}</p>
                <ul>
                  {job.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
