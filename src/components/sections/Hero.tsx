import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { editorial, site } from "@/content/site";
import { HeroVisual } from "@/components/motion/HeroVisual";

export function Hero() {
  return (
    <section id="intro" className="product-hero" aria-labelledby="hero-heading">
      <div className="hero-copy">
        <p className="hero-identity">{site.name}</p>
        <h1 id="hero-heading">
          {editorial.hero.title}
          <span>{editorial.hero.accent}</span>
        </h1>
        <p className="hero-description">{editorial.hero.description}</p>
        <div className="hero-actions">
          <a className="btn-accent" href="#work">
            {editorial.hero.work}
          </a>
          <a className="btn-ghost" href="#about">
            {editorial.hero.source}
          </a>
        </div>
      </div>
      <HeroVisual>
        <Image
          src="/data-core.webp"
          alt=""
          width={1672}
          height={941}
          sizes="(max-width: 540px) 142vw, (max-width: 800px) 114vw, 1280px"
          loading="eager"
          fetchPriority="high"
        />
      </HeroVisual>
      <a className="hero-scroll-note" href="#work">
        {editorial.hero.scroll}
        <ChevronDown size={15} aria-hidden="true" />
      </a>
    </section>
  );
}
