# Contributing

This is a personal portfolio, so "contributing" mostly means future-you or an AI agent
making a change without breaking the parts that are easy to break. Read
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) first if you haven't.

## Setup

```bash
npm install
npm run dev
```

Node.js 20.9+ is required by Next.js 16.

## Before you push

```bash
npm run lint
npm run build
```

`next build` runs TypeScript but **not** ESLint — Next.js 16 removed `next lint` and
dropped linting from the build — so the lint step is genuinely separate and easy to
forget.

### One pre-existing lint error

`npm run lint` currently exits non-zero on a clean checkout with exactly one error:

```
src/components/canvas/AsciiPortrait.tsx:143
  Avoid calling setState() directly within an effect  react-hooks/set-state-in-effect
```

You did not cause it. `eslint-config-next` 16 pulls in `eslint-plugin-react-hooks` v7,
which enables the React Compiler rule set — including `set-state-in-effect` — as errors.
`AsciiPortrait`'s reduced-motion branch calls `setStaticFallback(true)` and
`setReady(true)` synchronously in the effect body, which the new rule flags. Because
Next.js 16 also stopped running ESLint during `next build`, nothing surfaced it.

Treat "no *new* errors" as the bar until someone fixes it. The fix is to derive the
reduced-motion fallback during render instead of in an effect — `useSyncExternalStore`
over the media query is the idiomatic option — but it touches the most delicate
component in the repo, so do it as its own change with the portrait verified in both
motion modes.

## Making changes

**Content changes go in `src/content/site.ts`.** If you find yourself typing
user-visible prose into a `.tsx` file, stop and put it in `site.ts` instead. See
[`docs/CONTENT.md`](docs/CONTENT.md), and note the confidentiality rule: employer work
stays high-level, open-source work links to public diffs.

**Style changes go through the existing tokens and utility classes.** The palette lives
in `globals.css` as CSS custom properties mapped into Tailwind's theme. Don't introduce
raw hex values in components — see [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md).

**New components default to Server Components.** Add `"use client"` only when the
component actually needs state, effects, or browser APIs. If a mostly-static section
needs one animated wrapper, wrap the server-rendered children in `<Reveal>` rather than
making the whole section a Client Component.

**Anything animated needs a reduced-motion path.** Framer Motion code uses
`useReducedMotion()`; canvas code queries `window.matchMedia` directly. This is
non-negotiable — every existing animation honors it.

**Canvas work follows the established shape.** Per-frame state in `useRef`, never
`useState`. Cap DPR at 2. Return a cleanup function from the effect that cancels the
animation frame and removes every listener. An uncancelled `requestAnimationFrame` loop
keeps running after unmount and is the most likely way to introduce a leak here.

## Conventions

- Named exports for components (`export function About()`); default exports only in
  `layout.tsx` and `page.tsx`, where the framework requires them.
- Import through the `@/` alias, which maps to `src/`.
- Use `cn()` from `@/lib/utils` for conditional class names so `tailwind-merge` can
  resolve conflicting utilities.
- Prefer the shared icons in `@/components/ui/icons` over adding another local SVG copy.
- Follow the existing accessibility patterns: `aria-hidden` on decoration, `aria-label`
  on icon-only links, `rel="noopener noreferrer"` on external links.

## Adding a section

1. Create `src/components/sections/YourSection.tsx` with `<section id="your-id" className="section">`.
2. Add a `<h2 className="section-title">` — the `/` prefix and trailing rule come from CSS.
3. Put the copy in `src/content/site.ts`.
4. Render it in `src/app/page.tsx` in the right position.
5. Add `{ id: "your-id", label: "your-label" }` to the `nav` array, in the same position.

Step 5 is the one that gets missed. The `id` in `nav` must match the section's `id`
attribute exactly, or the anchor link and the sidebar scroll-spy both silently do
nothing.

## Working on Next.js internals

This project runs Next.js 16, which changed enough that older knowledge and most LLM
training data is wrong about it. Version-matched documentation ships inside the package
at `node_modules/next/dist/docs/`. Read the relevant page there before writing framework
code — that's the same instruction [`AGENTS.md`](AGENTS.md) gives agents, and it applies
to humans too.
