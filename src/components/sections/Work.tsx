/**
 * "Selected work" — themed capability cards rather than individual projects.
 *
 * The framing is what keeps this section publishable: it describes domains and stacks,
 * not the confidential specifics of employer work. See the editorial rules in
 * `src/content/site.ts`.
 *
 * A Server Component; the only client code is the `Reveal` wrapper.
 */

import { Reveal } from "@/components/motion/Reveal";
import { work } from "@/content/site";

export function Work() {
  return (
    <section id="work" className="section" aria-labelledby="work-title">
      <Reveal>
        <h2 id="work-title" className="section-title">
          selected work
        </h2>
      </Reveal>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Index-scaled delay staggers the cards in rather than revealing the row at
            once. `as="article"` keeps the wrapper from breaking the card semantics. */}
        {work.map((item, i) => (
          <Reveal key={item.id} delay={0.08 * (i + 1)} as="article">
            <article className="card-lift flex h-full flex-col rounded border border-lightest-navy bg-light-navy p-6">
              <span className="mb-3 w-fit rounded bg-accent/10 px-2.5 py-1 font-mono text-xs font-medium text-accent">
                {item.org}
              </span>

              <h3 className="mb-2 text-lg font-semibold leading-snug text-lightest-slate">
                {item.title}
              </h3>

              <p className="mb-5 flex-1 text-sm leading-relaxed text-slate">
                {item.summary}
              </p>

              <ul className="mb-4 flex flex-wrap gap-2">
                {item.metrics.map((metric) => (
                  <li
                    key={metric}
                    className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 font-mono text-[11px] text-accent"
                  >
                    {metric}
                  </li>
                ))}
              </ul>

              <ul className="flex flex-wrap gap-x-3 gap-y-1 border-t border-lightest-navy pt-4">
                {item.stack.map((tech) => (
                  <li
                    key={tech}
                    className="font-mono text-[11px] text-light-slate"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
