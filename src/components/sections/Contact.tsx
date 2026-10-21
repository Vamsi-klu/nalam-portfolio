import { ArrowUpRight } from "lucide-react";
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
      <div className="section-shell contact-panel">
        <Reveal>
          <p className="eyebrow">{editorial.contact.eyebrow}</p>
          <h2 id="contact-title" className="display-heading">
            {editorial.contact.title}
            <br />
            <em>{editorial.contact.accent}</em>
          </h2>
          <p className="contact-description">{editorial.contact.description}</p>
          <p className="contact-address">{site.email}</p>
          <div className="contact-actions">
            <a
              className="btn-accent contact-email"
              href={`mailto:${site.email}`}
            >
              {editorial.contact.email}
              <ArrowUpRight size={19} aria-hidden="true" />
            </a>
            <CopyEmail />
          </div>
        </Reveal>
        <div className="contact-links">
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer">
            {editorial.contact.linkedin}
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
          <a href={site.github} target="_blank" rel="noopener noreferrer">
            {editorial.contact.github}
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
        <p className="contact-location">{site.location}</p>
      </div>
    </section>
  );
}
