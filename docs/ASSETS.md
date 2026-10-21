# Visual assets

The four images are original conceptual data-engineering artwork made with the built-in
OpenAI image-generation tool. A folded graphite-and-silver signal sculpture introduces
the page; converging event streams and three light data strata illustrate the work stories.
These are visual metaphors, not diagrams of an employer's infrastructure.

## Research and art direction

The references below were opened and visually inspected before generation on 2026-10-21.
Their lessons informed original compositions; reference images and brand assets are not
shipped with the portfolio.

| Primary reference | Applied lesson |
| --- | --- |
| [Apple MacBook Pro](https://www.apple.com/macbook-pro/) | A strong silhouette, controlled studio lighting, large imagery and meaningful black space. |
| [FIELD: IBM Think 2020](https://field.io/work/ibm-think-2020) | Broad parametric surfaces alternate with fine directional lines and quiet gaps. |
| [FIELD: IBM Generation](https://field.io/work/ibm-generation) | Convey data becoming organized through collective form rather than literal database icons. |
| [FutureDeluxe: Verizon](https://futuredeluxe.com/work/verizon) | Dark material mass and one illuminated edge give a sculpture visual weight. |
| [Found: IBM Optics](https://www.found-studio.com/work/ibm-optics/) | Macro framing, selective focus and directional light; its hardware subject was not adopted. |
| [Stripe Data Pipeline](https://stripe.com/data-pipeline) | Clear grouping, restrained connectors and generous spacing. |
| [Snowflake architecture](https://docs.snowflake.com/en/user-guide/intro-key-concepts) | Distinct layers communicate a hierarchy. |
| [Vercel Workflows](https://vercel.com/workflows) | One visual idea per panel and sparse accents keep the technical story readable. |

Two initial beaded-wave hero candidates were rejected as too close to generic data-wave
imagery. The selected hero instead uses broad satin layers, a strong aperture, restrained
blue seams and deeper shadow. The mobile image is a separate portrait recomposition.
The lakehouse image received framing and material refinements to match the final set.

## Files and rendering

| Asset | Native dimensions | Lossless source bytes |
| --- | --- | --- |
| `public/signal-fold-hero.webp` | 1672 × 941 | 849014 |
| `public/signal-fold-mobile.webp` | 1122 × 1402 | 735210 |
| `public/event-stream.webp` | 1672 × 941 | 1074458 |
| `public/warehouse-strata.webp` | 1672 × 941 | 1206904 |

The generated PNGs were converted to lossless WebP with Sharp, effort 6. No resizing,
cropping or artificial upscaling was applied. These lossless masters prevent an initial
lossy encoding step; browsers receive responsive Next Image output at quality 85.
The configuration explicitly permits qualities 75 and 85, retaining the default for
other imagery. Hero loading remains eager and high-priority; work images remain lazy.
The hero's maximum scroll enlargement is 1.16×, with the existing reduced-motion path.
Work images use centered cover crops; their responsive sizes include the cover width.

The prompts requested larger resolutions, but the tool returned the native dimensions
listed above. These are not 4K assets. Larger browser image requests cannot invent source
detail. The original profile photo and CSS project illustrations remain unchanged.
All four conceptual images have empty alternative text because adjacent page content
carries their meaning.

## Generation provenance and exact prompts

Local manifests under `output/imagegen/` preserve source metadata, reference roles,
conversion checks and discarded explorations. They are ignored development artifacts.
The original PNG paths below are machine-local provenance; the application consumes
only the four workspace files listed above.

### Desktop hero

- Mode: built-in image generation, `generate`.
- Output: `public/signal-fold-hero.webp`.
- Original PNG: `/root/.codex/generated_images/01a15c68-b690-70d3-89a1-af8dfaeda740/exec-a6acded9-7566-4bc0-ad27-ec15e2336f28.png`.
- Input reference: `output/playwright/references/field-think2020.jpg` (parametric surface language).
- Input reference: `output/playwright/references/futuredeluxe-verizon.jpg` (lighting, silhouette and material restraint).

Exact prompt:

```text
Use case: stylized-concept.
Asset: original premium data-engineer portfolio hero artwork, wide 16:9, requested native3840x2160 resolution.
Reference image1: ONLY the refined parametric surface language and deliberate gaps of FIELD's data art, not its composition, colors, typography or logos. Reference image2: ONLY monumental dark framing, satin materials, subtle light and bold sculptural silhouette. Create a completely new artwork.
Concept: a single sculptural DATA FOLD. Think of thousands of data channels compressed into thirty perfectly spaced, exceedingly thin satin-graphite lamellae. Together these flat ribbon-like layers twist through ONE asymmetric open fold, like an architectural paper study made at monumental scale. The band crosses from lower-left toward upper-right, turns once, and returns behind itself to create a generous teardrop-shaped aperture of absolute black. It must be a BROAD CONTINUOUS SURFACE with clean precisely ruled edges, not a bundle of wires, particle wave or loose strings.
At the forward fold, a narrow crisp silver-white edge reveals the stacked layers; a very restrained electric-blue illuminated seam runs through a few interior layers, suggesting a reliable data stream. The majority of the form is beautiful deep charcoal, soft satin silver and black. Broad calm untextured regions, exquisite controlled fine parallel edge detail. The form looks physically plausible and carefully art-directed, simultaneously mathematical and tactile.
Camera/light: close three-quarter macro photograph from slightly below the fold, 85mm lens feel, studio strip softbox outlining only one dominant ridge. Large purposeful shadow regions. No glowing fog, mirrored floor or surface reflections. Main focal edge sharply resolved, far layers gently out of focus. High contrast but subtle tonal gradients. Serious contemporary design-studio campaign image.
Framing: single complete sculptural form with asymmetrical balance, occupying central75% of image width and central70%height. Keep pureblack margins around the outer silhouette, especially bottom18%. Opaque seamless true-black background that blends into a black webpage.
Strict avoid: no dots, beads, ball chains, repeated wave humps, ocean wave, sound equalizer, infinity-loop symbol, yarn, neon tubes, stockbigdata illustration, glass-cylinder databases, cubes, charts, chips, laptops, gadgets, UI, words, symbols, logos, watermark, human, planet or rainbow. Do not show a copy of a reference. The output should be a singular iconic data sculpture with a bold quiet silhouette, not a busy diagram.
```

### Mobile hero

- Mode: built-in image generation, `edit`.
- Output: `public/signal-fold-mobile.webp`.
- Original PNG: `/root/.codex/generated_images/01a15c68-b690-70d3-89a1-af8dfaeda740/exec-a85bab54-70d2-447e-a927-c0295e5bc7d9.png`.
- Input reference: `/root/.codex/generated_images/01a15c68-b690-70d3-89a1-af8dfaeda740/exec-a6acded9-7566-4bc0-ad27-ec15e2336f28.png` (edit target, portrait recomposition).

Exact prompt:

```text
Use case: precise-object-edit.
Asset: portrait mobile hero for the same premium data-engineer portfolio. Output portrait4:5, native2048x2560 if supported.
Image1 is the EDIT TARGET. Preserve this exact sculptural language: broad layered satin-graphite lamellae, delicate parallel silver edges, one narrow restrained cobalt-blue seam, physically coherent fold, richblack negative space, one crisp white studio-lit ridge. No dots or beaded lines.
Change ONLY the composition to portrait. Recompose the complete single data-fold sculpture as a strong tall diagonal rising from bottom-left toward upper-right with ONE elongated open teardrop aperture through the center. Keep the essential broad twist fully visible within the central85%width; let only the two thin continuation tails approach the edges. Keep the single illuminated crest around the upper-middle and the foreground layers toward lower-middle. Leave approximately10%clear black above and12%below. A memorable bold silhouette and calm broad charcoal surfaces that are readable on a390px phone. Keep the exact materials, directional detail and silver/blue/black palette of the target. Keep the center of the aperture truly black.
Preserve the controlled studio light, sharp focal edges and gentle depth of field. No extra objects, no additional loops, no UI, words, letters, digits, logos, watermarks, infographic icons, cylinders, cubes, charts, laptops, chips, or stars. Opaque pureblack background. This is a purposeful vertical recomposition, not a horizontal crop or a stretched image.
```

### Streaming work story

- Mode: built-in image generation, `generate_with_visual_references`.
- Output: `public/event-stream.webp`.
- Original PNG: `/root/.codex/generated_images/01a15c6a-470c-7243-912f-d302d472ab8c/exec-df209fd2-d3bb-42c1-a894-8b4ddbdbe056.png`.
- Input reference: `/root/ram/coding/nalam-portfolio/output/playwright/references/futuredeluxe-verizon.jpg` (Lighting and camera reference only).
- Input reference: `/root/ram/coding/nalam-portfolio/output/playwright/references/field-think2020.jpg` (Material and line-hierarchy reference only).

Exact prompt:

```text
Use case: stylized-concept.
Asset type: original cinematic macro artwork for the streaming-data work story of a premium data-engineering portfolio. This must be a new artwork, not a recreation of either reference.
Reference image 1 is a lighting and camera reference only: monumental near-black surfaces, one precisely controlled white edge light, restrained tonal depth. Reference image 2 is a material and line-hierarchy reference only: broad quiet translucent planes alongside fine organized traces. Do not reproduce the reference shapes, typography, composition, or branding.
Primary subject: a macro view of THREE broad, thin signal bands converging at the center into ONE precisely aligned laminar flow. The streams are abstract information made spatial, not physical machinery. Each incoming band is a calm graphite-to-silver satin plane with extremely fine parallel channels and only a few discrete cobalt signal marks embedded within it. The bands approach at slightly different heights and angles, align through one elegant central fold, then continue as a single refined sheet of ordered channels. Make this convergence visually unmistakable, with generous black gaps between the incoming bands and one sharp focal ridge where they join.
Composition: landscape 16:9, requested native resolution 3072 by 1728 pixels or higher if supported. Close oblique camera with cinematic depth, focal convergence centered within the central 45 percent of the image so a portrait center crop remains meaningful. Broad material surfaces and a bold directional silhouette dominate; microdetail is subordinate. The channels lead into and out of the frame, but the central convergence is fully visible. Approximately one third of the frame is unlit deep-black negative space. The scene must feel monumental and carefully photographed, not like a small model on a tabletop.
Lighting and materials: physically convincing fine satin silver and dark translucent graphite, a single soft white strip reflection and a restrained cobalt seam. Crisp center, gentle depth-of-field falloff in the far foreground and far background. Large dark tonal intervals, controlled reflections, no glowing fog. Background opaque seamless near-black, with no visible floor, horizon, pedestal, or reflection plane.
Constraints: original abstract data-flow artwork. No repeated sine-wave hills, no symmetrical wave ocean, no beaded strings, no fiber-optic spaghetti or cable bundle, no rainbow, no glitter everywhere. No boxes, cylinders, servers, CPUs, chips, circuit boards, mechanical parts, arrow diagrams, charts, UI windows, fake screenshots, code, labels, text, numbers, letters, logos, watermarks, people, planets, or stars. Do not add broad empty blur in place of the central structure. Preserve clear directional ordering, three streams becoming one.
```

### Lakehouse work story — step 1

- Mode: built-in image generation, `generate`.
- Output: `public/warehouse-strata.webp`.
- Original PNG: `/root/.codex/generated_images/01a15c69-37a0-78b1-942b-5c899da0f076/exec-5ee8c010-b371-4413-9c3d-443fe444b77a.png`.
- Input reference: `/root/.codex/generated_images/01a15c68-b690-70d3-89a1-af8dfaeda740/exec-0dbf5de1-0295-403a-ae71-513b5a67f9ef.png` (visual reference).
- Input reference: `/root/ram/coding/nalam-portfolio/output/playwright/references/snowflake-architecture-original.png` (visual reference).
- Input reference: `/root/ram/coding/nalam-portfolio/output/playwright/references/stripe-warehouse-diagram.png` (visual reference).

Exact prompt:

```text
Use case: stylized-concept.
Asset type: original light-background editorial work-story artwork for a premium data-engineering portfolio.
Input images: image 1 is a STYLE AND PALETTE reference only: sophisticated fine silver data filaments, disciplined azure highlights and exceptional physical light. Image 2 is a HIERARCHY reference only: three clearly separated horizontal architectural levels. Image 3 is a SPACING reference only: precise grouping, very restrained connectors and generous negative space. Do not copy any reference logo, text, symbol, icon, diagram layout, branded content, or UI.
Primary request: create a new, visually sophisticated architectural sculpture of curated DATA STRATA. Exactly THREE broad, extremely thin planes made from fine ordered silver-white data lines and repeated short row marks. They are airy surfaces of aligned filaments rather than solid slabs. Separate the planes deliberately in a shallow, slightly staggered stack so every level reads clearly as part of one confident silhouette. The first layer is somewhat loosely ordered, the second precise parallel rows, and the third an exceptionally clean unified field. A very small number of fine azure paths travel between the levels, suggesting refinement of data. Their routing is controlled and minimal. Let the fine-line language echo the flowing hero reference while the overall form is calmer and architectural.
Scene and materials: seamless white to very light silver studio, soft matte surface, gentle contact shadows only. Silver-white linework, satin pale metal, a hint of translucent milky optical material, restrained azure accents. Elegant realistic lighting, precise shallow shadows between layers, immaculate anti-aliased edges, rich fine detail without clutter. No mirror reflection or glossy floor.
Composition: native 3072 by 1728 pixels, landscape 16:9. Restrained elevated three-quarter perspective. Keep the whole sculpture centered within the middle 62 percent of the canvas width and middle 68 percent of its height; generous clean margins. Strong readable three-level silhouette at phone scale. Broad planes with lightly softened corners, shallow depth, no chunky frames, no miniature side objects. Sophisticated editorial architectural abstraction rather than an infographic or a physical appliance.
Strict constraints: no cylinders, cubes, bar charts, charts of any kind, boxed toys, glass database objects, buildings, server racks, hardware, processors, motherboards, circuit boards, ports or cables. No text, letters, numbers, labels, logos, watermarks, screens, dashboards, fake UI or code. Exactly three data planes, with deliberate clean gaps. Opaque light background.
```

### Lakehouse work story — step 2

- Mode: built-in image generation, `edit`.
- Output: `public/warehouse-strata.webp`.
- Original PNG: `/root/.codex/generated_images/01a15c69-37a0-78b1-942b-5c899da0f076/exec-77174846-681c-4084-a041-6679f179f89e.png`.
- Input reference: `/root/.codex/generated_images/01a15c69-37a0-78b1-942b-5c899da0f076/exec-5ee8c010-b371-4413-9c3d-443fe444b77a.png` (visual reference).

Exact prompt:

```text
Use case: precise-object-edit.
Input image 1 is the EDIT TARGET.
Change ONLY the camera distance and framing. Preserve the exact three separated silver-white filament data strata, their elegant shallow waves, fine azure routes between levels, material detail, matte-white background, contact shadows, and lighting.
Pull the camera back so the ENTIRE sculpture, including all left and right tips of all THREE planes, fits inside the central 62 percent of the canvas width, approximately x19 percent to x81 percent, and the central 66 percent of its height. Keep it centered with generous clean white negative space at every edge. The planes must remain distinct and crisp with the same three-level silhouette. This image will be center-cropped on a phone, so the complete form needs those real side margins.
Keep landscape16:9. Preferred native output3072×1728 pixels; do not stretch or upscale the existing pixels. Preserve fine line detail through native rendering.
No additions or redesign: exactly three airy data planes, restrained blue connections, no text, labels, logos, cylinders, cubes, charts, hardware, fake UI, mirror floor, or other objects.
```

### Lakehouse work story — step 3

- Mode: built-in image generation, `edit`.
- Output: `public/warehouse-strata.webp`.
- Original PNG: `/root/.codex/generated_images/01a15c69-37a0-78b1-942b-5c899da0f076/exec-885f5383-0c5e-4175-8981-0fd90549f9a4.png`.
- Input reference: `/root/.codex/generated_images/01a15c69-37a0-78b1-942b-5c899da0f076/exec-77174846-681c-4084-a041-6679f179f89e.png` (visual reference).
- Input reference: `/root/.codex/generated_images/01a15c68-b690-70d3-89a1-af8dfaeda740/exec-a6acded9-7566-4bc0-ad27-ec15e2336f28.png` (visual reference).

Exact prompt:

```text
Use case: precise-object-edit.
Asset type: original light-background editorial lakehouse work-story artwork.
Input image 1 is the EDIT TARGET. Input image 2 is a MATERIAL-ONLY reference from the portfolio's selected hero. Use its calm satin silver surfaces, fine lamellar edge detail and minimal blue accent, but do not import its dark background or looped composition.
Change ONLY the surface language and material treatment of image 1. Preserve exactly THREE distinct architectural data layers, their hierarchy, generous white gaps, camera angle, centered placement and outer margins, white studio background, soft matte-floor contact shadow, and a few thin blue connections between levels.
Replace all beads, dots, pearl chains, point particles and busy luminous filaments with broad, calm, continuous satin-silver LAMELLAR DATA PLANES. Each level is a thin composed plane with very fine crisp parallel edge or row detail, like a meticulously machined architectural scale model. Use the restrained broad folded silver material of image 2. Three planes only: the upper plane may be slightly irregular, the middle more organized, the bottom exceptionally precise. Keep gentle low curvature and shallow depth; the three levels should feel architectural rather than fabric.
Reduce the azure to a very narrow seam and the few thin inter-layer routing lines. Almost no emitted glow: clean blue pigment or a tiny light seam, with physically convincing soft silver highlights. No sparkles, glitter, starbursts, beading, dots, glowing mesh, or cloth appearance. Fine row detail must support broad calm silhouettes rather than overpower them.
Lighting and composition invariants: opaque seamless white/light-silver background, restrained elegant studio light, readable separation between the three layers, strong centered silhouette at phone scale, same camera and generous side margins as image 1. No mirrored floor.
No cubes, cylinders, charts, hardware, servers, screens, fake UI, code, text, labels, numbers, logos, watermark or added objects. Keep landscape 16:9. Prefer native 3072 by 1728 pixels; do not upscale or stretch input pixels.
```
