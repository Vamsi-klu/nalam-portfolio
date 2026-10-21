# Architecture

The portfolio has one Next.js App Router page, prerendered from TypeScript content.
There is no database, API route, Server Action, application data fetch, or chat
assistant. Client components handle only interaction and motion.

## Page composition

`src/app/page.tsx` renders a skip link, `NavBar`, the main landmark, and `Footer`.
The main content is ordered as follows:

```text
Hero → Impact → Work → Oss → Builds → About → Experience → Contact
```

Each section has a stable anchor. Navigation labels and destinations come from
`nav` in `src/content/site.ts`; its order follows the page. Impact has no navigation
entry. `SidebarNav` remains in the repository but is not mounted.

`layout.tsx` loads Geist Sans and Geist Mono, exports metadata, imports global styles,
and mounts Vercel Analytics. Canonical and OpenGraph URLs use `site.domain`. The profile
photo supplies the social preview image, and `public/brand.svg` supplies the icon.

## Server and client components

| Component | Rendering responsibility |
| --- | --- |
| Hero, Impact, Work, Oss, Builds, About, Contact, Footer | Server-rendered content and layout |
| NavBar | Scroll treatment and native mobile navigation dialog |
| DataSculpture | Decorative SVG with pause/resume state and reduced-motion support |
| Reveal | Scroll entrance around server-rendered children |
| Experience | Selected tab, keyboard navigation, and associated panels |
| CopyEmail | Clipboard interaction and accessible success/error feedback |

Hero stays a Server Component and mounts `DataSculpture` as a small client island.
Impact prints the final metric values immediately. About renders the real profile photo
at `/profile.jpg`, with explicit dimensions and lazy loading.

Pass server-rendered children into `Reveal` when a section needs an entrance effect.
Keep content in `src/content/site.ts`, including the `editorial` export for headings,
labels, and interaction messages.

## Motion and reduced motion

`DataSculpture` draws an SVG using palette variables. CSS animates its transform;
there is no canvas loop or per-frame React state. A button pauses and resumes the
motion. Reduced-motion preferences stop the animation and hide that control.

`Reveal` uses `IntersectionObserver` and the Web Animations API for a single fade and
16px entrance. Content is visible in the server HTML and remains visible without
JavaScript. Its `as` prop preserves the requested element in every motion mode.
Cleanup disconnects the observer and cancels an active animation.

The global reduced-motion media query disables CSS animation, transitions, and smooth
scrolling. `useReducedMotion()` also prevents the JavaScript entrance effect.

## Navigation and contact

The sticky header uses ordinary anchor links. Below the desktop breakpoint, its menu
opens a native `<dialog>` with modal focus behavior and Escape dismissal. It locks
background scrolling while open, closes after selection or a switch to desktop width,
and restores focus to its trigger.

Experience uses a vertical ARIA tablist with roving focus, Up/Down, Home, and End keys.
Each tab controls a labelled panel. Contact offers direct links and a separate
`CopyEmail` component; clipboard errors leave the visible address available.

## Styles and retained files

Global tokens and shared layout live in `src/app/globals.css`. Section-specific styles
live in `src/components/sections/profile.css` and `work.css`. See the
[design system](DESIGN-SYSTEM.md) for the palette and shared classes.

`AsciiPortrait`, `PipelineParticles`, and `SidebarNav` are retained legacy components,
not part of the mounted page. The existing `AsciiPortrait` lint error remains a separate
baseline issue. The old typewriter dependency is still installed but is not used by
Hero. The section barrel is unused; page composition imports components directly.
