# Architecture

This is a single-route Next.js App Router site. There is no database, no API route, no
`fetch` at runtime, and no dynamic rendering. Every byte of content is a TypeScript
constant that gets prerendered into static HTML at build time. The interesting
engineering is all on the client: two `<canvas>` animations and a scroll-driven
navigation system.

## Route tree

There is exactly one route.

```
src/app/
├── layout.tsx    Root layout (Server Component)
├── page.tsx      / (Server Component)
├── globals.css
└── favicon.ico
```

`layout.tsx` does four things: loads the Geist and Geist Mono fonts through
`next/font/google` and exposes them as the `--font-geist-sans` / `--font-geist-mono`
CSS variables, exports the static `metadata` object, sets up the flex column that pins
the footer to the bottom, and mounts `<Analytics />` from `@vercel/analytics/next`.

`page.tsx` is pure composition — it renders the chrome and then the eight sections in
display order:

```
NavBar → SidebarNav → main( Hero · About · Impact · Experience · Work · Oss · Builds · Contact ) → Footer
```

Adding a section means creating the component, adding it to `page.tsx`, and adding an
entry to the `nav` array in `src/content/site.ts` so both navigations pick it up.

## The server/client boundary

Server Components are the default and most of the page stays on the server. A component
only opts into `"use client"` when it genuinely needs browser state or APIs.

**Server Components** — `layout`, `page`, `About`, `Work`, `Oss`, `Builds`, `Contact`,
`Footer`. These are static markup driven by `site.ts`.

**Client Components** — `NavBar` (menu state, scroll listener), `SidebarNav`
(IntersectionObserver), `Hero` (typing animation), `Impact` (count-up on scroll),
`Experience` (tab state), `Reveal` (viewport-triggered motion), `AsciiPortrait` and
`PipelineParticles` (canvas and pointer events).

The pattern that makes this work is passing server-rendered children into a client
wrapper. `About` is a Server Component, but it wraps its paragraphs in `<Reveal>`, which
is a Client Component. The paragraphs are still rendered on the server and handed to
`Reveal` as an already-rendered `children` slot, so the client bundle only carries the
animation wrapper, not the content. Follow this shape rather than marking whole
sections `"use client"` to get one animation.

## Motion and reduced motion

Every animated surface has a reduced-motion path, and there are three separate
mechanisms because the animations live in three different places.

1. **React-driven motion** uses `useReducedMotion()` from Framer Motion. `Reveal`
   returns a plain `<div>` with no animation props when it's on. `Hero` skips the
   typing animation and renders the final string. `Impact` renders the final metric
   instead of counting up. `Experience` drops the `layoutId` shared-element indicator.
2. **CSS animation** is neutralized by the `@media (prefers-reduced-motion: reduce)`
   block in `globals.css`, which clamps every animation and transition to `0.01ms` and
   switches `scroll-behavior` back to `auto`.
3. **Canvas animation** sits outside React's render cycle, so both canvas components
   query `window.matchMedia("(prefers-reduced-motion: reduce)")` directly.
   `PipelineParticles` also subscribes to `change` on that media query so toggling the
   OS setting starts or stops the loop live; `AsciiPortrait` swaps to a static `<img>`.

If you add motion anywhere, wire up the matching opt-out. It is a hard requirement in
this codebase, not a nice-to-have.

## Canvas components

Both live in `src/components/canvas/` and share the same skeleton: a `useEffect` that
grabs the 2D context, caps the device pixel ratio at 2 (`Math.min(devicePixelRatio, 2)`)
to avoid pathological fill rates on high-DPI screens, drives a `requestAnimationFrame`
loop, and returns a cleanup function that cancels the frame and removes every listener.
Mutable per-frame state is held in `useRef`, never `useState`, so the animation loop
never triggers a React re-render.

### `AsciiPortrait`

Renders `/profile.jpg` as a field of drifting ASCII characters.

The image is drawn once to an offscreen canvas at the target size, then
`getImageData` samples it on a grid — the column step is `fontSize * 0.7` and the row
step is `fontSize * 1.1`, which compensates for the fact that monospace glyphs are
taller than they are wide. Each sample's brightness picks a character out of the ramp
`" .:-=+*#%@"`, darkest to lightest, and sets that particle's base alpha. Samples that
are nearly transparent or nearly black are dropped.

Those raw samples are cached per size in a ref, so a resize back to a size already seen
skips the expensive image processing. Each particle then starts scattered up to a few
hundred pixels from its target and is pulled home by a spring whose strength ramps up
over the first 2.5 seconds, with a staggered per-particle delay so the portrait
assembles rather than snapping. The pointer repels particles inside a radius of 20% of
the canvas, and particles settle and freeze once they stop moving and nothing is
interacting.

Font size drops from 7px to 5px below 280px wide, and the canvas size itself is
computed by `calcSize` from the window width. Reduced motion or a failed image load
both fall back to a static `<img>`.

That fallback path is also where the repo's one standing lint error lives — it sets
state synchronously inside an effect, which the React Compiler rules now flag. See
[`CONTRIBUTING.md`](../CONTRIBUTING.md#one-pre-existing-lint-error).

### `PipelineParticles`

Draws an Extract → Transform → Serve pipeline: dashed guide rails, a node circle per
stage, arrows between stages, monospace labels, and particles streaming left to right
with gradient trails. Particles hold a lane (`baseY`), drift back toward it, are repelled
by the pointer within 90px, and wrap around to the left edge with a fresh lane offset when
they exit the right. Particle count scales with canvas area, floored at 28. A
`ResizeObserver` on the parent element re-derives dimensions and repopulates the field.

**This component is currently not mounted anywhere.** It is complete and working but
`page.tsx` doesn't render it. Drop it into a section as an absolutely-positioned
background layer when you want it; it sizes itself to its parent, so the parent needs
`position: relative` and a real height.

## Navigation

The `nav` array in `site.ts` is the single source for both navigations, and both derive
their labels and hrefs from it, so a new entry appears in both automatically.

`NavBar` is fixed to the top. It tracks `window.scrollY > 12` to fade in a translucent
backdrop and shadow, and it owns a full-screen mobile overlay that locks `body` scroll
while open. `SidebarNav` is the vertical rail on large screens; an `IntersectionObserver`
with `rootMargin: "-35% 0px -45% 0px"` narrows the trigger band to roughly the middle
fifth of the viewport, and the entry with the highest intersection ratio wins.

Note that `impact` is a rendered section but is deliberately absent from `nav`, so it
has no nav link and the sidebar doesn't highlight it while you scroll through it.

Because the site is one route, all navigation is anchor-based. `globals.css` sets
`html { scroll-behavior: smooth }`. Next.js 16 stopped overriding `scroll-behavior`
during router navigations unless you set `data-scroll-behavior="smooth"` on `<html>` —
that override is irrelevant here since there are no router navigations, so smooth
anchor scrolling just works.

## Images

The site intentionally uses raw `<img>` for the profile photo rather than `next/image`,
with a targeted `// eslint-disable-next-line @next/next/no-img-element` at each site
(`About.tsx` and the `AsciiPortrait` fallback). The reason is that the same file is fed
to a canvas via `getImageData`, which needs a predictable, unprocessed URL — the
optimizer's transformed output would defeat the pixel sampling. If you add a decorative
image that never touches a canvas, use `next/image` and drop the escape hatch.

## Metadata

`layout.tsx` exports a static `metadata` object with `metadataBase`, OpenGraph, and
Twitter fields. There is no `opengraph-image` file, so despite
`twitter.card: "summary_large_image"` the share cards currently render without an image.
Adding `src/app/opengraph-image.tsx` (or a static `opengraph-image.png`) would fix that;
see `node_modules/next/dist/docs/01-app/01-getting-started/14-metadata-and-og-images.md`.

## Conventions worth knowing

- The `@/*` path alias maps to `./src/*`. Use it; there are no deep relative imports in
  this codebase.
- `cn()` in `src/lib/utils.ts` composes `clsx` and `tailwind-merge`. Use it whenever
  class names are conditional so later Tailwind utilities correctly override earlier
  ones.
- Sections are named exports (`export function About()`), not default exports. Only
  `layout.tsx` and `page.tsx` use default exports, because the framework requires it.
- `src/components/sections/index.ts` is a partial barrel that only re-exports four of
  the eight sections, and nothing imports it — `page.tsx` imports each section directly.
  Import directly and treat the barrel as vestigial.
- `GithubIcon` is defined three times (`ui/icons.tsx`, `Builds.tsx`, `Contact.tsx`) and
  `LinkedinIcon` twice, in two different visual styles: the `ui/icons.tsx` pair are
  stroked Lucide-style outlines sized by a `size` prop, while the copies inside
  `Builds` and `Contact` are solid filled brand glyphs sized by a `className`. Prefer
  `@/components/ui/icons` for new work.
