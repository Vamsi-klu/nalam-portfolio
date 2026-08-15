# Content model

Everything a visitor reads lives in `src/content/site.ts`. Components hold layout and
behavior; they hold no copy. To change the site's text, edit that one file — you should
almost never need to touch a component to update content.

## The confidentiality rule

This is the one editorial constraint that overrides everything else, and it is baked
into the existing copy:

> **Employer-confidential work stays off this site.**

Descriptions of work at Meta, Amazon, and University at Buffalo are deliberately
high-level. They name the technology and the shape of the problem, never internal
metrics, product names, org structure, or anything a reader couldn't already infer from
a public job description. Open-source work is the opposite — every pull request links to
a public diff anyone can verify.

When adding or rewriting a bullet, ask whether it would be fine on a public résumé
handed to a competitor. If not, generalize it until it is. Do not "improve" existing
copy by adding specificity to employer work; the vagueness is the point.

## Exports

`site.ts` exports six constants and three types.

### `site`

The `as const` object holding identity, contact details, and top-level copy.

| Field | Used by |
|-------|---------|
| `name`, `shortName`, `title`, `tagline` | `Hero`, `About`, `layout` metadata |
| `location`, `email`, `phone` | `Contact`, `NavBar` |
| `github`, `githubUser`, `linkedin`, `domain` | `NavBar`, `Hero`, `Contact`, `Oss` |
| `resumeUrl` | *nothing yet — see Known gaps* |
| `heroLines` | `Hero`, cycled through the typing animation |
| `about` | `About`, one `<p>` per array entry |
| `now` | `About`, the `label · value` status chips |
| `skills` | `About`, one column per key |
| `metrics` | `Impact`, the count-up grid |

`heroLines` is cycled by `react-type-animation`, so keep each line short enough to type
out in roughly two seconds — the existing lines sit around 40–60 characters. The first
entry doubles as the static fallback under reduced motion, so make it the strongest one.

`skills` is an object of category → string array. Adding a key adds a column to the
About grid automatically; the grid is two columns from the `sm` breakpoint up, so an
even number of categories lays out cleanly.

`metrics` entries carry both a numeric `value` and a `display` string. `Impact` animates
from zero toward `value` and then snaps to `display` at the end, which is what lets
`100` render as `100+`. Keep the two consistent — if you change `value`, change
`display` and `suffix` to match, or the number will visibly jump at the end of the
count-up. There are six metrics and the grid is `lg:grid-cols-6`, so a count that
divides evenly into 2, 3, and 6 keeps every row full.

### `experience`

Array of `Experience` (`company`, `role`, `period`, `bullets`). Rendered by the tabbed
`Experience` section, newest first. The tab strip is a fixed `md:w-40`, so long company
names need a short label — `Experience.tsx` special-cases `"University at Buffalo"` to
render as `"UB"`. If you add a company with a long name, add a similar shortening there.

Bullets are keyed by their own string, so two identical bullets under one company will
collide as React keys. Keep them distinct.

### `work`

Array of `WorkItem` (`id`, `title`, `org`, `summary`, `stack`, `metrics`). The three
themed cards under "selected work". `metrics` here are short qualitative pills
("Streaming + batch", "Quality-first"), not numbers — the numeric ones belong in
`site.metrics`. Cards render three-up at `lg`, so multiples of three look best.

### `builds`

Array of `BuildItem` (`id`, `title`, `description`, `stack`, optional `github`, optional
`demo`). Personal projects. Both links are optional and the card conditionally renders
each icon, so an entry with neither still renders cleanly — it just shows no link
affordance. Titles render in monospace and are treated as repo names, so keep them
lowercase and hyphenated to match the actual repo.

### `oss`

The open-source section: `headline`, `summary`, `upstreams` (project name chips), `prs`
(an array of `OssPr` — `title`, `repo`, `url`), and `allPrsUrl` (a GitHub search URL
scoped to the author).

Every PR must link to a real public pull request. This section is the site's central
credibility claim — "I don't just use the data stack, I fix it" — and it only works
because each item is independently verifiable. Six is the current count and it fits the
card without scrolling.

The counts in `oss.headline` ("100+ PRs · 20+ merged") and the OSS entries in
`site.metrics` describe the same underlying facts in two places. Update them together
or they will drift apart.

### `nav`

`as const` array of `{ id, label }`. Drives both `NavBar` and `SidebarNav`, and each
`id` must match the `id` attribute of the corresponding `<section>` in the page for
anchor links and scroll-spy to work.

`impact` is a rendered section that is deliberately not in `nav`, so it has no nav link
and the sidebar doesn't highlight while you scroll past it. If you want it tracked, add
`{ id: "impact", label: "impact" }` between `about` and `experience`.

Ordering matters twice over: `NavBar` numbers the links `01.`, `02.`, … from the array
index, so the array order should match the visual order of sections in `page.tsx`.

### `education`

Array of `{ degree, school, period }`. **Currently unused** — no component imports it.
It's available if you add an education section.

## Adding an entry

Adding a project is representative of the whole pattern:

```ts
export const builds: BuildItem[] = [
  // ...
  {
    id: "my-project",              // unique; used as the React key
    title: "my-project",           // matches the repo name, lowercase
    description: "One sentence. What it does and what's interesting about it.",
    stack: ["Python", "FastAPI"],  // 2–4 entries; renders as a monospace footer row
    github: "https://github.com/Vamsi-klu/my-project",
    demo: "https://my-project.vercel.app",  // omit if there isn't one
  },
];
```

No component change is needed. The same holds for experience, work, and OSS entries —
add to the array and the section renders it.

## Known gaps

Two dangling references currently sit in the content layer:

- `site.resumeUrl` points at `/resume.pdf`, but there is no `public/resume.pdf` and no
  component reads the field. Either add the file and a link, or drop the field.
- `public/profile-photo.jpg` exists but nothing references it. Only `/profile.jpg` is
  used, by both `About` and `AsciiPortrait`.

If you replace `public/profile.jpg`, note that `AsciiPortrait` samples its pixels to
build the ASCII art. A high-contrast, centered, head-and-shoulders shot converts well;
a busy or low-contrast image turns to mush because the brightness ramp has only ten
steps to work with.
