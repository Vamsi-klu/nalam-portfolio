# Visual assets

The hero and two work-story illustrations are original procedural 3D artwork.
Their geometry, studio lighting, materials and export code live in this repository.
The same hero scene produces the static poster and the interactive WebGL sculpture.

## Native masters and delivery

| Asset | Native dimensions | Source |
| --- | --- | --- |
| `public/signal-sculpture-4k.webp` | 3840 × 2160 | `src/lib/signal-scene.ts`, opening desktop pose |
| `public/signal-sculpture-mobile-4k.webp` | 3072 × 3840 | Same scene, portrait camera and rotation |
| `public/event-stream-4k.webp` | 3840 × 2160 | `scripts/artwork/work-scene.mjs`, streaming scene |
| `public/warehouse-strata-4k.webp` | 3840 × 2160 | Same module, strata scene |

Each master is rendered directly into a drawing buffer at its stated dimensions.
There is no raster enlargement, interpolation from a smaller image, or external
texture dependency. Sharp encodes the rendered PNG as lossless WebP; the exporter
compares decoded pixels to verify equality. The portrait master has a 3840px long
edge and a 4:5 composition.

Next Image serves responsive variants at quality 95. Phones select a smaller
variant suited to their display; the 3840px desktop source is available for larger
requests. The hero poster is eager and high-priority; work images are lazy. Work
`sizes` includes the maximum 1.12× motion enlargement and cover crop.

Runtime geometry is rendered at the current canvas size with DPR capped at 2 and
budgets of four million desktop pixels and two million portrait pixels. These
budgets are separate from the full-resolution exported masters. The live sculpture
rotates and separates its layers as the visitor scrolls, then stops rendering when
motion settles or the scene leaves view. Reduced motion, short screens, Save-Data,
and unavailable or lost WebGL retain the server-rendered poster.

The profile photograph remains the user's original photo. Personal-project cards
retain their CSS illustrations. Decorative artwork uses empty alternative text;
adjacent portfolio copy carries its meaning.

## Reproduce the artwork

```bash
npm ci
npx playwright install chromium
npm run render:artwork
```

For an existing Chrome installation, set `CHROME_PATH` to its executable. To inspect
smaller framing drafts without replacing public masters:

```bash
npm run render:artwork -- --preview
```

The export script is `scripts/artwork/render.mjs`. It serves local scene modules,
renders each composition in Chromium, verifies dimensions and lossless pixels,
and writes the four public WebP files. PNGs, hashes, byte counts and the manifest
are saved under ignored `output/artwork-4k/`. No network artwork or API key is needed.
The exporter uses software WebGL for reproducibility; the site uses the visitor's
available WebGL renderer.

## Art direction and motion references

Primary pages were opened and visually inspected before this implementation.
Original geometry and content belong to the portfolio; external brand assets are
not included in the site.

| Reference | Applied observation |
| --- | --- |
| [Apple Mac Studio](https://www.apple.com/mac-studio/) | A pinned object rotates through meaningful views before the next chapter. The mobile sequence is shorter. |
| [Apple MacBook Pro](https://www.apple.com/macbook-pro/) | Large imagery gives way to a short headline and supporting explanation, with a quiet reading interval. |
| [FIELD: IBM Think 2020](https://field.io/work/ibm-think-2020) | Parametric surfaces, directional lines and negative space establish a visual hierarchy. |
| [FutureDeluxe: Verizon](https://futuredeluxe.com/work/verizon) | Dark materials and controlled edge lighting give abstract forms visual weight. |

The earlier image-generation experiments and their exact prompts remain in Git
history at commit `2773855`. The current four masters are generated from the checked-in
scene code, which makes their resolution and motion reproducible.

## Rendering references

- [Three.js responsive rendering](https://threejs.org/manual/pages/responsive.html)
- [Three.js canvas capture](https://threejs.org/manual/pages/tips.html)
- [Three.js color management](https://threejs.org/manual/pages/color-management.html)
- [Three.js rendering on demand](https://threejs.org/manual/pages/rendering-on-demand.html)
- [Three.js resource disposal](https://threejs.org/manual/pages/how-to-dispose-of-objects.html)
