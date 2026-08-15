/**
 * Closing call to action with the contact channels.
 *
 * A Server Component. Email and phone are rendered as `mailto:` / `tel:` links so they
 * work from a phone; the phone number is guarded so removing `site.phone` cleanly drops
 * the line rather than rendering an empty link.
 */

import { Mail, Phone } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { site } from "@/content/site";

/**
 * Local copy of the GitHub mark — identical to the one in `Builds.tsx`, and a different
 * visual style from the stroked version in `@/components/ui/icons`. See the note there;
 * prefer the shared module for new work.
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

/** Local solid-fill LinkedIn mark, paired with the GitHub copy above. */
function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function Contact() {
  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      <Reveal>
        <h2 id="contact-title" className="section-title">
          what&apos;s next
        </h2>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mx-auto max-w-xl text-center">
          <p className="mb-2 font-mono text-sm text-accent">
            open to opportunities
          </p>

          <h3 className="mb-4 text-2xl font-semibold text-lightest-slate sm:text-3xl">
            Let&apos;s build something reliable.
          </h3>

          <p className="mb-8 text-base leading-relaxed text-slate">
            Whether it&apos;s a staff data platform role, a deep-tech collab, or
            an upstream fix worth shipping — I&apos;m easy to reach.
          </p>

          <div className="mb-8 flex flex-wrap items-center justify-center gap-4">
            <a href={`mailto:${site.email}`} className="btn-accent">
              <Mail className="h-4 w-4" aria-hidden />
              {site.email}
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              <LinkedinIcon className="h-4 w-4" />
              LinkedIn
            </a>
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              <GithubIcon className="h-4 w-4" />
              GitHub
            </a>
          </div>

          {site.phone ? (
            <p className="mt-8 flex items-center justify-center gap-2 text-xs text-slate/70">
              <Phone className="h-3 w-3" aria-hidden />
              {/* Display keeps the readable formatting; the href strips everything but
                  digits and a leading + so dialers parse it reliably. */}
              <a
                href={`tel:${site.phone.replace(/[^\d+]/g, "")}`}
                className="font-mono transition-colors hover:text-light-slate"
              >
                {site.phone}
              </a>
            </p>
          ) : null}
        </div>
      </Reveal>
    </section>
  );
}
