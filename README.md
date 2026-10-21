# Ramachandra Nalam portfolio

A personal portfolio for a Data Engineer, built around a light editorial layout,
public open-source contributions, and a small animated SVG sculpture. The production
URL is [nalam-portfolio.vercel.app](https://nalam-portfolio.vercel.app).

The site has one static route. Its sections introduce the work, link to public pull
requests and personal projects, then cover background, experience, and contact.
There is no application backend or chat assistant.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16.2.10 App Router, React 19.2, TypeScript |
| Styling | Tailwind CSS v4, CSS custom properties, Geist fonts |
| Motion | CSS transforms and the Web Animations API; Framer Motion reduced-motion hook |
| Interaction | Native dialog navigation, keyboard tabs, clipboard button |
| Analytics | Vercel Web Analytics |
| Validation | ESLint 9 and the Next.js production build |

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

## Project layout

```text
src/app/                 Route composition, metadata, fonts, global styles
src/components/layout/   Navigation and footer
src/components/motion/   Reveal and DataSculpture
src/components/sections/ Page sections, CopyEmail, section stylesheets
src/components/ui/       Shared icons
src/components/canvas/   Legacy canvas components, not mounted
src/content/site.ts      Identity, copy, projects, PRs, navigation, canonical URL
src/lib/utils.ts         Conditional class-name helper
public/                  Profile photo and static assets
```

`page.tsx` renders Hero, Impact, Work, Oss, Builds, About, Experience, and Contact,
with a sticky navigation bar and footer. The legacy sidebar is not mounted.

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
- [Content](docs/CONTENT.md): content exports and editorial policy.
- [Deployment](docs/DEPLOYMENT.md): Vercel configuration and browser checks.
- [Contributing](CONTRIBUTING.md): local workflow and conventions.
- [Agent instructions](AGENTS.md): repository instructions.
