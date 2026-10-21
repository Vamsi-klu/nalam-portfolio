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
| HeroVisual | Native pinned scroll scene around server-rendered artwork and copy |
| Reveal | Scroll entrance around server-rendered children |
| ProjectGallery | Native horizontal scrolling and previous/next card controls |
| Experience | Selected tab, keyboard navigation, and associated panels |
| CopyEmail | Clipboard interaction and accessible success/error feedback |

Hero stays a Server Component and uses `getImageProps` to build an eager, high-priority
`<picture>`. Screens up to 800px wide receive the portrait `/hero-mobile.webp`;
wider screens receive `/data-core.webp`. The browser selects an optimized source
for the active art direction. `HeroVisual` receives the image and both copy stages
as server-rendered children.

Work maps `streaming-analytics` and `aws-data-platform` to `/streaming-flow.webp` and
`/platform-architecture.webp`. Each story has a responsive Next Image above its
high-level summary and technology list. All four images are decorative conceptual
artwork; prompts and conversion details are in [visual assets](ASSETS.md). About
renders the real profile photo at `/profile.jpg`, with explicit dimensions and lazy
loading.

Pass server-rendered children into `Reveal` when a section needs an entrance effect.
Keep content in `src/content/site.ts`, including the `editorial` export for headings,
labels, and interaction messages.

## Motion and reduced motion

`HeroVisual` measures progress through a scroll track containing a sticky stage.
Bounded CSS variables fade the introduction, scale and dim the artwork, reveal the
second story, and advance a decorative progress line. Scrolling stays native.
An intersection observer limits updates to the nearby hero; scroll, resize, and
pageshow events schedule at most one pending animation frame. There is no idle loop
or per-frame React state. Cleanup removes listeners and cancels pending work.

Native media-query changes update the hero immediately. Under reduced motion,
without scripting, or in viewports at most 650px high, CSS presents artwork and both
copy stages in normal flow without pinning or transformations.

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
