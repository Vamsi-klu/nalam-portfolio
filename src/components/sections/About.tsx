/**
 * Bio, current focus chips, skills grid, and the profile photo.
 *
 * A Server Component. It renders animated content without becoming a Client Component by
 * passing server-rendered children into `<Reveal>` — the reference example of that
 * pattern, described in docs/ARCHITECTURE.md.
 */

import { Reveal } from "@/components/motion/Reveal";
import { site } from "@/content/site";

export function About() {
  return (
    <section id="about" className="section">
      <Reveal>
        <h2 className="section-title">about me</h2>
      </Reveal>

      <div className="grid items-start gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          {site.about.map((paragraph, i) => (
            <Reveal key={i} delay={0.05 * i}>
              <p className="text-base leading-relaxed text-slate md:text-[1.05rem]">
                {paragraph}
              </p>
            </Reveal>
          ))}

          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-wrap gap-2">
              {site.now.map((item) => (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-2 rounded border border-lightest-navy bg-light-navy/40 px-3 py-1.5 font-mono text-xs text-light-slate"
                >
                  <span className="text-accent">{item.label}</span>
                  <span className="text-lightest-navy">·</span>
                  <span>{item.value}</span>
                </span>
              ))}
            </div>
          </Reveal>

          {/* Skills are driven by object keys, so adding a category in site.ts adds a
              column here with no component change. */}
          <Reveal delay={0.25}>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {Object.entries(site.skills).map(([category, skills]) => (
                <div key={category}>
                  <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-accent">
                    {category}
                  </h3>
                  <ul className="space-y-1.5">
                    {skills.map((skill) => (
                      <li
                        key={skill}
                        className="skill-bullet text-sm text-light-slate"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <div className="group relative mx-auto w-full max-w-[300px] lg:mx-0 lg:ml-auto">
            {/* Offset teal frame behind the photo that drifts further out on hover. */}
            <div
              className="absolute -inset-0 translate-x-3 translate-y-3 rounded border border-accent transition-transform duration-300 group-hover:translate-x-4 group-hover:translate-y-4"
              aria-hidden
            />
            {/*
              Raw <img> rather than next/image is deliberate, and the disable below is
              load-bearing. This same file is read pixel-by-pixel by AsciiPortrait via
              getImageData, which needs the unprocessed original — the optimizer's
              transformed output would break the sampling. Use next/image for any new
              image that doesn't feed a canvas.
            */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/profile.jpg"
              alt={`${site.name} — GitHub profile photo`}
              width={300}
              height={300}
              className="relative z-10 aspect-square w-full rounded object-cover object-top grayscale transition duration-300 group-hover:-translate-y-1.5 group-hover:grayscale-0"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
