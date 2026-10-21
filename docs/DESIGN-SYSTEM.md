# Design system

The page uses warm paper, dark green text, fine rules, and generous spacing. Large
headings pair Geist Sans with italic serif emphasis. Work and open-source sections
carry the main visual weight; decorative motion stays in the hero SVG.

## Tokens and Tailwind

`src/app/globals.css` declares the palette in `:root` and maps it into Tailwind v4
through `@theme inline`. Add both declarations when introducing a new color. Components
use these tokens, including the SVG gradient stops.

| Token | Value | Use |
| --- | --- | --- |
| `--paper` | `#f8f7f4` | Page background |
| `--ink` | `#242c27` | Headings and primary text |
| `--muted` | `#626a60` | Supporting text |
| `--line` | `#dedfd7` | Dividers and borders |
| `--accent` | `#2b6654` | Links, focus, emphasis |
| `--sage` | `#dfe5d7` | Soft green surfaces |
| `--sand` | `#e9dfcf` | Warm secondary surfaces |
| `--forest` | `#173d31` | Dark feature surfaces |
| `--on-forest` | `#eef2e8` | Text on forest surfaces |
| `--clay` | `#bd6444` | Small decorative accents |

The `--sculpture-*` variables define the SVG's green gradient. Older names such as
`--navy` and `--slate` remain compatibility aliases; they no longer describe a dark
page theme. Prefer the descriptive current tokens for new styles.

## Typography and layout

Geist Sans is the body and heading font. Geist Mono is reserved for compact labels,
indices, and technical details. Italic emphasis uses the system Georgia serif stack.
Keep visitor-facing words in `src/content/site.ts`.

The shared `.section` shell caps content at 1280px and adjusts its gutters and vertical
spacing at smaller widths. The hero has its own two-column composition, collapsing
for mobile. Use section stylesheets for layouts specific to work, biography,
experience, and contact.

| Class | Purpose |
| --- | --- |
| `.section` | Shared section width and spacing |
| `.eyebrow` | Small uppercase monospace label |
| `.section-topline` | Label and supporting detail above a section |
| `.display-heading` | Large responsive heading with serif emphasis |
| `.section-title` | Smaller section heading |
| `.card-lift` | Modest hover lift and border treatment |
| `.btn-accent` | Filled primary action |
| `.btn-ghost` | Text-based secondary action |
| `.skip-link` | Keyboard shortcut to the main landmark |

## Motion

Use transform and opacity for movement. The sculpture floats on a slow CSS cycle and
has a pause/resume control. Metrics and hero text render in their final state.

`Reveal` provides a one-time entrance through an intersection observer and the Web
Animations API. It preserves semantic elements through `as` and leaves content visible
without JavaScript. Use short delays only where they help establish reading order.

Reduced-motion preferences disable smooth scrolling, transitions, and animation.
The sculpture's motion control is hidden when motion is disabled. See
[architecture](ARCHITECTURE.md#motion-and-reduced-motion) for implementation details.

## Accessibility

- Preserve visible focus outlines and the skip link.
- Name sections with `aria-labelledby` and give icon-only actions accessible labels.
- Keep decorative sculpture elements and adjacent decorative icons `aria-hidden`.
- Preserve native mobile-dialog focus, Escape dismissal, and focus restoration.
- Preserve the Experience tablist's roles, panel associations, and keyboard controls.
- Announce clipboard success or failure through the contact status element.
- External links use `target="_blank" rel="noopener noreferrer"`.
