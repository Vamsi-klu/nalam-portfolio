# Architecture

The portfolio has one Next.js App Router page, prerendered from TypeScript content.
There is no database, API route, Server Action, application data fetch, or chat
assistant. Client components handle only interaction and motion.

## Page composition

`src/app/page.tsx` renders a skip link, `NavBar`, the main landmark, and `Footer`.
The main content is ordered as follows:

```text
Hero → Work → Oss → Builds → About → Experience → Contact
```

Each section has a stable anchor. Navigation labels and destinations come from
`nav` in `src/content/site.ts`; its order follows the page. `Impact` and `SidebarNav`
remain in the repository but are not mounted. The separate metrics strip has been
removed; open-source counts appear in Oss.

`layout.tsx` exports metadata, imports global styles, and mounts Vercel Analytics.
Typography uses local system fonts, with Helvetica Neue and Arial fallbacks; there
is no web-font import. Canonical and OpenGraph URLs use `site.domain`. The profile
photo supplies the social preview image, and `public/brand.svg` supplies the icon.

## Server and client components

| Component | Rendering responsibility |
| --- | --- |
| Hero, Work, Oss, Builds, About, Contact, Footer | Server-rendered content and layout |
| NavBar | Compact glass header and native mobile navigation dialog |
| HeroVisual | Native pinned scroll progress around server-rendered artwork and copy |
| SignalSculpture | Deferred WebGL scene, frame scheduling, resolution cap, and static fallback |
| WorkVisual | Scroll-driven image scale and pan around server-rendered work artwork |
| Reveal | Scroll entrance around server-rendered children |
| ProjectGallery | Native horizontal scrolling and previous/next card controls |
| Experience | Selected tab, keyboard navigation, and associated panels |
| CopyEmail | Clipboard interaction and accessible success/error feedback |

Hero stays a Server Component and uses `getImageProps` to build an eager, high-priority
`<picture>`. Screens up to 800px wide receive `/signal-sculpture-mobile-4k.webp`;
wider screens receive `/signal-sculpture-4k.webp`. Both request quality 95, and the
browser selects a responsive optimized source for the active art direction. `HeroVisual`
receives the image and both copy stages as server-rendered children. The decorative
`SignalSculpture` canvas overlays the poster only after its first successful render.

Work maps `streaming-analytics` and `aws-data-platform` to `/event-stream-4k.webp` and
`/warehouse-strata-4k.webp`. Each story has a responsive Next Image at quality 95 with
a centered cover crop, above its high-level summary and technology list. `WorkVisual`
adds a small scroll pan without creating additional WebGL contexts. The artwork
depicts a folded signal sculpture, converging streams, and layered data strata;
these are abstract concepts, not employer architecture diagrams. The three landscape
masters are native 3840×2160 renders; the portrait master is 3072×3840.
`next.config.ts` allows qualities 75 and 95, preserving the default for other images.
Render sources and native dimensions are in [visual assets](ASSETS.md). About renders
the real profile photo at `/profile.jpg`, with explicit dimensions and lazy loading.

Pass server-rendered children into `Reveal` when a section needs an entrance effect.
Keep content in `src/content/site.ts`, including the `editorial` export for headings,
labels, and interaction messages.

## Motion and reduced motion

`HeroVisual` measures progress through a scroll track containing a sticky stage.
The track is `260svh - 52px` on desktop and `210svh - 52px` at widths up to 800px.
Bounded CSS variables fade the introduction over progress 0.06–0.24, scale the
artwork from 1× to 1.06×, dim it over 0.54–0.76, and reveal the second story over
0.64–0.80. A decorative line follows progress. A `signal-progress` event sends the
same scroll position to the 3D scene, which rotates and separates the sculpture's
surfaces. Scrolling stays native and reverses the sequence when moving back up.
An intersection observer limits updates to the nearby hero; scroll, resize, and
pageshow events schedule at most one pending animation frame. There is no idle loop
or per-frame React state. Cleanup removes listeners and cancels pending work.

`SignalSculpture` waits for the poster to decode before dynamically importing the
scene and Three.js. Initialization is deferred and requires a visible document and
artwork, normal motion, a viewport taller than 650px, and no reported data-saving
preference. A WebGL2 context is required. The ready attribute is applied only after
a successful frame; initialization errors or context loss leave the poster visible.
The scene factory in `src/lib/signal-scene.ts` also renders the offline hero masters,
so geometry, camera framing, and materials have one source.

Canvas state stays in refs. Geometry progress follows the scroll target with 70ms
exponential damping and stops rendering when it settles. Intersection and document
visibility changes stop pending frames. The backing buffer is capped at DPR 2 and
four million pixels on desktop or two million at widths up to 800px; the 4K poster
does not imply a 4K runtime buffer. Resize updates the renderer and camera. Reduced
motion, short viewports, and unmount release the scene's GPU resources; unmount also
removes observers, listeners, and the initialization timer.

`WorkVisual` uses native scroll position to move each static image a few pixels and
reduce its scale from 1.12× toward 1.02×. Pan is bounded by the available overfill so
the panel cannot expose an image edge. It schedules updates only while the panel
and document are visible, with no idle loop or per-frame React state.

Native media-query changes update the hero immediately. Under reduced motion,
without scripting, or in viewports at most 650px high, CSS presents artwork and both
copy stages in normal flow without pinning or transformations. Reduced motion also
returns work images to a static 1× scale. Data-saving or unavailable WebGL retains
the poster while the ordinary scroll layout remains usable.

`Reveal` uses `IntersectionObserver` and the Web Animations API for a 600ms fade and
16px entrance. It prepares offscreen content and replays the entrance after that
content fully leaves and re-enters the viewport. Content already visible at hydration
stays visible. Server HTML remains visible without JavaScript, and `as` preserves
the requested element in every mode. Focus entering the element cancels an animation
so keyboard users can see the focused content.

The global reduced-motion media query disables CSS animation, transitions, and smooth
scrolling. Reveal and ProjectGallery subscribe to native preference changes as well
as using `useReducedMotion()` for their initial fallback. A live change cancels Reveal
animations and halts smooth gallery scrolling; subsequent gallery actions are
immediate. Observers, animation objects, and preference listeners are cleaned up.

## Offline artwork pipeline

`npm run render:artwork` runs `scripts/artwork/render.mjs`. It serves the shared hero
scene and `scripts/artwork/work-scene.mjs` locally, captures each scene in Playwright
at native canvas dimensions with pixel ratio 1, and encodes lossless WebP through
Sharp. The tool verifies dimensions and decoded pixel equality and records output
hashes. PNG evidence and manifests go to ignored `output/artwork-4k/`; final WebP
masters go to `public/`. `--preview` writes smaller review images only to the output
directory. Neither mode resizes a lower-resolution render to produce a larger one.
This pipeline runs offline; the deployed Work sections use optimized images only.

## Navigation and contact

The compact sticky header uses ordinary anchor links. Below the desktop breakpoint,
its menu opens a native `<dialog>` with modal focus behavior and Escape dismissal.
It locks background scrolling while open and closes after selection or a switch to
desktop width. Selecting a destination moves focus to its heading; dismissing the
dialog restores focus to the visible menu trigger.

Experience uses a horizontal ARIA tablist with roving focus, Left/Right, Up/Down,
Home, and End keys. Each tab controls a labelled panel; inactive panels are inert
and hidden from assistive technology. The card keeps a stable height across tabs.

Builds passes server-rendered project cards into `ProjectGallery`. The track scrolls
natively, with buttons that advance by a card and disable at the track edges. Contact
offers direct links and a separate `CopyEmail` component; clipboard errors leave the
visible address available.

## Styles and retained files

Global tokens and shared layout live in `src/app/globals.css`. Section-specific styles
live in `src/components/sections/hero.css`, `profile.css`, and `work.css`. See the
[design system](DESIGN-SYSTEM.md) for the palette and shared classes.

`AsciiPortrait`, `PipelineParticles`, and `SidebarNav` are retained legacy components,
not part of the mounted page. The existing `AsciiPortrait` lint error remains a separate
baseline issue. The old typewriter dependency is still installed but is not used by
Hero. The section barrel is unused; page composition imports components directly.
