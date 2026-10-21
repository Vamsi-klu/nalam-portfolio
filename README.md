# Ramachandra Nalam portfolio

A personal portfolio for a Data Engineer, with a black 3D hero, white and silver
sections, blue actions, and public open-source contributions. Native scrolling rotates
and opens a silver signal sculpture before revealing the introduction's second stage.
Original procedural artwork also depicts converging event streams and light data strata.
The production URL is
[nalam-portfolio.vercel.app](https://nalam-portfolio.vercel.app).

The site has one static route. Its sections introduce the work, link to public pull
requests and personal projects, then cover background, experience, and contact.
There is no application backend or chat assistant.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16.2.10 App Router, React 19.2, TypeScript |
| Styling | Tailwind CSS v4, CSS custom properties, system sans with Helvetica Neue and Arial fallbacks |
| Images | Native 4K procedural renders, responsive hero art direction via `getImageProps`, Next Image work stories |
| Motion | Deferred Three.js hero, native scroll progress, Web Animations API entrances, live reduced-motion support |
| Interaction | Native dialog navigation, scrolling project gallery, keyboard tabs, clipboard button |
| Analytics | Vercel Web Analytics |
| Validation | ESLint 9, Next.js production build, real-browser interaction and motion audits |
| Artwork tools | Three.js geometry, Playwright capture, Sharp lossless WebP encoding |

Artwork masters are rendered directly at 3840×2160, with a 3072×3840 portrait hero,
and saved as lossless WebP. Next.js serves responsive variants at quality 95. The
hero's CSS zoom is capped at 1.06×; its 3D geometry changes with scroll position.
The eager poster remains available when motion or WebGL is unavailable. Runtime
canvas resolution is capped at DPR 2 and four million pixels on desktop or two
million on phones. See [visual assets](docs/ASSETS.md) for dimensions and provenance.

## Local development

Requires Node.js 20.9 or newer.

```bash
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). Use `npm run build` followed by
`npm run start` to inspect production output. Run `npm run lint` separately;
Next.js builds check TypeScript but do not run ESLint.

The unused `AsciiPortrait.tsx` component has a pre-existing
`react-hooks/set-state-in-effect` lint error. Report it separately from new errors.

With a production server running, verify navigation, keyboard controls, responsive
images, and WebGL motion and fallbacks:

```bash
npx playwright install chromium
npm run verify:portfolio
npm run verify:motion
```

Set `AUDIT_URL` to test a deployment and `CHROME_PATH` to use an existing Chrome
binary. Reports and screenshots go to ignored `output/playwright/`. See
[deployment checks](docs/DEPLOYMENT.md) for the visual and performance review.

## Reproducing the artwork

Install Playwright's Chromium once, or set `CHROME_PATH` to an existing Chrome binary.
The preview command writes smaller review renders to ignored `output/artwork-4k/`;
the full command replaces the four native-resolution WebP masters in `public/`.

```bash
npx playwright install chromium
npm run render:artwork -- --preview
npm run render:artwork
```

The capture tool renders original geometry directly at the requested canvas size,
checks the encoded pixels against the PNG, and records dimensions and hashes in a
manifest. No upscaling is used. The hero poster and live hero share the same scene
factory. Browser capture is an offline authoring step, not part of the Vercel build.

## Project layout

```text
src/app/                 Route composition, metadata, global styles
src/components/layout/   Navigation and footer
src/components/motion/   Reveal, HeroVisual, SignalSculpture, WorkVisual
src/components/sections/ Page sections, ProjectGallery, CopyEmail, section stylesheets
src/components/ui/       Shared icons
src/components/canvas/   Legacy canvas components, not mounted
src/content/site.ts      Identity, copy, projects, PRs, navigation, canonical URL
src/lib/utils.ts         Conditional class-name helper
src/lib/signal-scene.ts   Shared live/offline hero geometry and renderer
scripts/artwork/         Native artwork capture and work-story geometry
scripts/verify-*.mjs     Real-browser interaction and motion audits
public/                  Profile photo, native 4K artwork masters, static assets
```

`page.tsx` renders Hero, Work, Oss, Builds, About, Experience, and Contact, with a
sticky navigation bar and footer. The legacy sidebar and separate Impact metric
strip are not mounted; open-source counts appear within Oss.

## Content and deployment

Edit visitor-facing copy in `src/content/site.ts`. Keep employer work high-level and
non-confidential. Every featured open-source contribution must link to a real public
PR. Personal project links are optional; omit private repositories and unavailable
demos instead of linking visitors to errors.

The existing Vercel project is connected to `Vamsi-klu/nalam-portfolio`, with `main`
as its production branch. Use a preview deployment for review and browser testing
before publishing changes. Canonical metadata reads from `site.domain`.

## Documentation

- [Architecture](docs/ARCHITECTURE.md): rendering, component boundaries, navigation.
- [Design system](docs/DESIGN-SYSTEM.md): palette, typography, layout, motion.
- [Visual assets](docs/ASSETS.md): artwork provenance, render sources, and dimensions.
- [Content](docs/CONTENT.md): content exports and editorial policy.
- [Deployment](docs/DEPLOYMENT.md): Vercel configuration and browser checks.
- [Contributing](CONTRIBUTING.md): local workflow and conventions.
- [Agent instructions](AGENTS.md): repository instructions.
