import type { NextConfig } from "next";

/**
 * Next.js configuration — intentionally empty.
 *
 * The site is a single statically prerendered route with no remote images, no rewrites,
 * and no custom bundler needs, so the framework defaults are correct. Keeping this file
 * bare is a deliberate choice: every option added here is a behavior that has to be
 * remembered later.
 *
 * A few Next.js 16 notes for whoever does need to touch it:
 *
 * - Turbopack is the default bundler for both `next dev` and `next build`. Turbopack
 *   options live at the top level as `turbopack`, no longer under `experimental`.
 * - Defining a `webpack` config here makes `next build` fail, since the two bundlers
 *   would disagree. Opt out with the `--webpack` flag instead if that's ever needed.
 * - The `eslint` option was removed in 16; linting is a separate `npm run lint` step.
 *
 * @see node_modules/next/dist/docs/01-app/03-api-reference/05-config
 */
const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
