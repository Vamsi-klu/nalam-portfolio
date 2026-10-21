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
| NavBar | Compact glass header and native mobile navigation dialog |
| HeroVisual | Scroll-linked transform around the server-rendered hero image |
| Reveal | Scroll entrance around server-rendered children |
| ProjectGallery | Native horizontal scrolling and previous/next card controls |
| Experience | Selected tab, keyboard navigation, and associated panels |
| CopyEmail | Clipboard interaction and accessible success/error feedback |

Hero stays a Server Component and passes an eager, high-priority Next Image into `HeroVisual`.
The decorative image is `/data-core.webp`; its original generation prompt and
conversion details are in [visual assets](ASSETS.md). Impact prints the final metric
values immediately. About renders the real profile photo at `/profile.jpg`, with
explicit dimensions and lazy loading.

Pass server-rendered children into `Reveal` when a section needs an entrance effect.
Keep content in `src/content/site.ts`, including the `editorial` export for headings,
labels, and interaction messages.

## Motion and reduced motion

`HeroVisual` measures the hero's position on scroll and resize, then writes a bounded
`--hero-progress` CSS variable. CSS uses it for a small translation and scale of the
image. Events are batched through `requestAnimationFrame`; there is no continuous
animation loop or per-frame React state. Reduced-motion preferences reset progress
to zero, including when the preference changes while the page is open. Cleanup
cancels the pending frame and removes listeners.

`Reveal` uses `IntersectionObserver` and the Web Animations API for a single fade and
16px entrance. Content is visible in the server HTML and remains visible without
JavaScript. Its `as` prop preserves the requested element in every motion mode.
Cleanup disconnects the observer and cancels an active animation.

The global reduced-motion media query disables CSS animation, transitions, and smooth
scrolling. `useReducedMotion()` also prevents JavaScript entrances and makes gallery
button scrolling immediate.

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
live in `src/components/sections/profile.css` and `work.css`. See the
[design system](DESIGN-SYSTEM.md) for the palette and shared classes.

`AsciiPortrait`, `PipelineParticles`, and `SidebarNav` are retained legacy components,
not part of the mounted page. The existing `AsciiPortrait` lint error remains a separate
baseline issue. The old typewriter dependency is still installed but is not used by
Hero. The section barrel is unused; page composition imports components directly.
