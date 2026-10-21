import { ArrowDown, ArrowUpRight, MapPin } from "lucide-react";
import { editorial, site } from "@/content/site";
import { DataSculpture } from "@/components/motion/DataSculpture";

export function Hero() {
  return (
    <section id="intro" className="hero-shell" aria-labelledby="hero-heading">
      <div className="hero-copy">
        <p className="eyebrow hero-intro">
          <span className="status-dot" aria-hidden="true" />
          {site.name}
          <span aria-hidden="true">/</span>
          {site.title}
        </p>
        <h1 id="hero-heading">
          {editorial.hero.title}
          <br />
          <em>{editorial.hero.accent}</em>
        </h1>
        <p className="hero-description">{editorial.hero.description}</p>
        <div className="hero-actions">
          <a className="btn-accent" href="#work">
            {editorial.hero.work}
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <a className="btn-ghost" href="#oss">
            {editorial.hero.source}
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>
        <p className="hero-location">
          <MapPin size={12} aria-hidden="true" />
          {editorial.hero.location}
          <span aria-hidden="true">·</span>
          {editorial.hero.footnote}
        </p>
      </div>
      <DataSculpture />
      <a className="hero-scroll" href="#work">
        <ArrowDown size={16} aria-hidden="true" />
        {editorial.hero.scroll}
      </a>
    </section>
  );
}
