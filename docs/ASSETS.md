# Visual assets

The four hero and work-story images are original conceptual data-engineering artwork
created with the built-in OpenAI image-generation tool. They depict databases,
tabular datasets, streaming records, transformations, and analytics outputs. These
are illustrative dataflows, not documentation of an employer’s infrastructure.
The artwork contains no borrowed brand imagery or logos.

Hero uses `getImageProps` inside a `<picture>` to select the portrait image at widths
up to 800px and the landscape image above that breakpoint. Work uses responsive
Next Image components. These images are decorative, with empty alternative text.
The original `public/profile.jpg` remains the portrait source; personal-project
illustrations are CSS compositions.

All four selected PNGs were converted with Sharp to WebP at quality 88 and effort 6.
Conversion preserves dimensions and aspect ratio without resizing, cropping, or
stretching. The source paths below identify local originals; only the WebP assets
in `public/` are needed by the application. Manifests under `output/imagegen/` are
ignored local artifacts.

| Asset | Dimensions | Bytes |
| --- | --- | --- |
| `public/data-pipeline-hero.webp` | 1672 × 941 | 112048 |
| `public/data-pipeline-mobile.webp` | 1122 × 1402 | 89002 |
| `public/streaming-pipeline.webp` | 1672 × 941 | 93938 |
| `public/lakehouse-architecture.webp` | 1672 × 941 | 131968 |

## Desktop hero

- Output: `public/data-pipeline-hero.webp`, 1672 × 941, 112048 bytes.
- Manifest: `output/imagegen/data-pipeline-hero-manifest.json`.

### Generation

- Mode: `generate`.
- Original PNG: `/root/.codex/generated_images/01a15c68-b690-70d3-89a1-af8dfaeda740/exec-94f5a50f-b8ee-460b-bc8a-7c03b87e912b.png` (1672 × 941, 1387620 bytes).
- Reference images: none.

Exact prompt:

```text
Use case: stylized-concept.
Asset type: original landscape hero artwork for an elegant data engineer portfolio.
Primary request: portray DATA ENGINEERING as a beautifully crafted three-dimensional data pipeline. On a seamless pure-black studio stage, a compact isometric system connects recognizable database cylinders and small stacks of tabular data sheets on the left, a branching directed workflow of translucent square transformation nodes in the center, and a refined columnar data warehouse with a small clean analytics bar arrangement on the right. Thin luminous blue paths carry evenly spaced rectangular data records through the stages, visibly joining and splitting before resolving into ordered rows. Make the connections and organization the subject: a clear visual journey from raw data to trusted analytics.
Style: premium photorealistic 3D editorial illustration, precise optical glass, frosted pale-blue surfaces, restrained brushed silver edges, exquisite soft edge lighting and subtle floor reflections. Immaculate composition, sophisticated and cinematic, readable at a glance. The components should feel like sculptural data concepts, not electronic devices.
Composition: wide 16:9 image, whole pipeline centered across the middle 75 percent of the width and middle 60 percent of the height, black breathing room around every edge, low three-quarter perspective that clearly reveals cylinders, table rows, branching connectors, and final structured data. Dark lower margin supports page text outside the artwork. Keep the central network interesting when enlarged. Restrained black, silver, cool white and azure blue palette. Opaque black background.
Constraints: no CPU, no processor, no circuit boards or microchips, no computer hardware, no server racks, no buildings, no mechanical engine, no fiber-optic hair, no people. No text, letters, numbers, logos, watermark, screenshots, UI windows, fake code, or brand assets.
```

## Mobile hero

- Output: `public/data-pipeline-mobile.webp`, 1122 × 1402, 89002 bytes.
- Manifest: `output/imagegen/data-pipeline-hero-manifest.json`.

### Edit

- Mode: `edit`.
- Original PNG: `/root/.codex/generated_images/01a15c68-b690-70d3-89a1-af8dfaeda740/exec-036d84c2-55e1-4b56-9724-1b97b2555058.png` (1122 × 1402, 1175079 bytes).
- Reference: `/root/.codex/generated_images/01a15c68-b690-70d3-89a1-af8dfaeda740/exec-94f5a50f-b8ee-460b-bc8a-7c03b87e912b.png`.

Exact prompt:

```text
Use case: precise-object-edit.
Asset type: portrait mobile hero artwork for the same data engineer portfolio.
Input image1 is the EDIT TARGET. Preserve its data-engineering subject, optical-glass and brushed-silver materials, azure rectangular data records, database cylinders, table-sheet stacks, transformation cubes, columnar warehouse and analytics bars, pure-black seamless studio with restrained reflections and elegant lighting.
Primary request: RECOMPOSE the pipeline as a compact VERTICAL top-to-bottom journey in a portrait 4:5 canvas, not a crop of the landscape artwork. At upper left and upper right place two modest source database/table groups; in the middle, thin blue paths flow down through a small branching network of three to four frosted transformation nodes; at bottom center the paths converge into one larger ordered warehouse cylinder with a small refined bar-chart sculpture beside it. Maintain visible separation and clean logical links between stages. Only one output warehouse. Low three-quarter perspective, all elements fully visible and uncropped, main forms within the central80percent width and middle70percent height. Generous true-black breathing room above, below and beside the complete system so it can blend into a black webpage. Recognizable data workflow at phone size, exceptionally polished photorealistic3D conceptual art.
No words, text, letters, digits, logos, watermark, UI windows, screenshots, fake code, people, processorchips, circuitboards, serverracks, machines, or buildings. Keep the background opaque pure black and keep the subject unmistakably a data-engineering pipeline.
```

## Streaming work story

- Output: `public/streaming-pipeline.webp`, 1672 × 941, 93938 bytes.
- Manifest: `output/imagegen/streaming-pipeline-manifest.json`.

### Step 1: Generation

- Mode: `generate`.
- Original PNG: `/root/.codex/generated_images/01a15c6a-470c-7243-912f-d302d472ab8c/exec-1e1ec4ac-c632-414d-96b9-89159f877e2e.png` (1672 × 941, 1527064 bytes).
- Reference images: none.

Exact prompt:

```text
Use case: stylized-concept.
Asset type: original landscape 16:9 feature artwork for a premium data-engineering portfolio.
Scene/backdrop: seamless pure-black studio with a subtle dark reflective floor.
Subject: a clearly understandable streaming DATA PIPELINE rendered as a refined three-dimensional information sculpture. Small individual translucent event-record cards arrive in three neat streams, each card visibly subdivided into a few simple fields using embossed bars rather than writing. These streams enter exactly THREE distinct upright frosted-glass broker/partition containers holding tidy stacks of event cards. Thin luminous blue connections then lead through TWO open glass transform-stage frames, where the record cards visibly become uniform, and converge into a clean structured output: one precise rectangular table-like lattice of aligned rows and columns. Keep the records, three partition containers, connecting paths, transform stages, and ordered output visually distinguishable at a glance.
Composition/framing: wide 16:9 view, restrained elevated three-quarter camera. Arrange the complete connected pipeline compactly around the CENTER of the canvas, with all essential stages inside the central 65 percent of image width and central 70 percent of image height. Incoming records may gently trail beyond that area. The main three-node pipeline and structured output must remain meaningful in a centered mobile crop. Clear generous gaps between stages, balanced negative black space around the sculpture, no labels needed to read the progression.
Style/medium: immaculate photorealistic premium 3D studio visualization, realistic frosted and clear optical glass, thin brushed-silver rims, restrained luminous azure-blue records and connections, clean white edge highlights, subtle physically plausible reflections. Sophisticated, calm, dimensional and precise. Silver, glass, black and restrained blue only.
Constraints: communicate data engineering through records, partitions, transformations and structured data. No CPU, processor, chip, motherboard, circuit-board, micro-circuit traces, hardware chassis, server rack, engine, fiber-optic cable bundles, planetary objects or spheres. No text, letters, numbers, labels, logos, watermark, UI screens, dashboards, fake software screenshot or code. No decorative rainbow or cyberpunk clutter. Opaque black background.
```

### Step 2: Edit

- Mode: `edit`.
- Original PNG: `/root/.codex/generated_images/01a15c6a-470c-7243-912f-d302d472ab8c/exec-5c567392-cb57-44fe-aa6f-0afb6b12a257.png` (1672 × 941, 1155630 bytes).
- Reference: `/root/.codex/generated_images/01a15c6a-470c-7243-912f-d302d472ab8c/exec-1e1ec4ac-c632-414d-96b9-89159f877e2e.png`.

Exact prompt:

```text
Use case: precise-object-edit.
Input image 1 is the edit target. Preserve this exact streaming-data concept and its photorealistic glass, brushed silver, blue and black material treatment: THREE partition queues containing stacked event-record cards, TWO transform gates, connected record streams, and ONE structured table output. No text or labels.
Change ONLY the framing and compact arrangement. The present pipeline is too spread out horizontally. Pull the camera back and gather the connected nodes closer together so all three partition queue boxes, both transform gates, and the ENTIRE output table fit inside the central 60 percent of the 16:9 canvas width, from roughly20 percent to80 percent, and central70 percent of its height. The boxes and output table should still be large and crisp enough to distinguish. Let only a few incoming event cards trail into the otherwise mostly empty left margin. Leave a wide pure-black safety margin to the right of the complete output table, approximately20 percent of image width. Preserve clear gaps and short blue links between stages so the sequence remains legible.
The purpose is a centered mobile crop: every essential stage must remain visible when the leftmost19 percent and rightmost19 percent of this wide image are hidden. Keep the wide16:9 canvas and seamless black background, fine reflections, restrained blue, and the same conceptual data pipeline. Do not add any objects, words, letters, numbers, labels, logos, UI, code, CPU hardware, circuit boards, or server racks.
```

## Lakehouse work story

- Output: `public/lakehouse-architecture.webp`, 1672 × 941, 131968 bytes.
- Manifest: `output/imagegen/lakehouse-architecture-manifest.json`.

### Generation

- Mode: `generate`.
- Original PNG: `/root/.codex/generated_images/01a15c69-37a0-78b1-942b-5c899da0f076/exec-efc85705-ad00-4711-8719-005ba9cf52e5.png` (1672 × 941, 1834407 bytes).
- Reference images: none.

Exact prompt:

```text
Use case: stylized-concept.
Asset type: original wide 16:9 artwork for a data engineer's portfolio work story.
Primary request: a premium, unmistakably DATA ENGINEERING lakehouse architecture rendered as a compact, elegant physical model. The subject must read as organized datasets, databases, transformation and analytics, never as computer hardware.
Scene/backdrop: seamless white to very light silver studio, pale matte floor, gentle realistic contact shadows and a little clean negative space.
Subject: at the center, three staggered, partially separated translucent tabular data sheets with precise visible rows and columns of small neutral geometric cells, expressing raw, cleaned and curated datasets through increasing order. Connect these layers with restrained clear-blue dataflow paths. Beside and behind the central sheets are two recognizable upright frosted-glass DATABASE CYLINDERS with three stacked circular tiers and clean elliptical tops, softly illuminated ice blue. On the other side are a small orderly warehouse-style stack of organized dataset trays and one elegant analytics output module formed from a few solid blue rising bars. These are physical conceptual forms, not screens or user interfaces. A small number of blue connectors make the input-to-transformation-to-output logic legible.
Composition/framing: centered three-quarter isometric view, wide landscape 16:9. Keep the main database cylinders, layered tables and connectors together in the central 60 percent of the frame, so a mobile center crop still clearly conveys data engineering. Full object visible with balanced margins, no tiny distant parts.
Style/materials: immaculate high-end studio 3D product rendering, polished minimal design, frosted and translucent glass, restrained brushed silver supports, precise bevels, subtle refraction, soft white edge highlights. Visually clear, quiet, sophisticated, physically coherent. White, silver and translucent ice blue, with stronger azure reserved for the data connections.
Constraints: original conceptual architecture; no text, letters, numbers, labels, logos or watermarks. No CPU, processor chips, motherboards, circuit-board traces, server racks, ports, cables, branded products, people, fake code, screens or fake UI. Opaque light background.
```
