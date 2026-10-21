# Cinematic portfolio design QA

Date: 2026-10-21

final result: passed

No actionable P0, P1, or P2 findings remain in the reviewed desktop, tablet,
mobile, and short-viewport states. This review evaluates the selected Apple Pro
art direction adapted to a personal portfolio; it does not claim a pixel-identical
copy of Apple's website.

## Visual targets and evidence

Reference pages: https://www.apple.com/iphone-18-pro/ and
https://www.apple.com/macbook-pro/. Their live browser captures supplied the
image-first composition, restrained typography, compact navigation, dark hero,
white feature sections, and horizontal project-gallery references.

Session artifacts below live in the locally ignored `output/playwright/` directory.
They are evidence from browser rendering, not generated screenshots of the site.

| State | Source visual truth | Revised implementation |
| --- | --- | --- |
| Desktop hero | `review-apple-pro-desktop-hero.png` | `third-fixed-hero-1440x1000-p0.png` |
| Mobile hero | `review-apple-pro-mobile-hero.png` | `third-fixed-hero-390x844-p0.png` |
| Desktop feature rhythm | `review-macbook-pro-desktop-highlights-settled.png` | `third-fixed-work-1440x1000.png` |
| White feature surface | `review-macbook-air-white-highlights.png` | `third-fixed-work-390x844.png` |
| Scroll handoff | Reference product-page motion and chosen two-stage story | `third-fixed-hero-1440x1000-p0.5.png` |
| Short phone | Responsive adaptation of the mobile target | `third-fixed-hero-375x667-p0.png` |
| Tablet end state | Responsive adaptation of the desktop/mobile target | `third-fixed-hero-768x1024-p1.png` |

Hero comparisons used 1440×1000 CSS px desktop and 390×844 CSS px mobile, at
deviceScaleFactor 1. Source and implementation image pixels equal those viewport
dimensions, without browser chrome or rescaling. Source and implementation were
opened together in the same image input for comparison. Feature captures were
aligned by section start; their content differs intentionally. Additional checks
covered 375×667, 768×1024, 1024×768, and the 320×568 normal-flow fallback.

Full-view comparisons assessed composition and density. Focused inspections of the
hero at 20%, 40%, 50%, and 100% scroll progress checked image edges, text readability,
and control placement. Mobile Work captures checked artwork crop and sharpness.
Desktop and mobile gallery captures (`third-builds-1440.png` and
`third-builds-390.png`) checked card density and controls.

## Comparison history

| Finding | Severity | Fix | Post-fix evidence |
| --- | --- | --- | --- |
| Oversized heading competed with hero artwork | P1 | Image-first stage, lower-left desktop title, mobile portrait composition, smaller headings | `third-fixed-hero-1440x1000-p0.png`, `third-fixed-hero-390x844-p0.png` |
| Repetitive statistics and oversized headings delayed the work | P2 | Removed duplicate Impact strip; compacted section headings; moved public OSS evidence earlier | `third-oss-1440.png`, `third-fixed-work-390x844.png` |
| Enlarged hero revealed a rectangular bitmap boundary | P2 | Intrinsic image aspect ratio and intersecting horizontal/vertical edge masks | `third-fixed-hero-1440x1000-p0.2.png`, `third-fixed-hero-390x844-p0.4.png` |
| Story text faded slowly across bright image details | P2 | Dim artwork first; shorten story reveal to reach full readability by halfway | `third-fixed-hero-1440x1000-p0.5.png`, `third-fixed-hero-390x844-p0.5.png` |
| Minimum hero height clipped controls at 375×667 | P2 | Use available viewport height and cap mobile artwork by height | `third-fixed-hero-375x667-p0.png`, `cinematic-short-viewport-result.json` |
| Mobile Work images were undersampled for their cover crop | P2 | Account for image-panel height in responsive image sizes | `third-fixed-work-390x844.png`; browser selected a 640px source |

The final independent visual pass rechecked all three last-round findings and the
short-phone correction. It found no remaining P2 issues, overlap, or horizontal
overflow in the reviewed states. Forward and reverse wheel scrolling restored the
initial composition consistently.

## Required fidelity surfaces

- **Fonts and typography:** The system sans stack gives Apple devices their native
  system face, with Helvetica/Arial fallbacks elsewhere. No web font download is
  needed. Semibold headings, 56px desktop and 36px phone chapter titles, looser
  tracking, readable line heights, and stable wrapping retain the intended hierarchy.
- **Spacing and layout rhythm:** A 52px navigation bar, 1200px content shell,
  spacious image panels, and compact chapter introductions establish the rhythm.
  Mobile imagery is recomposed rather than merely shrinking the desktop crop.
- **Colors and tokens:** Black, white, silver, and restrained blue use the existing
  token layer. The hero dims before the second text stage; controls remain visible.
  Dark and light sections are clearly distinguished.
- **Image quality:** Original generated data-engineering imagery supplies the hero
  and Work panels. Desktop/mobile art direction, responsive optimization, edge masks,
  and cover-aware source sizes were inspected. These are conceptual illustrations,
  not photographs of an employer's infrastructure.
- **Copy and content:** Portfolio identity, experience, project descriptions, and
  public contribution links remain specific to Ramachandra. Copy is centralized in
  `site.ts`; employer descriptions remain high-level. Apple product names, claims,
  and sales language are not copied into the portfolio.

## Runtime validation

Local optimized production build and TypeScript pass. The full lint command reports
only the documented, pre-existing unused `AsciiPortrait.tsx` error and no warnings.
The changed motion and section files pass scoped lint.

`cinematic-local-audit.json` records six navigation anchors, five widths from 320 to
1440px without overflow, gallery navigation, keyboard Experience tabs, clipboard
copy, mobile-dialog dismissal and focus, external-link attributes, live/cold reduced
motion, no-JavaScript content, and image loading. No JavaScript errors or failed
requests were recorded. The only local console error is the expected missing Vercel
Analytics endpoint on the local server; deployed checks must verify its live state.

`cinematic-local-axe.json` records zero automated violations across desktop/mobile,
all Experience panels, and the open mobile menu. Contrast over artwork and the
unopened native dialog received manual follow-up in `cinematic-manual-a11y.json`:
99 text runs passed with no skipped samples, including the normal and reduced-motion
hero, navigation over dark/light surfaces, and all Experience tab states. The lowest
sampled ratio was 4.697:1. The menu control resolves to its native dialog, and Escape
restores trigger focus. These checks do not prove full accessibility conformance.

Motion checks include reversible hero phases, anchor restoration, resize,
offscreen inactivity, entrance replay, delayed hydration, keyboard focus visibility,
and preference changes while animation or gallery scrolling is in progress.

The Vercel preview at application commit `f6fe7b9` passed the same interaction audit
with no JavaScript errors, console errors, or failed requests. Nine deployed axe
states reported zero violations. Browser inspection confirmed reversible hero phases
and visible controls at 1440×1000, 390×844, and 375×667.

Local Lighthouse measured performance 97 mobile and 100 desktop, accessibility and
SEO 100 on both, and zero layout shift. Best practices scored 96 solely because of
the local Vercel Analytics 404. These are local lab results, not field measurements.

## Accepted differences and follow-up polish

The content, identity, artwork, and section sequence intentionally belong to this
portfolio. Apple's proprietary typeface and product assets are not redistributed.
The personal-project cards retain decorative CSS illustrations because verified
application screenshots were unavailable. Their styling is coherent, but real
screenshots could make those cards more specific in a future content update (P3).

## Implementation checklist

- [x] Compare source and implementation at matching desktop/mobile viewports.
- [x] Check all five fidelity surfaces and focused transition states.
- [x] Fix and recapture every actionable P0/P1/P2 finding.
- [x] Verify keyboard, mobile, reduced-motion, and no-script behavior.
- [x] Record residual limitations without claiming pixel identity or full WCAG certification.
- [x] Verify the new Vercel preview before production publication.
- [ ] Verify the production revision before release handoff; this report is the pre-release snapshot.

## Data-engineering artwork update — 2026-10-21

Replaced all four conceptual hero and work-story images with recognizable dataflows:
source databases, transformation nodes, streaming records, and lakehouse table
layers. The mobile hero has its own portrait composition; the streaming image uses
a 60% horizontal crop position to retain its queues, gates, and output table.
The combined WebP assets are 426,956 bytes, 32.7% smaller than the replaced set.
Exact prompts, source paths, and final dimensions are in [visual assets](docs/ASSETS.md).

The optimized local build passed the interaction audit in
`output/playwright/data-art-local-audit.json`, including image-source selection at
320, 390, 768, 1024, and 1440px, navigation, tabs, gallery controls, clipboard,
mobile navigation, reduced motion, and no-JavaScript content. The only local console
error was the expected Vercel Analytics endpoint 404. Build and TypeScript pass;
lint reports only the documented existing `AsciiPortrait.tsx` error.

Independent visual inspection at 1440×1000, 390×844, 375×667, 320×568, and 768×1024
confirmed decoded images, recognizable subjects, clear crops, and no overflow or
application errors. Evidence is in `output/playwright/de-image-production-visual-result.json`
(an optimized local production build, not a Vercel deployment).
`output/playwright/de-images-manual-a11y.json` records 99 passing text-contrast samples
with none skipped. The hero story's minimum sampled contrast is 5.285:1 on desktop
and 5.300:1 on mobile. No actionable P0/P1/P2 visual issues remain in this local pass.
Each subsequent Vercel deployment still requires browser verification.
