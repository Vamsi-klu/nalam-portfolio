# Design system

The visual language is a dark navy palette with a single teal accent, monospace for
anything technical or numeric, and sans for prose. It's defined entirely in
`src/app/globals.css` — there is no `tailwind.config.js`, because Tailwind v4 is
configured in CSS.

## How Tailwind v4 is wired up

`globals.css` starts with `@import "tailwindcss"` and then does two distinct things.

First, `:root` declares plain CSS custom properties — the raw palette. Second, the
`@theme inline` block maps those properties onto Tailwind's theme namespace, which is
what generates utility classes. A variable named `--color-navy` in `@theme inline` is
what makes `bg-navy`, `text-navy`, and `border-navy` exist.

```css
:root {
  --navy: #0a192f;
}

@theme inline {
  --color-navy: var(--navy);   /* now bg-navy / text-navy / border-navy work */
}
```

Adding a color takes both steps. Declaring it only in `:root` gives you something usable
via `var()` in raw CSS but no Tailwind utility; declaring it only in `@theme inline`
skips the indirection that lets the raw value be referenced from canvas code and
gradients.

## Palette

| Token | Value | Tailwind utility | Role |
|-------|-------|------------------|------|
| `--dark-navy` | `#020c1b` | `dark-navy` | Deepest background |
| `--navy` | `#0a192f` | `navy` | Page background |
| `--light-navy` | `#112240` | `light-navy` | Card surfaces |
| `--lightest-navy` | `#233554` | `lightest-navy` | Borders, dividers, hover fill |
| `--slate` | `#8892b0` | `slate` | Body text |
| `--light-slate` | `#a8b2d1` | `light-slate` | Emphasized body text |
| `--lightest-slate` | `#ccd6f6` | `lightest-slate` | Headings |
| `--white` | `#e6f1ff` | `white-soft` | Highest contrast |
| `--accent` | `#00c7b7` | `accent` | Teal — links, numbers, highlights |

Two tokens exist only as raw CSS variables and have no utility class: `--accent-tint`
(`rgba(0, 199, 183, 0.1)`, the accent at 10% for button hover fills) and `--navy-shadow`
(`rgba(2, 12, 27, 0.7)`, used by the NavBar's scrolled shadow). Reference them with
`var()` — including inside arbitrary-value utilities, as `NavBar` does with
`shadow-[0_10px_30px_-10px_var(--navy-shadow)]`.

Note the accent utility is `white-soft`, not `white` — Tailwind already ships a `white`,
so the token is deliberately renamed to avoid shadowing it.

The accent hex `#00c7b7` is hardcoded in two more places that CSS can't reach: as the
`ACCENT` constant in `PipelineParticles.tsx` and as the `"0, 199, 183"` RGB triple in
`AsciiPortrait.tsx` (a triple, so alpha can be interpolated per particle). Canvas
drawing happens outside the cascade, so it can't read the variable. Changing the accent
means changing all three.

## Typography

Two fonts are loaded in `layout.tsx` through `next/font/google` and exposed as CSS
variables, then mapped in `@theme inline` to `--font-sans` and `--font-mono`:

- **Geist Sans** (`font-sans`, the body default) — prose, headings, descriptions.
- **Geist Mono** (`font-mono`) — the technical voice of the site. Used for nav labels,
  section counters, metric numbers, tech-stack lists, buttons, timestamps, and the
  `/` section-title marker.

The rule of thumb the existing components follow: if it's a sentence, it's sans; if it's
a label, a number, a piece of jargon, or a filename, it's mono.

Canvas text can't use the CSS variable reliably, so `AsciiPortrait` falls back to an
explicit stack (`ui-monospace, SFMono-Regular, Menlo, monospace`).

## Shared utility classes

`globals.css` defines seven component classes. These are the shared vocabulary — reach
for them before writing new CSS.

**`.section`** — the standard section shell: `max-width: 1000px`, centered, `100px 24px`
of padding that tightens to `72px 20px` below 768px. Every section except `Hero` uses
it; `Hero` is full-viewport-height and does its own layout with Tailwind utilities.

**`.section-title`** — the section heading. A teal `/` is injected via `::before` and a
1px rule extends to the right via `::after`, so the markup is just the text:

```tsx
<h2 className="section-title">selected work</h2>
```

Section headings are lowercase throughout ("about me", "where I've worked", "what's
next"). Keep that voice.

**`.card-lift`** — the hover treatment for cards: a 6px rise plus a background shift to
`--lightest-navy`, on a `cubic-bezier(0.645, 0.045, 0.355, 1)` curve. Pair it with
`rounded border border-lightest-navy bg-light-navy` for the standard card, as `Work`
and `Builds` do.

**`.btn-accent`** — the primary button: teal outline, transparent fill, monospace label,
tinted background and 2px rise on hover. **`.btn-ghost`** is the secondary: no border,
`--light-slate` text that goes teal on hover.

**`.intro-cursor`** — the 2px blinking caret after the Hero headline.

**`.skill-bullet`** — prefixes a list item with a teal `▹` via `::before`. Used for
skills and experience bullets.

## Motion

Transitions are short (0.2s–0.3s for interaction, ~0.55s for entrances) and mostly ease
out. Scroll entrances go through the shared `Reveal` component rather than bespoke
Framer Motion props — a 20px rise and fade, `once: true`, with a `-40px` viewport
margin. Stagger a list by passing an index-scaled `delay`:

```tsx
{items.map((item, i) => (
  <Reveal key={item.id} delay={0.06 * (i + 1)} as="article">
    ...
  </Reveal>
))}
```

The `as` prop picks the rendered element (`div`, `li`, `section`, `article`) so the
wrapper doesn't break list or landmark semantics. One caveat: under reduced motion
`Reveal` returns a plain `<div>` regardless of `as`, so a `<Reveal as="li">` inside a
`<ul>` becomes a `<div>` child of `<ul>`. It renders fine but is technically invalid
HTML; worth fixing if you touch that code.

Everything animated needs a reduced-motion path — see
[`ARCHITECTURE.md`](ARCHITECTURE.md#motion-and-reduced-motion).

## Accessibility conventions

The existing components are consistent about this, so match them:

- Decorative elements — glow divs, gradient blobs, the blinking cursor, icons that sit
  next to a text label — get `aria-hidden`.
- Icon-only links carry an `aria-label` (`aria-label="GitHub"`, `` aria-label={`${item.title} on GitHub`} ``).
- Sections that need naming use `aria-labelledby` pointing at their `<h2>` id.
- The `Experience` tabs implement the full ARIA tabs pattern: `role="tablist"`,
  `role="tab"` with `aria-selected` and `aria-controls`, `role="tabpanel"` with
  `aria-labelledby`, and roving `tabIndex` so only the selected tab is in the tab order.
- Every external link carries `target="_blank" rel="noopener noreferrer"`.
- `AsciiPortrait` gets `role="img"` and a descriptive `aria-label`, since a canvas is
  otherwise opaque to screen readers. `PipelineParticles` is purely decorative and is
  `aria-hidden`.
