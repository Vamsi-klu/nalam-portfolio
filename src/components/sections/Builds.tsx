/**
 * "Selected builds" — personal side projects, each linking out to its repo and demo.
 *
 * A Server Component.
 */

import { ExternalLink, FolderGit2 } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { builds } from "@/content/site";

/**
 * Local copy of the GitHub mark, in the solid filled brand style.
 *
 * Duplicated: `Contact.tsx` has an identical copy, and `@/components/ui/icons` exports a
 * differently-styled stroked outline version sized by a `size` prop instead of
 * `className`. The two styles are not interchangeable at a glance. Prefer the shared
 * `ui/icons` module for new work; consolidating these is a pending cleanup.
 */
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
    </svg>
  );
}

export function Builds() {
  return (
    <section id="builds" className="section" aria-labelledby="builds-title">
      <Reveal>
        <h2 id="builds-title" className="section-title">
          selected builds
        </h2>
      </Reveal>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {builds.map((item, i) => (
          <Reveal key={item.id} delay={0.06 * (i + 1)} as="article">
            <article className="card-lift group flex h-full flex-col rounded border border-lightest-navy bg-light-navy p-5">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded border border-lightest-navy bg-navy/50 text-accent">
                  <FolderGit2 className="h-5 w-5" aria-hidden />
                </div>

                {/* Both links are optional, so a project with neither still renders as
                    a valid card — it just shows no link affordance. */}
                <div className="flex items-center gap-2">
                  {item.github ? (
                    <a
                      href={item.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded p-1.5 text-light-slate transition-colors hover:text-accent"
                      aria-label={`${item.title} on GitHub`}
                    >
                      <GithubIcon className="h-4 w-4" />
                    </a>
                  ) : null}
                  {item.demo ? (
                    <a
                      href={item.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded p-1.5 text-light-slate transition-colors hover:text-accent"
                      aria-label={`${item.title} live demo`}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : null}
                </div>
              </div>

              <h3 className="mb-2 font-mono text-base font-semibold text-lightest-slate transition-colors group-hover:text-accent">
                {item.github ? (
                  <a
                    href={item.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                  >
                    {item.title}
                  </a>
                ) : (
                  item.title
                )}
              </h3>

              <p className="mb-5 flex-1 text-sm leading-relaxed text-slate">
                {item.description}
              </p>

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
