# Design system

The page uses black, white, and silver surfaces with blue actions. Oversized sans
headings, centered introductions, rounded project cards, and generous spacing give
each section a clear hierarchy. The black hero uses original data-core artwork;
work, biography, and experience use light surfaces, while open source and contact
return to black.

## Tokens and Tailwind

`src/app/globals.css` declares the palette in `:root` and maps it into Tailwind v4
through `@theme inline`. Add both declarations when introducing a new color.
Components and decorative CSS illustrations use these tokens.

| Token | Value | Use |
| --- | --- | --- |
| `--paper` | `#ffffff` | White sections and light text |
| `--ink` | `#1d1d1f` | Headings and primary text |
| `--muted` | `#6e6e73` | Supporting text on light surfaces |
| `--line` | `#d2d2d7` | Dividers and borders |
| `--accent` | `#0071e3` | Blue buttons and links |
| `--accent-light` | `#2997ff` | Blue on dark surfaces and focus outlines |
| `--silver` | `#f5f5f7` | Secondary sections and cards |
| `--black` | `#000000` | Hero and dark feature sections |
| `--dark` | `#111112` | Dark navigation and supporting surfaces |
| `--on-dark` | `#f5f5f7` | Text on dark surfaces |
| `--dark-muted` | `#a1a1a6` | Supporting text on dark surfaces |
| `--blue-surface` | `#eaf3ff` | Pale blue project surfaces |
| `--violet` | `#8b5cf6` | Restrained decorative accent |

Translucent glass and border tokens support the sticky navigation bar. Older names
such as `--navy` and `--forest` remain compatibility aliases. Prefer
the descriptive current tokens for new styles.

## Typography and layout

The body uses the platform system sans font, with Geist Sans as a fallback. Geist
Mono remains available for technical details. Headings use tight tracking, a
semibold weight, and color emphasis. Keep
visitor-facing words in `src/content/site.ts`.

The shared `.section` shell caps content at 1200px and adjusts its gutters and vertical
spacing at smaller widths. The hero centers its copy above a large responsive image.
The navigation is a compact glass bar. Use section stylesheets for layouts specific
to work, biography, experience, and contact.

| Class | Purpose |
| --- | --- |
| `.section` | Shared section width and spacing |
| `.eyebrow` | Supporting section label |
| `.section-topline` | Label and supporting detail above a section |
| `.display-heading` | Large responsive sans heading |
| `.section-title` | Smaller section heading |
| `.card-lift` | Modest hover lift and border treatment |
| `.btn-accent` | Filled blue pill action |
| `.btn-ghost` | Secondary action |
| `.link-arrow` | Inline link with a directional icon |
| `.skip-link` | Keyboard shortcut to the main landmark |

## Motion

Use transform and opacity for movement. The hero image translates and scales slightly
as the visitor scrolls; it has no idle animation loop. Metrics render their final
values immediately. The hero copy has a short entrance rather than a typewriter.

`Reveal` provides a one-time entrance through an intersection observer and the Web
Animations API. It preserves semantic elements through `as` and leaves content visible
without JavaScript. Use short delays only where they help establish reading order.

The project gallery uses native horizontal scrolling and scroll snap. Previous/next
buttons advance by one card and disable at the track edges. Its cards and illustrations
are server-rendered; only scrolling controls need client state.

Reduced-motion preferences disable smooth scrolling, transitions, and animation,
reset the hero transform, and make gallery button scrolling immediate. See
[architecture](ARCHITECTURE.md#motion-and-reduced-motion) for implementation details.

## Accessibility

- Preserve visible focus outlines and the skip link.
- Name sections with `aria-labelledby` and give icon-only actions accessible labels.
- Keep decorative artwork and adjacent decorative icons `aria-hidden`.
- Preserve native mobile-dialog focus, Escape dismissal, and focus restoration.
- Preserve the Experience tablist's roles, panel associations, and keyboard controls.
- Keep the project gallery keyboard-focusable and its controls labelled.
- Announce clipboard success or failure through the contact status element.
- External links use `target="_blank" rel="noopener noreferrer"`.

## Artwork

`public/data-core.webp` is original artwork generated with the built-in OpenAI image
tool, not an employer infrastructure image. Next Image delivers it responsively.
The project illustrations are decorative CSS compositions. See
[visual assets](ASSETS.md) for the image-generation prompt and conversion details.
