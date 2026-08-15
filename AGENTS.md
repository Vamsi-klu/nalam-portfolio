<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project: Ramachandra Nalam portfolio

Dark, cinematic single-page portfolio for a Data Engineer, deployed at
nalamportfolio.dev. Next.js 16 App Router, TypeScript, Tailwind v4, Framer Motion, plus
two hand-written `<canvas>` animations. One route, fully static, no backend.

Detailed docs live in [`docs/`](docs/) — [`ARCHITECTURE.md`](docs/ARCHITECTURE.md),
[`CONTENT.md`](docs/CONTENT.md), [`DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md),
[`DEPLOYMENT.md`](docs/DEPLOYMENT.md). Read the relevant one before a non-trivial change.

## Commands

```bash
npm install
npm run dev     # Turbopack, writes to .next/dev
npm run lint    # ESLint flat config — `next lint` no longer exists
npm run build   # runs TypeScript, does NOT run ESLint
```

Run `npm run lint` and `npm run build` before finishing. The build won't catch lint
errors for you.

**`npm run lint` already fails on a clean checkout**, with exactly one pre-existing
error — `react-hooks/set-state-in-effect` at `AsciiPortrait.tsx:143`, from the React
Compiler rules that `eslint-plugin-react-hooks` v7 turns on. You didn't cause it. The
bar is "no *new* errors"; don't get stuck trying to reach a clean run, and don't fold a
fix for it into an unrelated change.

## Rules that matter here

**Content lives in `src/content/site.ts`, not in components.** Bio, metrics, jobs,
projects, OSS pull requests, and nav labels are all constants there. Never hardcode
user-visible copy into a `.tsx` file.

**Employer-confidential detail stays off this site.** Descriptions of work at Meta,
Amazon, and University at Buffalo are deliberately high-level — technology and problem
shape only, never internal metrics, product names, or org detail. Do not add
specificity to employer work. Open-source entries are the opposite: every PR must link
to a real, public, verifiable diff.

**Server Components are the default.** Add `"use client"` only for state, effects, or
browser APIs. When a static section needs one animation, wrap its server-rendered
children in `<Reveal>` instead of converting the whole section to a Client Component.

**Every animation needs a reduced-motion path.** React-driven motion uses
`useReducedMotion()` from Framer Motion; canvas code queries
`window.matchMedia("(prefers-reduced-motion: reduce)")` directly because it runs outside
React. All existing animations honor this. Match them.

**Canvas code has a fixed shape.** Per-frame state in `useRef`, never `useState`. Cap
DPR at `Math.min(devicePixelRatio, 2)`. The effect must return a cleanup that cancels
the `requestAnimationFrame` and removes every listener.

**Colors come from tokens.** The palette is CSS custom properties in
`src/app/globals.css`, mapped into Tailwind's theme by the `@theme inline` block. No raw
hex in components. Adding a color requires both a `:root` declaration and a
`@theme inline` mapping. The accent `#00c7b7` is additionally hardcoded in the two
canvas files, which can't read CSS variables — change all three together.

**Use the shared utility classes** — `.section`, `.section-title`, `.card-lift`,
`.btn-accent`, `.btn-ghost`, `.skill-bullet` — before writing new CSS.

**Raw `<img>` is intentional for the profile photo.** `/profile.jpg` is sampled
pixel-by-pixel by `AsciiPortrait`, so it can't go through the image optimizer. The
`@next/next/no-img-element` disables in `About.tsx` and `AsciiPortrait.tsx` are
deliberate. Use `next/image` for any new image that doesn't touch a canvas.

**Adding a section takes five steps, and the fifth is the one that gets missed:** create
the component, give it `id` + `className="section"`, put copy in `site.ts`, render it in
`page.tsx`, and add a matching `{ id, label }` to the `nav` array. The `nav` id must
equal the section's `id` attribute or both the anchor link and the sidebar scroll-spy
silently break.

## Conventions

- Named exports for components; default exports only in `layout.tsx` and `page.tsx`.
- Import via the `@/` alias (→ `src/`).
- `cn()` from `@/lib/utils` for conditional classes.
- Prefer `@/components/ui/icons` over adding another inline SVG.
- Decoration gets `aria-hidden`; icon-only links get `aria-label`; external links get
  `target="_blank" rel="noopener noreferrer"`.

## Known quirks — don't "fix" these by accident

- `src/components/sections/index.ts` is a partial barrel exporting four of eight
  sections, and nothing imports it. `page.tsx` imports sections directly.
- `PipelineParticles` is complete but mounted nowhere.
- `education` in `site.ts` is exported but unused, as is `site.resumeUrl` (which points
  at a `public/resume.pdf` that doesn't exist).
- `public/profile-photo.jpg` is unreferenced; only `/profile.jpg` is used.
- `impact` is a rendered section deliberately absent from `nav`.
- `GithubIcon` is defined three times and `LinkedinIcon` twice, in two different visual
  styles (stroked outlines in `ui/icons.tsx`, solid brand glyphs in `Builds`/`Contact`).
