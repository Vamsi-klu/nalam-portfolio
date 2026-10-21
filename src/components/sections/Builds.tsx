import {
  ArrowUpRight,
  Braces,
  Database,
  GitBranch,
  Play,
  Sparkles,
} from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectGallery } from "@/components/sections/ProjectGallery";
import { builds, editorial } from "@/content/site";

const galleryProjects = builds
  .map((item, index) => ({ item, index }))
  .sort(
    (a, b) =>
      Number(Boolean(b.item.github || b.item.demo)) -
      Number(Boolean(a.item.github || a.item.demo)),
  );

function ProjectArt({ index }: { index: number }) {
  return (
    <div className={`project-art project-art-${index}`} aria-hidden="true">
      {index === 0 ? (
        <div className="query-art">
          <div className="query-prompt">
            <Sparkles size={23} />
            <span />
            <span />
          </div>
          <div className="query-result">
            <Database size={32} />
            <div className="query-grid">
              {Array.from({ length: 15 }, (_, i) => (
                <i key={i} />
              ))}
            </div>
          </div>
          <span className="query-code">
            <Braces size={37} />
          </span>
        </div>
      ) : index === 1 ? (
        <div className="kanban-art">
          {[3, 2, 2].map((cards, column) => (
            <div key={column}>
              <span />
              {Array.from({ length: cards }, (_, i) => (
                <i key={i}>
                  <b />
                  <b />
                </i>
              ))}
            </div>
          ))}
        </div>
      ) : index === 2 ? (
        <div className="prompt-art">
          <span className="prompt-spark">
            <Sparkles size={57} strokeWidth={1.4} />
          </span>
          <div className="prompt-bars">
            {Array.from({ length: 7 }, (_, i) => (
              <i key={i} />
            ))}
          </div>
        </div>
      ) : index === 3 ? (
        <div className="video-art">
          <div className="video-frame">
            <Play size={42} fill="currentColor" strokeWidth={0} />
          </div>
          <div className="video-summary">
            {Array.from({ length: 5 }, (_, i) => (
              <i key={i} />
            ))}
          </div>
        </div>
      ) : index === 4 ? (
        <div className="agents-art">
          <span className="agents-core">
            <GitBranch size={45} />
          </span>
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} className={`agent-node agent-node-${i}`}>
              <Sparkles size={19} />
            </span>
          ))}
        </div>
      ) : (
        <div className="retail-art">
          <div className="retail-bars">
            {Array.from({ length: 6 }, (_, i) => (
              <i key={i} />
            ))}
          </div>
          <div className="retail-tiles">
            <i />
            <i />
            <i />
          </div>
        </div>
      )}
    </div>
  );
}

export function Builds() {
  return (
    <section
      id="builds"
      className="section personal-builds"
      aria-labelledby="builds-title"
    >
      <Reveal className="builds-heading">
        <h2 id="builds-title" className="display-heading">
          {editorial.builds.title} <em>{editorial.builds.accent}</em>
        </h2>
        <p className="builds-note">{editorial.builds.note}</p>
      </Reveal>
      <ProjectGallery
        label={editorial.builds.eyebrow}
        previous={editorial.builds.previous}
        next={editorial.builds.next}
      >
        {galleryProjects.map(({ item, index }) => (
          <article
            key={item.id}
            className={`project-card project-card-${index}`}
          >
            <div className="project-title-group">
              <p className="project-category">{item.stack.join(" · ")}</p>
              <h3>{item.title}</h3>
            </div>
            <ProjectArt index={index} />
            <p className="project-description">{item.description}</p>
            <div className="project-links">
              {item.github ? (
                <a
                  href={item.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-arrow"
                  aria-label={`${editorial.builds.code}: ${item.title}`}
                >
                  {editorial.builds.code}
                  <ArrowUpRight size={17} aria-hidden="true" />
                </a>
              ) : null}
              {item.demo ? (
                <a
                  href={item.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-arrow"
                  aria-label={`${editorial.builds.demo}: ${item.title}`}
                >
                  {editorial.builds.demo}
                  <ArrowUpRight size={17} aria-hidden="true" />
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </ProjectGallery>
    </section>
  );
}
