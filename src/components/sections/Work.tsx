import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { WorkVisual } from "@/components/motion/WorkVisual";
import { editorial, work } from "@/content/site";
import "@/components/sections/work.css";

const artwork: Record<string, string> = {
  "streaming-analytics": "/event-stream-4k.webp",
  "aws-data-platform": "/warehouse-strata-4k.webp",
};

export function Work() {
  return (
    <section
      id="work"
      className="section selected-work"
      aria-labelledby="work-title"
    >
      <Reveal className="work-heading">
        <h2 id="work-title" className="display-heading">
          {editorial.work.title} <em>{editorial.work.accent}</em>
        </h2>
        <a className="link-arrow work-experience-link" href="#experience">
          {editorial.work.details}
          <ChevronRight size={18} aria-hidden="true" />
        </a>
      </Reveal>
      <div className="work-stories">
        {work
          .filter((item) => artwork[item.id])
          .map((item) => (
            <Reveal
              as="article"
              key={item.id}
              className={`work-story work-story-${item.id}`}
            >
              <WorkVisual>
                <Image
                  src={artwork[item.id]}
                  alt=""
                  fill
                  quality={95}
                  sizes="(min-width: 1264px) 1344px, (max-width: 370px) 498px, (max-width: 700px) max(598px, calc(112vw - 53.76px)), (max-width: 800px) calc(112vw - 53.76px), calc(112vw - 71.68px)"
                  className="work-story-image"
                />
              </WorkVisual>
              <div className="work-story-copy">
                <div className="work-story-heading">
                  <p className="work-company">{item.org}</p>
                  <h3>{item.title}</h3>
                </div>
                <div className="work-story-detail">
                  <p className="work-summary">{item.summary}</p>
                  <ul className="work-technologies">
                    {item.stack.map((tool) => (
                      <li key={tool}>{tool}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
      </div>
    </section>
  );
}
