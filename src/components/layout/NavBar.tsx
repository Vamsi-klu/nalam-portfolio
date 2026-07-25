"use client";

import { useEffect, useState } from "react";
import { Mail, Menu, X } from "lucide-react";
import { nav, site } from "@/content/site";
import { cn } from "@/lib/utils";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";

export function NavBar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled || open
          ? "bg-[rgba(10,25,47,0.85)] backdrop-blur-md shadow-[0_10px_30px_-10px_var(--navy-shadow)]"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:h-18 md:px-8">
        <a
          href="#intro"
          className="font-mono text-lg font-semibold tracking-tight text-accent transition-opacity hover:opacity-80"
          onClick={close}
        >
          RN
        </a>

        <ul className="hidden items-center gap-7 md:flex">
          {nav.map((item, i) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="group font-mono text-[13px] text-light-slate transition-colors hover:text-accent"
              >
                <span className="mr-1 text-accent/80">
                  {String(i + 1).padStart(2, "0")}.
                </span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-4 md:flex">
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-light-slate transition-colors hover:text-accent"
          >
            <GithubIcon size={18} />
          </a>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-light-slate transition-colors hover:text-accent"
          >
            <LinkedinIcon size={18} />
          </a>
          <a
            href={`mailto:${site.email}`}
            aria-label="Email"
            className="text-light-slate transition-colors hover:text-accent"
          >
            <Mail size={18} strokeWidth={1.75} />
          </a>
        </div>

        <button
          type="button"
          className="relative z-50 flex h-10 w-10 items-center justify-center text-accent md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <div
        className={cn(
          "fixed inset-0 z-40 flex flex-col items-center justify-center gap-10 bg-[rgba(10,25,47,0.97)] backdrop-blur-lg transition-all duration-300 md:hidden",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        )}
        aria-hidden={!open}
      >
        <ul className="flex flex-col items-center gap-6">
          {nav.map((item, i) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={close}
                className="font-mono text-lg text-lightest-slate transition-colors hover:text-accent"
              >
                <span className="mr-2 text-accent">
                  {String(i + 1).padStart(2, "0")}.
                </span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-6">
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-light-slate transition-colors hover:text-accent"
            onClick={close}
          >
            <GithubIcon size={22} />
          </a>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-light-slate transition-colors hover:text-accent"
            onClick={close}
          >
            <LinkedinIcon size={22} />
          </a>
          <a
            href={`mailto:${site.email}`}
            aria-label="Email"
            className="text-light-slate transition-colors hover:text-accent"
            onClick={close}
          >
            <Mail size={22} strokeWidth={1.75} />
          </a>
        </div>
      </div>
    </header>
  );
}
