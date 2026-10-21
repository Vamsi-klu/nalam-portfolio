# Design system

The page uses black, white, and silver surfaces with blue actions. A sculptural 3D hero,
compact chapter headings, large work images, and rounded project cards establish
the hierarchy. Work, biography, and experience use light surfaces, while open source
and contact return to black.

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

The sans stack is `-apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial,
sans-serif`; technical details use system monospace fonts. No web fonts are loaded.
Headings use tight tracking, a semibold weight, and selective color emphasis. Keep
visitor-facing words in `src/content/site.ts`.

The shared `.section` shell caps content at 1200px and adjusts its gutters and vertical
spacing at smaller widths. The hero gives the artwork most of its initial stage,
with a separate portrait composition on mobile. Native scrolling advances from the
introduction to a centered story. Work uses wide image panels with summaries beneath
them. Chapter headings stay compact enough to keep the content in view. The navigation
is a compact glass bar. Use section stylesheets for layouts specific to the hero,
work, biography, experience, and contact.

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

Use transform and opacity for DOM movement. The hero pins its stage during native
scroll while the silver sculpture rotates and opens in 3D. The opening copy fades
early, leaving space for the geometry before the artwork dims and the second copy
stage appears. CSS scaling is limited to 1.06×; a thin progress line follows the
scene. The desktop track is `260svh - 52px`, shortened to `210svh - 52px` on phones.
Geometry settles toward the scroll position with 70ms damping and has no idle loop.
Work images gently pan and scale from 1.12× toward 1.02× as they cross the viewport.
Open-source counts render their final values immediately; the duplicate Impact strip is no
longer mounted.

`Reveal` provides a 600ms entrance through an intersection observer and the Web
Animations API, replaying after content fully exits and re-enters the viewport.
It preserves semantic elements through `as`, leaves content visible without
JavaScript, and keeps already-visible content visible during hydration. Keyboard
focus cancels any active entrance. Use short delays only where they help reading order.

The project gallery uses native horizontal scrolling and scroll snap. Previous/next
buttons advance by one card and disable at the track edges. Its cards and illustrations
are server-rendered; only scrolling controls need client state.

Reduced-motion preferences disable smooth scrolling, transitions, and animation.
The hero becomes a normal-flow sequence with both copy stages visible; the same layout
is used without scripting and on viewports at most 650px high. Work images remain at
1× without pan. Native preference listeners respond
while the page is open, canceling entrances and smooth gallery scrolling. Gallery
button actions then scroll immediately. See
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

The desktop and mobile hero images use a graphite-and-silver signal sculpture with
a dark aperture and restrained cobalt seams. Its bounded surfaces rotate and separate
in the live scene. The streaming story shows broad
bands converging into ordered flow; the platform story uses light layered data
strata. Broad surfaces, sparse detail, controlled edge lighting, and negative space
create hierarchy. Avoid miniature database icons, equally bright objects, and dense
glowing particle waves.

Art direction draws on Apple's product-page framing, FIELD's data-driven forms,
and FutureDeluxe's restrained lighting. Stripe and Snowflake references informed
information hierarchy. The current masters are original procedural geometry rendered
in Three.js, not representations of employer infrastructure. Studio light cards,
metal materials, and controlled reflections define the surfaces without image textures
or external HDR downloads. The live hero and its posters share a scene factory.

`signal-sculpture-4k.webp` and `signal-sculpture-mobile-4k.webp` supply the responsive
hero; `event-stream-4k.webp` and `warehouse-strata-4k.webp` supply the work stories.
The landscape masters are native 3840×2160; the portrait master is 3072×3840.
Lossless WebP preserves the rendered pixels. Hero uses `getImageProps` in a `<picture>`;
Work uses centered `object-fit: cover` Next Images. Both request quality 95 from the
Next.js optimizer, with responsive sizes accounting for their scale. The eager hero
poster remains visible until the optional WebGL2 scene has rendered a frame, and is
the fallback for reduced motion, data-saving mode, or a renderer failure. Runtime
canvas resolution is capped independently of the masters. Personal project
illustrations remain decorative CSS compositions.
On phones, the hero's upper mask reaches full opacity at 22% so its bright edge
does not compete with the opening heading; desktop retains the 8% fade.
See [visual assets](ASSETS.md) for render sources, dimensions, and reference provenance.
