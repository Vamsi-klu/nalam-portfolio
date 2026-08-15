/**
 * Open-source contributions — the site's central credibility claim.
 *
 * Unlike the employer sections, which stay deliberately high-level, everything here is
 * specific and checkable: each pull request links to a public diff, and the closing link
 * is a GitHub search scoped to the author so a reader can audit the whole claim. That
 * verifiability is the point of the section, so never add an entry that can't be opened.
 *
 * A Server Component.
 */

import { ExternalLink } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { oss } from "@/content/site";

export function Oss() {
  return (
    <section id="oss" className="section" aria-labelledby="oss-title">
      <Reveal>
        <h2 id="oss-title" className="section-title">
          open source
        </h2>
      </Reveal>

      <Reveal delay={0.08}>
        <div className="relative overflow-hidden rounded border border-accent/25 bg-light-navy p-6 sm:p-8">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/5 blur-3xl"
            aria-hidden
          />

          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-accent">
            the differentiator
          </p>

          <h3 className="mb-3 text-xl font-semibold leading-snug text-lightest-slate sm:text-2xl">
            {oss.headline}
          </h3>

          <p className="mb-6 max-w-2xl text-sm leading-relaxed text-slate sm:text-base">
            {oss.summary}
          </p>

          <div className="mb-8">
            <p className="mb-3 font-mono text-xs text-light-slate">
              upstreams
            </p>
            <ul className="flex flex-wrap gap-2">
              {oss.upstreams.map((name) => (
                <li
                  key={name}
                  className="rounded border border-lightest-navy bg-navy/60 px-3 py-1.5 font-mono text-xs font-medium text-lightest-slate transition-colors hover:border-accent/40 hover:text-accent"
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-8">
            <p className="mb-3 font-mono text-xs text-light-slate">
              recent merges &amp; PRs
            </p>
            <ul className="flex flex-col gap-2">
              {/* Keyed by URL since it's the one guaranteed-unique field, and `as="li"`
                  keeps these valid children of the <ul>. Caveat: under reduced motion
                  Reveal renders a <div> regardless of `as`, so this becomes a <div> in a
                  <ul> — renders fine, technically invalid. */}
              {oss.prs.map((pr, i) => (
                <Reveal key={pr.url} delay={0.05 * (i + 1)} as="li">
                  <a
                    href={pr.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group card-lift flex items-start gap-3 rounded border border-lightest-navy bg-navy/40 px-4 py-3"
                  >
                    <span className="mt-0.5 shrink-0 font-mono text-[10px] text-accent">
                      PR
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm text-lightest-slate transition-colors group-hover:text-accent">
                        {pr.title}
                      </span>
                      <span className="mt-0.5 block font-mono text-[11px] text-slate">
                        {pr.repo}
                      </span>
                    </span>
                    <ExternalLink
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate opacity-0 transition-opacity group-hover:opacity-100"
                      aria-hidden
                    />
                  </a>
                </Reveal>
              ))}
            </ul>
          </div>

          <a
            href={oss.allPrsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-accent"
          >
            View all PRs →
          </a>
        </div>
      </Reveal>
    </section>
  );
}
