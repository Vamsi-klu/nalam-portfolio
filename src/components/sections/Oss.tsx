import { ArrowUpRight, GitPullRequest } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { GithubIcon } from "@/components/ui/icons";
import { editorial, oss } from "@/content/site";

export function Oss() {
  return (
    <section
      id="oss"
      className="section open-source"
      aria-labelledby="oss-title"
    >
      <Reveal>
        <div className="section-topline">
          <p className="eyebrow">{editorial.oss.eyebrow}</p>
          <GithubIcon size={23} />
        </div>
        <h2 id="oss-title" className="display-heading">
          {editorial.oss.title}
          <br />
          <em>{editorial.oss.accent}</em>
        </h2>
      </Reveal>
      <Reveal delay={0.06}>
        <div className="oss-panel">
          <div className="oss-overview">
            <div className="oss-mark" aria-hidden="true">
              <GitPullRequest size={35} strokeWidth={1.2} />
            </div>
            <h3>{oss.headline}</h3>
            <p className="oss-summary">{oss.summary}</p>
            <ul className="oss-upstreams">
              {oss.upstreams.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
            <a
              className="oss-all-link"
              href={oss.allPrsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {editorial.oss.all}
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </div>
          <div className="oss-contributions">
            <p className="oss-list-label">{editorial.oss.label}</p>
            <ul className="oss-pr-list">
              {oss.prs.map((pr) => (
                <li key={pr.url}>
                  <a
                    href={pr.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="oss-pr-link"
                  >
                    <GitPullRequest
                      size={19}
                      strokeWidth={1.5}
                      aria-hidden="true"
                      className="oss-pr-icon"
                    />
                    <span className="oss-pr-copy">
                      <span className="oss-pr-title">{pr.title}</span>
                      <span className="oss-pr-repo">{pr.repo}</span>
                    </span>
                    <ArrowUpRight
                      size={16}
                      aria-hidden="true"
                      className="oss-pr-arrow"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
