import {
  ArrowUpRight,
  AudioLines,
  Braces,
  LayoutDashboard,
  Network,
  ShoppingBag,
  Terminal,
} from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { GithubIcon } from "@/components/ui/icons";
import { builds, editorial } from "@/content/site";

const buildIcons = [
  Braces,
  LayoutDashboard,
  Terminal,
  AudioLines,
  Network,
  ShoppingBag,
];

export function Builds() {
  return (
    <section
      id="builds"
      className="section personal-builds"
      aria-labelledby="builds-title"
    >
      <Reveal>
        <div className="section-topline">
          <p className="eyebrow">{editorial.builds.eyebrow}</p>
        </div>
        <h2 id="builds-title" className="display-heading">
          {editorial.builds.title}
          <br />
          <em>{editorial.builds.accent}</em>
        </h2>
      </Reveal>
      <div className="build-grid">
        {builds.map((item, index) => {
          const BuildIcon = buildIcons[index % buildIcons.length];
          return (
            <Reveal
              key={item.id}
              delay={(index % 3) * 0.05}
              className="build-reveal"
            >
              <article className="build-card">
                <div className="build-card-top">
                  <span className="build-icon" aria-hidden="true">
                    <BuildIcon size={23} strokeWidth={1.4} />
                  </span>
                  <span className="build-index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3>{item.title}</h3>
                <p className="build-description">{item.description}</p>
                <ul className="build-stack">
                  {item.stack.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
                <div className="build-links">
                  {item.github ? (
                    <a
                      href={item.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${editorial.builds.code}: ${item.title}`}
                    >
                      <GithubIcon size={15} />
                      {editorial.builds.code}
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                  ) : null}
                  {item.demo ? (
                    <a
                      href={item.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${editorial.builds.demo}: ${item.title}`}
                    >
                      {editorial.builds.demo}
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                  ) : null}
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
