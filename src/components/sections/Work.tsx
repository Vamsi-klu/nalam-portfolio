import { ChevronRight, Database, Layers3, Workflow } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { editorial, work, type WorkItem } from "@/content/site";
import "@/components/sections/work.css";

function Architecture({ item, index }: { item: WorkItem; index: number }) {
  const symbols = [Workflow, Layers3, Database];
  return (
    <div
      className={`work-architecture work-architecture-${index}`}
      aria-hidden="true"
    >
      <div className="architecture-foundation" />
      <div className="architecture-layers">
        {symbols.map((Symbol, layer) => (
          <div
            className={`architecture-layer architecture-layer-${layer}`}
            key={layer}
          >
            <div className="architecture-layer-face">
              <Symbol size={42} strokeWidth={1.25} />
              <span className="architecture-circuit" />
              <span className="architecture-circuit" />
              <span className="architecture-circuit" />
              <span className="architecture-ports">
                <i />
                <i />
                <i />
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="architecture-toolmarks">
        {item.stack.slice(0, 3).map((tool) => (
          <span key={tool}>{tool}</span>
        ))}
      </div>
    </div>
  );
}

export function Work() {
  return (
    <section
      id="work"
      className="section selected-work"
      aria-labelledby="work-title"
    >
      <Reveal className="work-heading">
        <p className="eyebrow">{editorial.work.eyebrow}</p>
        <h2 id="work-title" className="display-heading">
          {editorial.work.title}
          <br />
          <em>{editorial.work.accent}</em>
        </h2>
        <p className="work-section-note">{editorial.work.note}</p>
      </Reveal>
      <div className="work-stories">
        {work
          .filter((item) => item.id !== "oss-data-stack")
          .map((item, index) => (
            <Reveal
              as="article"
              key={item.id}
              className={`work-story work-story-${index}`}
            >
              <div className="work-story-copy">
                <p className="work-company">{item.org}</p>
                <h3>{item.title}</h3>
                <p className="work-summary">{item.summary}</p>
                <a
                  className="link-arrow work-experience-link"
                  href="#experience"
                >
                  {editorial.work.details}
                  <ChevronRight size={18} aria-hidden="true" />
                </a>
              </div>
              <Architecture item={item} index={index} />
              <ul className="work-technologies">
                {item.stack.map((tool) => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
            </Reveal>
          ))}
      </div>
    </section>
  );
}
