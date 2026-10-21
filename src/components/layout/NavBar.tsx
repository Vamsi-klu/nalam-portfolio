"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight, Menu, X } from "lucide-react";
import { editorial, nav, site } from "@/content/site";

export function NavBar() {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const destination = useRef<string | null>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 801px)");
    const onChange = () => {
      if (query.matches) dialog.current?.close();
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);
  const close = () => dialog.current?.close();
  return (
    <header className="site-header">
      <nav className="main-nav" aria-label={editorial.navigation.label}>
        <a
          href="#intro"
          className="wordmark"
          aria-label={editorial.navigation.home}
        >
          {editorial.brand}
        </a>
        <span className="brand-name">{site.shortName}</span>
        <ul className="desktop-nav">
          {nav
            .filter((item) => item.id !== "intro" && item.id !== "contact")
            .map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`}>{item.label}</a>
              </li>
            ))}
        </ul>
        <a href="#contact" className="nav-contact">
          {editorial.navigation.contact}
        </a>
        <button
          ref={trigger}
          type="button"
          className="menu-toggle"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={editorial.navigation.open}
          onClick={() => {
            dialog.current?.showModal();
            setOpen(true);
          }}
        >
          <Menu size={24} aria-hidden="true" />
        </button>
      </nav>
      <dialog
        ref={dialog}
        id="mobile-navigation"
        className="mobile-dialog"
        aria-label={editorial.navigation.label}
        onClose={() => {
          setOpen(false);
          if (destination.current) {
            const heading = document
              .getElementById(destination.current)
              ?.querySelector<HTMLElement>("h1, h2");
            if (heading) {
              heading.tabIndex = -1;
              heading.focus({ preventScroll: true });
            }
            destination.current = null;
          } else if (trigger.current?.offsetParent) {
            trigger.current.focus({ preventScroll: true });
          }
        }}
      >
        <button
          type="button"
          className="menu-close"
          onClick={close}
          aria-label={editorial.navigation.close}
        >
          <X size={25} aria-hidden="true" />
        </button>
        <nav aria-label={editorial.navigation.label}>
          <ul>
            {nav.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={() => {
                    destination.current = item.id;
                    close();
                  }}
                >
                  {item.label}
                  <ChevronRight size={20} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </dialog>
    </header>
  );
}
