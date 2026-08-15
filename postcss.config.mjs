/**
 * PostCSS configuration.
 *
 * Tailwind CSS v4 ships as a single PostCSS plugin and needs no companion `autoprefixer`
 * or `postcss-import` entry — it handles both internally. This one plugin is the whole
 * pipeline.
 *
 * There is deliberately no `tailwind.config.js` in this project. Under v4, the theme is
 * declared in CSS via the `@theme inline` block in `src/app/globals.css`, which is where
 * the palette, fonts, and design tokens live.
 *
 * @see src/app/globals.css
 * @see docs/DESIGN-SYSTEM.md
 */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
