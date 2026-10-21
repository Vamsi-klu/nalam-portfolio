import { Reveal } from "@/components/motion/Reveal";
import { CopyEmail } from "@/components/sections/CopyEmail";
import { editorial, site } from "@/content/site";

export function Contact() {
  return (
    <section
      id="contact"
      className="section contact-section"
      aria-labelledby="contact-title"
    >
      <div className="contact-panel">
        <div className="contact-topline">
          <p className="eyebrow">{editorial.contact.eyebrow}</p>
          <span className="contact-mark" aria-hidden="true">
            ✳
          </span>
        </div>
        <Reveal>
          <h2 id="contact-title" className="display-heading">
            {editorial.contact.title}
            <br />
            <em>{editorial.contact.accent}</em>
          </h2>
        </Reveal>
        <Reveal>
          <div className="contact-invitation">
            <p>{editorial.contact.description}</p>
            <a className="contact-email" href={`mailto:${site.email}`}>
              <span>{site.email}</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </Reveal>
        <div className="contact-bottom">
          <div className="contact-links">
            <a href={site.linkedin} target="_blank" rel="noopener noreferrer">
              {editorial.contact.linkedin}
              <span aria-hidden="true">↗</span>
            </a>
            <a href={site.github} target="_blank" rel="noopener noreferrer">
              {editorial.contact.github}
              <span aria-hidden="true">↗</span>
            </a>
            <CopyEmail />
          </div>
          <span className="contact-location">{site.location}</span>
        </div>
      </div>
    </section>
  );
}
