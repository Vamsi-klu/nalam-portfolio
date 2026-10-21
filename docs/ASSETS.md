# Visual assets

The hero and selected-work artwork was created for this portfolio with the built-in
OpenAI image-generation tool. These are original conceptual data-platform renders.
They do not document employer hardware or infrastructure, and contain no borrowed
Apple product imagery or logos. The original `public/profile.jpg` remains the portrait
source. Personal project illustrations are decorative CSS compositions.

Hero uses `getImageProps` inside a `<picture>` to select the portrait image at widths
up to 800px and the landscape image above that breakpoint. Work uses responsive
Next Image components. All conceptual artwork is decorative, with empty alternative
text.

## Desktop hero: data-core

- Output: `public/data-core.webp`, 1672 × 941, 201920 bytes.
- Provenance: original generation using the built-in image tool.
- Conversion: generated PNG to WebP using Sharp, quality 88.

Exact generation prompt:

```text
Use case: stylized-concept. Asset type: original cinematic hero artwork for a high-end data engineer portfolio with Apple product launch quality. Create an exceptionally refined photorealistic 3D studio render of an engineered data core: three wide square plates of smoked optical glass and brushed dark titanium suspended in an exploded stack, precise beveled edges, a small luminous azure-blue processor within the central plate, thousands of very fine silver micro-circuit traces visible through the glass, a few elegant violet and electric-blue light paths passing between the layers. Camera at a low three-quarter isometric angle, dramatic almost-black seamless studio background, product centered with generous black negative space around and above, width spans most of composition, strong edge highlights and realistic light refraction, subtle floor reflection. Restrained colors: black, titanium, silver, cool white, electric blue, slight violet. This should look like an immaculately art-directed premium chip product photograph, physically plausible, quiet, minimal, precise, spectacular materials and lighting. Wide landscape 16:9 composition. No text, no letters, no logos, no watermark, no people, no planets, no spheres, no neon cyberpunk clutter, no UI, no generic background gradients.
```

## Cinematic asset batch

Generated with `built-in image_gen`; manifest recorded at `2026-10-21T03:45:41.560Z`.
The local manifest is `output/playwright/cinematic-assets.json` (an ignored artifact).
The source PNG paths below identify local originals; the WebP files in `public/`
are the application assets. All three conversions use Sharp, WebP quality 88 and
effort 6, preserving the original dimensions without resizing or cropping.

### Mobile hero: hero-mobile

- Output: `public/hero-mobile.webp`, 1122 × 1402, 142678 bytes.
- Original PNG: `/root/.codex/generated_images/01a15c69-37a0-78b1-942b-5c899da0f076/exec-20a42e32-dd58-4045-aef9-04617cefc89a.png` (1122 × 1402).
- Mode: `edit`.
- Reference: `/root/ram/coding/nalam-portfolio/public/data-core.webp`.

Exact prompt:

```text
Use case: precise-object-edit.
Asset type: original mobile hero artwork for a premium data engineer portfolio.
Input image 1 is the EDIT TARGET. Preserve the exact visual identity of this glass-and-titanium data core: three precision square plates in an exploded vertical stack, brushed dark titanium edges, smoked optical glass, intricate silver micro-circuit traces, a luminous ice-blue central processor and restrained blue-violet light connections. Preserve photorealistic material detail and controlled studio lighting.
Primary request: recompose this same object for a PORTRAIT 4:5 image. Move the camera farther back and slightly higher so all THREE separated plates fit cleanly in a narrower centered silhouette with clearly readable vertical gaps. The full object must remain uncropped, approximately 82 percent of the frame width, occupying the middle 65 percent of the frame height. Generous seamless near-black negative space above and below, subtle dark floor reflection. Designed to remain legible in a 390 by 420 mobile hero region. Do not simply crop the wide image.
Keep the object, black/titanium/silver/ice-blue palette, craftsmanship and physical realism; change only framing, camera distance and vertical arrangement needed for the portrait composition. No text, no letters, no logos, no watermark, no people, no planets, no spheres, no UI, no fake code, no extra objects. Opaque black background.
```

### Streaming work story: streaming-flow

- Output: `public/streaming-flow.webp`, 1672 × 941, 168794 bytes.
- Original PNG: `/root/.codex/generated_images/01a15c69-37a0-78b1-942b-5c899da0f076/exec-ceba2186-bc8a-4083-82d6-4519d17a166e.png` (1672 × 941).
- Mode: `generate`.
- Reference images: none; generated from the prompt.

Exact prompt:

```text
Use case: stylized-concept.
Asset type: original cinematic 16:9 wide feature artwork for a premium data engineering portfolio.
Scene: seamless pure-black studio with subtle reflective floor and carefully controlled product lighting.
Subject: luminous ice-blue fiber-optic streams sweep elegantly from the LEFT through the black space into a single precision brushed-titanium and smoked-glass processing core at RIGHT-CENTER. The streams are long fine physical glass fibers with a few restrained violet highlights, converging and bending in a graceful controlled arc. The core is an original low, precise engineered form with beveled metal edges, transparent smoked optical surfaces and an ice-blue inner light, small enough to leave the visual flow clearly readable.
Style: exceptionally refined photorealistic 3D product render, immaculate material realism, extremely fine brushed metal grain, real glass refraction, crisp white edge highlights, spectacular but disciplined lighting. The composition should communicate fast reliable streaming data without any literal diagram. Generous negative black space toward the upper left and upper edge. Landscape 16:9 composition, no cropping of the core.
Constraints: original design with no borrowed branded products. No words, no letters, no numbers, no logos, no watermark, no UI, no screens, no fake code, no labels, no charts, no people, no cyberpunk clutter. Restrained palette of black, titanium, silver and ice blue with very slight violet. Opaque background.
```

### Data-platform work story: platform-architecture

- Output: `public/platform-architecture.webp`, 1672 × 941, 120578 bytes.
- Original PNG: `/root/.codex/generated_images/01a15c69-37a0-78b1-942b-5c899da0f076/exec-44bbb3f6-ef49-4296-8dc6-c5f5cd748609.png` (1672 × 941).
- Mode: `generate`.
- Reference images: none; generated from the prompt.

Exact prompt:

```text
Use case: stylized-concept.
Asset type: original cinematic 16:9 wide feature artwork for a premium data platform portfolio.
Scene: seamless white-to-soft-silver studio, softly lit pale floor with delicate realistic contact shadows.
Subject: an original conceptual data warehouse architecture built from elegant translucent ice-blue optical-glass volumes and precision silver-titanium structural layers. Use a distinctive horizontally arranged modular architectural form: several staggered glass chambers joined by slim machined silver bridges and terraces, with precise open negative spaces, rising gently toward a central taller transparent volume. Strong geometry, purposeful engineering, refined bevels. This must be visually distinct from a three-plate processor stack: a sophisticated physical architectural model rather than exploded square plates.
Style: immaculate photorealistic 3D studio product render, convincing translucent glass, very fine brushed titanium grain, beautifully controlled white highlights and refraction, gentle shadows, quiet premium materials. Three-quarter camera angle, balanced composition with generous clean white margins. Landscape 16:9 image; full object visible.
Constraints: original design, no branded products. No text, letters, numbers, logos, watermark, UI, screens, fake code, labels, people, or charts. Restrained white, silver, cool-gray and translucent pale-blue palette. Opaque white background.
```
