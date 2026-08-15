# Ramachandra Nalam — Portfolio

Dark, cinematic single-page personal portfolio for a Data Engineer brand, inspired by
[gazijarin.com](https://www.gazijarin.com/). Deployed at
[nalamportfolio.dev](https://nalamportfolio.dev).

The whole site is one route (`/`) made of anchored sections, plus two interactive
`<canvas>` pieces: an ASCII portrait that reacts to the pointer, and a data-pipeline
particle field.

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16.2.10, App Router, Turbopack (default in 16) |
| Language | TypeScript 5, `strict: true` |
| UI | React 19.2 |
| Styling | Tailwind CSS v4 via `@tailwindcss/postcss`, CSS custom properties |
| Motion | Framer Motion 12 |
| Icons | `lucide-react` plus a few hand-rolled SVGs |
| Analytics | `@vercel/analytics` |
| Lint | ESLint 9 flat config with `eslint-config-next` |

## Quickstart

Requires Node.js 20.9+ (Next.js 16 minimum).

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server (Turbopack; writes to `.next/dev`) |
| `npm run build` | Production build (Turbopack) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint — note `next lint` was removed in Next.js 16 |

`next build` no longer runs linting in Next.js 16, so run `npm run lint` explicitly
before pushing. Note that lint currently reports one pre-existing error in
`AsciiPortrait.tsx` — see
[`CONTRIBUTING.md`](CONTRIBUTING.md#one-pre-existing-lint-error).

## Project layout

```
src/
├── app/
│   ├── layout.tsx        Root layout: fonts, metadata, <Analytics />
│   ├── page.tsx          The only route — composes every section in order
│   ├── globals.css       Design tokens, Tailwind theme mapping, utility classes
│   └── favicon.ico
├── components/
│   ├── canvas/           AsciiPortrait, PipelineParticles (raw canvas, client-only)
│   ├── layout/           NavBar, SidebarNav, Footer
│   ├── motion/           Reveal — the shared scroll-in wrapper
│   ├── sections/         About, Builds, Contact, Experience, Hero, Impact, Oss, Work
│   └── ui/               icons.tsx — shared GithubIcon / LinkedinIcon
├── content/
│   └── site.ts           All copy and data. Single source of truth.
└── lib/
    └── utils.ts          cn() — clsx + tailwind-merge
public/                   profile.jpg and static SVGs
```

## Editing content

Nothing user-facing is hardcoded in components. Everything — bio, metrics, jobs,
projects, OSS pull requests, nav labels — lives in `src/content/site.ts`. Change copy
there and the sections pick it up.

The one editorial rule that matters: **employer-confidential detail stays off this
site.** Work descriptions deliberately stay high-level. See
[`docs/CONTENT.md`](docs/CONTENT.md) for the full data model and the confidentiality
policy.

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — rendering model, the server/client
  boundary, and how the canvas components work
- [`docs/CONTENT.md`](docs/CONTENT.md) — every export in `site.ts` and how to add
  entries
- [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md) — color tokens, typography, and the
  shared utility classes
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — Vercel setup, domain, and analytics
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — local workflow and the conventions to follow
- [`AGENTS.md`](AGENTS.md) — instructions for AI coding agents

## Deploy

Push to GitHub and import the repo on Vercel; the defaults for a Next.js project are
correct. Point `nalamportfolio.dev` at the project. Details in
[`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).
