# Deployment

The existing Vercel project `nalam-portfolio` is connected to
`Vamsi-klu/nalam-portfolio`. Its production branch is `main` and public URL is
[nalam-portfolio.vercel.app](https://nalam-portfolio.vercel.app). Use this project for
previews and production updates.

## Build configuration

Use the Next.js framework preset and the repository's standard commands. The project
uses Node.js 24 on Vercel; local Next.js 16 development requires Node.js 20.9 or newer.

```bash
npm ci
npm run lint
npm run build
```

The page is designed for static prerendering. It has no application API, database,
Server Actions, chat assistant, or required application environment variables.
Vercel Analytics is the only included analytics integration.

Next.js builds check TypeScript but do not run ESLint. The unused
`AsciiPortrait.tsx` has one pre-existing `react-hooks/set-state-in-effect` error;
record it separately and check that changes introduce no additional errors. These
commands are a validation procedure, not a record of a completed deployment.

Commit the four lossless WebP sources in `public/`: `signal-sculpture-4k.webp`,
`signal-sculpture-mobile-4k.webp`, `event-stream-4k.webp`, and `warehouse-strata-4k.webp`.
The application requests responsive optimized variants at quality 95;
`next.config.ts` allows both 75 and 95. Verify deployed optimizer responses and source
files, since source quality alone does not establish delivered image quality.

## Reproducing native artwork

Artwork generation is a local authoring step. Vercel builds use the committed WebP
masters and do not require a browser installation. After `npm ci`, install Chromium
for Playwright or set `CHROME_PATH` to an existing Chrome executable:

```bash
npx playwright install chromium
npm run render:artwork -- --preview
npm run render:artwork
```

Review the smaller preview first. The full command renders the desktop hero and two
work images at 3840×2160 and the portrait hero at 3072×3840, directly from original
geometry. It writes lossless WebP to `public/` and PNG evidence plus a manifest to
ignored `output/artwork-4k/`. The tool asserts native canvas dimensions and verifies
that decoded WebP pixels match the PNG; no upscaling step is involved. Retain the
manifest with review evidence and commit the source geometry, capture tool, and
resulting WebP files together. See [visual assets](ASSETS.md) for provenance.

The hero poster and live WebGL renderer share `src/lib/signal-scene.ts`. The Work
scene in `scripts/artwork/work-scene.mjs` is used only for offline images. A native
4K master lets the browser select a suitable responsive variant; it does not force
every visitor to download or draw at 4K resolution.

## Canonical URL and metadata

`site.domain` in `src/content/site.ts` is the URL source of truth. `layout.tsx` uses
it for `metadataBase`, the canonical link, and OpenGraph URLs. Preview builds retain
the production canonical URL. The profile photo supplies the social image.

To adopt another domain, first configure and verify it in the same Vercel project,
then update `site.domain`. A metadata change alone does not configure DNS or attach a
domain to a deployment.

## Preview and browser checks

Use a branch preview before publishing to production. The Git integration has
previously created branch previews; verify that a new deployment points to the
intended commit and reaches `READY`. Protected deployment URLs may require a Vercel
session or temporary share link. Do not commit or publish authentication links.

Test every deployed revision in a real browser:

The committed audit scripts can run against a local production server or a deployment:

```bash
AUDIT_URL=http://localhost:3000 npm run verify:portfolio
AUDIT_URL=http://localhost:3000 npm run verify:motion
```

They use Playwright's installed Chromium by default; `CHROME_PATH` selects an
existing Chrome binary. `AUDIT_LABEL` names reports under ignored
`output/playwright/`. `AUDIT_CASES` optionally filters motion checks by a regular
expression. The motion audit records WebGL capability first and explicitly labels
software rendering; it does not establish performance on physical GPUs. Keep
temporary authenticated URLs in environment variables, out of committed files.

Complete the automated checks with visual review:

- Check desktop and mobile layouts, long-page scrolling, and horizontal overflow.
- Follow the hero and navigation anchors; open and close the mobile menu with both
  pointer and keyboard, including Escape, trigger focus restoration, and destination
  heading focus after selection.
- Use the Experience tabs with arrow keys, Home, and End; check that only the active
  panel is reachable and the card does not jump in height.
- Scroll the personal-project gallery by touch, keyboard, and its previous/next
  controls; check both ends of the track.
- Scroll through the hero at the start, rotation/opening phase, copy transition,
  end, and on scrolling back. Confirm actual geometry changes, consistent progress,
  and a clean handoff from the poster to the canvas. Check the 1.06× maximum CSS
  scale and the work-image pan for sharp detail and no exposed image edges.
- Test cold and live reduced-motion changes, short viewports, reported data-saving
  mode, unavailable WebGL, and context loss. Static artwork and readable content
  must remain available. Check resize across portrait/desktop layouts and verify
  the canvas backing-buffer caps: DPR 2, four million pixels on desktop, two million
  on phones. Confirm frames stop after settling, offscreen, and in a hidden document.
- Check that mobile loads the portrait hero composition and that centered work-image
  crops retain the streaming convergence and layered strata. Inspect optimized image
  loading, dimensions, and quality at desktop and phone pixel densities.
- Check the page with JavaScript disabled for visible content and usable links.
- Test email copying and its failure feedback, mail/social links, public PRs, and
  personal-project links. Keep unavailable destinations out of the interface.
- Inspect console errors, failed requests, canonical metadata, and image loading.

Fix issues, deploy the revised commit, and repeat the browser checks on that URL.
After production publication, repeat the smoke checks on the public production URL.
Measure Lighthouse on that exact deployment with other browser jobs stopped, then
measure active scroll frame timing separately. Load scores do not establish how
smooth the 3D interaction is. Record the URL, commit, viewport, device scale, motion
preference, and browser version with captures and performance reports.

## Local production preview and analytics

```bash
npm run build
npm run start
```

Inspect the production build as well as the development server, especially fonts,
responsive layout, and initial motion. Next.js keeps development output in
`.next/dev` and production output in `.next`.

`layout.tsx` mounts `Analytics` from `@vercel/analytics/next`. Enable Web Analytics
in the Vercel project dashboard to receive deployment pageviews. Local development
is not evidence that production analytics are configured.
