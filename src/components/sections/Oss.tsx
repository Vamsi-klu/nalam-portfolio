import { ArrowUpRight, GitMerge, GitPullRequest } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { editorial, oss, site } from "@/content/site";

export function Oss() {
  return (
    <section id="oss" className="open-source" aria-labelledby="oss-title">
      <div className="section oss-feature">
        <Reveal className="oss-heading">
          <p className="eyebrow">{editorial.oss.eyebrow}</p>
          <h2 id="oss-title" className="display-heading">
            {editorial.oss.title}
            <br />
            <em>{editorial.oss.accent}</em>
          </h2>
          <p className="oss-summary">{oss.summary}</p>
          <a
            className="btn-accent"
            href={oss.allPrsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {editorial.oss.all}
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </Reveal>
        <Reveal className="oss-scale">
          <div className="oss-branch-art" aria-hidden="true">
            <span className="oss-branch-stem" />
            <span className="oss-branch-fork" />
            <span className="oss-branch-dot oss-branch-dot-one" />
            <span className="oss-branch-dot oss-branch-dot-two" />
            <span className="oss-branch-dot oss-branch-dot-three" />
            <GitMerge size={96} strokeWidth={1} />
          </div>
          <dl className="oss-numbers">
            {site.metrics.slice(1, 3).map((metric) => (
              <div key={metric.label}>
                <dt>{metric.label}</dt>
                <dd>{metric.display}</dd>
              </div>
            ))}
          </dl>
          <ul className="oss-upstreams">
            {oss.upstreams.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </Reveal>
        <Reveal className="oss-contributions">
          <h3>{editorial.oss.label}</h3>
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
                    size={24}
                    strokeWidth={1.6}
                    aria-hidden="true"
                    className="oss-pr-icon"
                  />
                  <span className="oss-pr-copy">
                    <span className="oss-pr-repo">{pr.repo}</span>
                    <span className="oss-pr-title">{pr.title}</span>
                  </span>
                  <ArrowUpRight
                    size={21}
                    aria-hidden="true"
                    className="oss-pr-arrow"
                  />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
