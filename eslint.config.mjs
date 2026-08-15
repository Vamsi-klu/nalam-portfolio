/**
 * ESLint configuration (flat config).
 *
 * Next.js 16 removed the `next lint` command and stopped running ESLint during
 * `next build`, so linting is an independent step here: `npm run lint` invokes the
 * ESLint CLI directly. A rule violation will not fail a build — run lint yourself.
 *
 * `@next/eslint-plugin-next` defaults to flat config in v16, which is why this is
 * `eslint.config.mjs` rather than a legacy `.eslintrc`.
 *
 * ## Known standing failure
 *
 * `eslint-config-next` 16 pulls in `eslint-plugin-react-hooks` v7, which enables the
 * React Compiler rule set (`set-state-in-effect`, `purity`, `immutability`, and others)
 * as errors. One of those, `react-hooks/set-state-in-effect`, flags the reduced-motion
 * branch of `src/components/canvas/AsciiPortrait.tsx`, which predates the rule.
 *
 * So `npm run lint` exits non-zero on a clean checkout with exactly one error. Treat
 * "no *new* errors" as the bar until that component is reworked.
 *
 * @see CONTRIBUTING.md#one-pre-existing-lint-error
 */

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
