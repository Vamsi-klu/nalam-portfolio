# Deployment

The site is hosted on Vercel at [nalamportfolio.dev](https://nalamportfolio.dev). There
is nothing custom about the pipeline — it's a stock Next.js project with zero
configuration, which is deliberate.

## What gets deployed

`next build` prerenders the whole site as static content:

```
Route (app)
┌ ○ /
└ ○ /_not-found

○  (Static)  prerendered as static content
```

There are no Server Actions, no route handlers, no dynamic rendering, and no runtime
data fetching, so every request is served from the CDN. Nothing in the app reads
`process.env`, so **there are no environment variables to configure** — a fresh import
builds and runs correctly with no setup.

Keep it that way if you can. Introducing a runtime dependency would turn a
CDN-only site into one with cold starts and a failure mode, for a portfolio that
changes a few times a year.

## First-time setup

1. Push the repository to GitHub.
2. Import it on Vercel. Framework preset, build command, output directory, and install
   command are all detected correctly — accept the defaults.
3. Add `nalamportfolio.dev` under **Settings → Domains** and follow the DNS
   instructions Vercel gives you.

After that, pushes to `main` deploy to production and pull requests get preview URLs
automatically.

## The domain is hardcoded

`src/app/layout.tsx` sets `metadataBase: new URL("https://nalamportfolio.dev")` and
repeats the domain in the OpenGraph block, and `site.domain` in
`src/content/site.ts` holds it a third time. Preview deployments therefore advertise the
production domain in their metadata, which is fine for a portfolio — crawlers should
never index a preview anyway — but it does mean a domain change requires editing all
three places.

## Node version

Next.js 16 requires Node.js 20.9 or newer; Vercel's current default satisfies this. If
you ever need to pin it, set it under **Settings → Node.js Version** rather than adding
an `engines` field, so local and CI behavior stay in sync with the platform.

## Analytics

`layout.tsx` mounts `<Analytics />` from `@vercel/analytics/next`, which enables Vercel
Web Analytics — pageviews and visitor counts, no cookies, no consent banner needed. It
only reports from deployments on Vercel, so you'll see nothing in local development;
that's expected, not a misconfiguration.

Enable Web Analytics for the project in the Vercel dashboard, otherwise the component
sends data nowhere. Note the import path is `@vercel/analytics/next`, not the bare
`@vercel/analytics` — the framework-specific entry point is what handles App Router
route tracking.

## Checks before pushing

`next build` stopped running ESLint in Next.js 16 and `next lint` was removed entirely,
so a broken lint rule will not fail the build. Run both locally:

```bash
npm run lint
npm run build
```

The build does still run TypeScript, so type errors will fail it.

Be aware that `npm run lint` currently reports one pre-existing error in
`AsciiPortrait.tsx` — see [`CONTRIBUTING.md`](../CONTRIBUTING.md#one-pre-existing-lint-error).
It does not block deploys, precisely because the build no longer lints.

## Local production preview

To check the real production output rather than the dev server:

```bash
npm run build
npm run start
```

This matters more than usual here, because the dev server and the production build
differ in ways that affect this site specifically — font loading, the static
prerender, and the timing of the canvas animations on a cold page load.

Since Next.js 16, `next dev` writes to `.next/dev` and `next build` writes to `.next`,
so the two no longer clobber each other and can run at the same time.
