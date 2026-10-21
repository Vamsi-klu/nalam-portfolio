import { ArrowUpRight, Database, GitMerge, Workflow } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { editorial, work } from "@/content/site";
import "@/components/sections/work.css";

const diagrams = [Workflow, Database, GitMerge];

export function Work() {
  return (
    <section
      id="work"
      className="section selected-work"
      aria-labelledby="work-title"
    >
      <Reveal>
        <div className="section-topline">
          <p className="eyebrow">{editorial.work.eyebrow}</p>
          <p className="work-section-note">{editorial.work.note}</p>
        </div>
        <h2 id="work-title" className="display-heading">
          {editorial.work.title}
          <br />
          <em>{editorial.work.accent}</em>
        </h2>
      </Reveal>
      <div className="work-grid">
        {work.map((item, index) => {
          const DiagramIcon = diagrams[index % diagrams.length];
          return (
            <Reveal key={item.id} delay={index * 0.06} className="work-reveal">
              <article className="work-card">
                <div
                  className={`work-visual work-visual-${index % diagrams.length}`}
                >
                  <div className="work-visual-top">
                    <p>{item.org}</p>
                    <span aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="work-diagram" aria-hidden="true">
                    <span className="work-diagram-orbit" />
                    <span className="work-diagram-orbit work-diagram-orbit-secondary" />
                    <span className="work-diagram-path work-diagram-path-one" />
                    <span className="work-diagram-path work-diagram-path-two" />
                    <span className="work-diagram-node work-diagram-node-one" />
                    <span className="work-diagram-node work-diagram-node-two" />
                    <span className="work-diagram-node work-diagram-node-three" />
                    <span className="work-diagram-core">
                      <DiagramIcon size={40} strokeWidth={1.1} />
                    </span>
                  </div>
                  <p className="work-visual-stack">
                    {item.stack.slice(0, 3).join(" · ")}
                  </p>
                </div>
                <div className="work-card-copy">
                  <h3>{item.title}</h3>
                  <p className="work-card-summary">{item.summary}</p>
                  <ul className="work-principles">
                    {item.metrics.map((metric) => (
                      <li key={metric}>{metric}</li>
                    ))}
                  </ul>
                  <a
                    className="work-detail-link"
                    href={item.id === "oss-data-stack" ? "#oss" : "#experience"}
                  >
                    {item.id === "oss-data-stack"
                      ? editorial.oss.all
                      : editorial.work.details}
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
