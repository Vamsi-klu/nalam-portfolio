/**
 * Site footer — a single credit line.
 *
 * A Server Component with no state and no content dependency; the name is inlined here
 * rather than read from `site.ts` because it's a signature line rather than editorial
 * copy. It sits outside `<main>` in `page.tsx` and is pushed to the bottom by the flex
 * column set up in the root layout.
 */
export function Footer() {
  return (
    <footer className="border-t border-lightest-navy/40 py-10">
      <div className="mx-auto max-w-6xl px-5 text-center md:px-8">
        <p className="font-mono text-xs text-slate">
          Built &amp; designed by{" "}
          <span className="text-light-slate">Ramachandra Nalam</span>
        </p>
      </div>
    </footer>
  );
}
