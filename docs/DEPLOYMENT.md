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

- Check desktop and mobile layouts, long-page scrolling, and horizontal overflow.
- Follow the hero and navigation anchors; open and close the mobile menu with both
  pointer and keyboard, including Escape and focus restoration.
- Use the Experience tabs with Up/Down, Home, and End keys.
- Pause and resume the sculpture, then repeat with reduced motion enabled.
- Check the page with JavaScript disabled for visible content and usable links.
- Test email copying and its failure feedback, mail/social links, public PRs, and
  personal-project links. Keep unavailable destinations out of the interface.
- Inspect console errors, failed requests, canonical metadata, and image loading.

Fix issues, deploy the revised commit, and repeat the browser checks on that URL.
After production publication, repeat the smoke checks on the public production URL.

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
