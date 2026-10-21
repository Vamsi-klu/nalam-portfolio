import { getImageProps } from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { editorial, site } from "@/content/site";
import { HeroVisual } from "@/components/motion/HeroVisual";
import "@/components/sections/hero.css";

export function Hero() {
  const { props: desktop } = getImageProps({
    src: "/data-core.webp",
    alt: "",
    width: 1672,
    height: 941,
    sizes: "(max-width: 800px) 100vw, 1120px",
    loading: "eager",
    fetchPriority: "high",
  });
  const { props: mobile } = getImageProps({
    src: "/hero-mobile.webp",
    alt: "",
    width: 1122,
    height: 1402,
    sizes: "(max-width: 540px) 100vw, 600px",
    loading: "eager",
    fetchPriority: "high",
  });

  return (
    <section id="intro" className="product-hero" aria-labelledby="hero-heading">
      <HeroVisual>
        <div className="hero-artwork" aria-hidden="true">
          <picture>
            <source
              media="(max-width: 800px)"
              srcSet={mobile.srcSet}
              sizes={mobile.sizes}
            />
            {/* Next Image props deliver one optimized image for each art direction. */}
            <img {...desktop} alt="" />
          </picture>
        </div>
        <div className="hero-introduction">
          <p className="hero-identity">{site.name}</p>
          <h1 id="hero-heading">
            {editorial.hero.title}
            <span>{editorial.hero.accent}</span>
          </h1>
        </div>
        <div className="hero-story">
          <p className="hero-story-heading">
            {editorial.hero.storyTitle}
            <span>{editorial.hero.storyAccent}</span>
          </p>
          <p className="hero-story-description">
            {editorial.hero.storyDescription}
          </p>
          <ol className="hero-story-steps">
            {editorial.hero.storySteps.map((step, index) => (
              <li key={step}>
                <span aria-hidden="true">0{index + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
        <div className="hero-bottom-bar">
          <a className="hero-scroll-note" href="#work">
            <ArrowDown size={16} aria-hidden="true" />
            {editorial.hero.scroll}
          </a>
          <div className="hero-actions">
            <a className="hero-about-link" href="#about">
              {editorial.hero.source}
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
            <a className="btn-accent" href="#work">
              {editorial.hero.work}
            </a>
          </div>
        </div>
        <div className="hero-progress" aria-hidden="true">
          <span />
        </div>
      </HeroVisual>
    </section>
  );
}
