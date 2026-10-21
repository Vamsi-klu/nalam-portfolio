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
      <Reveal>
        <header className="profile-heading">
          <p className="eyebrow">{editorial.about.eyebrow}</p>
          <h2 id="about-title" className="display-heading">
            {editorial.about.title}
            <br />
            <em>{editorial.about.accent}</em>
          </h2>
        </header>
      </Reveal>

      <div className="profile-spotlight">
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
            </div>
            <figcaption>{editorial.about.portrait}</figcaption>
          </figure>
        </Reveal>
        <div className="profile-bio">
          {site.about.map((paragraph, index) => (
            <Reveal key={paragraph} delay={index * 0.05}>
              <p>{paragraph}</p>
            </Reveal>
          ))}
        </div>
      </div>

      <Reveal>
        <dl className="profile-focus">
          {site.now.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <div className="profile-skills">
        <Reveal>
          <h3>{editorial.about.skills}</h3>
        </Reveal>
        <dl className="profile-skill-grid">
          {Object.entries(site.skills).map(([category, skills]) => (
            <div key={category}>
              <dt>{category}</dt>
              <dd>{skills.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
