import { Reveal } from "@/components/motion/Reveal";
import { editorial, site } from "@/content/site";
import "@/components/sections/profile.css";

export function About() {
  return (
    <section
      id="about"
      className="section profile-section"
      aria-labelledby="about-title"
    >
      <div className="section-topline">
        <p className="eyebrow">{editorial.about.eyebrow}</p>
        <span className="profile-location">{site.location}</span>
      </div>

      <div className="profile-layout">
        <Reveal className="profile-portrait">
          <figure>
            <div className="profile-photo-frame">
              {/* Keep the original URL shared with the canvas portrait. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/profile.jpg"
                alt={site.name}
                width={460}
                height={460}
                loading="lazy"
                decoding="async"
              />
              <span className="profile-photo-corner" aria-hidden="true">
                ✳
              </span>
            </div>
            <figcaption>
              <span>{editorial.about.portrait}</span>
              <span aria-hidden="true">↗</span>
            </figcaption>
          </figure>
        </Reveal>

        <div className="profile-copy">
          <Reveal>
            <h2 id="about-title" className="display-heading">
              {editorial.about.title}
              <br />
              <em>{editorial.about.accent}</em>
            </h2>
          </Reveal>
          <div className="profile-bio">
            {site.about.map((paragraph, index) => (
              <Reveal key={paragraph} delay={index * 0.04}>
                <p>{paragraph}</p>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <dl className="profile-now">
              {site.now.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>

      <Reveal>
        <div className="profile-skills">
          <h3 className="eyebrow">{editorial.about.skills}</h3>
          <dl className="profile-skill-grid">
            {Object.entries(site.skills).map(([category, skills]) => (
              <div key={category}>
                <dt>{category}</dt>
                <dd>{skills.join(" · ")}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>
    </section>
  );
}
