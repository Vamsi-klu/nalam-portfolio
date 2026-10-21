# Content model

Visitor-facing copy lives in `src/content/site.ts`. Components supply layout and
behavior; content exports supply identity, headings, accessible labels, projects,
experience, and links. The table below describes the mounted page's current consumers.

## Editorial rules

Keep employer work non-confidential. Meta, Amazon, and University at Buffalo entries
name technologies and problem areas, without internal metrics, product names, or
organization details. Do not add specificity that would be inappropriate on a public
résumé.

Open-source claims must be checkable. Featured PRs link to public diffs, and counts
must remain supported by public evidence. Confirm a project's visibility and a demo's
availability before adding an external action. Descriptions can remain when source
code is private.

## Exports and consumers

| Export | Active consumer |
| --- | --- |
| `site` | Hero identity, navigation name, About, Impact, Oss metrics, Contact, CopyEmail, footer, metadata |
| `editorial` | Section headings, action labels, accessibility text, contact feedback, metadata |
| `experience` | Experience tabs and panels |
| `work` | Selected-work stories, excluding the retained `oss-data-stack` entry |
| `builds` | Server-rendered project cards inside ProjectGallery |
| `oss` | Contribution summary, upstream names, public PR list, all-contributions link |
| `nav` | Desktop and mobile NavBar links |
| `education` | Not currently rendered |

The exported types are `Experience`, `WorkItem`, `BuildItem`, and `OssPr`.

## Identity, biography, and metrics

`site.name` appears in Hero, portrait alternative text, the footer, and metadata.
`shortName` supplies the navigation name. Contact uses `email`, `location`, `github`,
and `linkedin`; CopyEmail uses the same email value. `domain` supplies the canonical
and OpenGraph URL through `layout.tsx`.

About renders one paragraph per `about` entry, the `now` label/value pairs, and one
skill card per category in `skills`. Skill values are arrays of technology names.
Check long values at narrow widths when updating these arrays.

Impact prints each metric's `display` and `label` immediately. There is no count-up.
The numeric `value` and `suffix` fields remain in the model; keep them consistent
with `display`. The responsive grid currently fits six facts in six, three, or two
columns.

Oss reuses `site.metrics.slice(1, 3)` for opened and merged PR counts. Preserve those
positions when editing the array, or update that consumer. The retained
`oss.headline` is not displayed, but keep its figures consistent if changing counts.

## Editorial copy

`editorial` separates presentation copy from biography and project facts:

- `brand` and `navigation` supply the wordmark, menu labels, contact action, and skip link.
- `hero` supplies the fixed heading, description, two actions, and scroll link.
- `work`, `oss`, `builds`, `about`, `experience`, and `impact` supply section copy.
- `builds.previous` and `builds.next` label gallery controls; `code` and `demo` label
  the optional project links.
- `contact` supplies actions plus clipboard success and failure messages.
- `footer.top` labels the return link; `metadata` supplies titles and descriptions.

Hero does not read `site.heroLines`. That array and a few earlier editorial keys are
retained but unused. Changes to them will not change the visible headline.

## Experience and selected work

Each `experience` entry has `company`, `role`, `period`, and `bullets`. Order is
newest first. Full company names appear in horizontal tabs, with labelled panels and
keyboard controls. Keep company names and bullet strings distinct for React keys.

Selected work renders the Meta and Amazon entries as large stories with technology
lists and decorative architecture illustrations. It filters out `oss-data-stack`
because contributions have a dedicated section. `WorkItem.metrics` remains in the
model but is not rendered by the current Work component.

## Personal builds and public links

A `BuildItem` has a unique `id`, `title`, one-sentence `description`, `stack`, and
optional `github` and `demo` URLs. The gallery shows projects with at least one link
first, preserving order within each group. It retains each item's original array
index for its illustration; reordering the content array or adding a project may
therefore require an illustration update in Builds.

Current public source links are nl2sql, YTSummary-Agent, test-agent-skills, and
retail-ai-agent. Jobkanban and prompt-optimizer keep their descriptions without source
links because their repositories are private. The unavailable Jobkanban demo link
has also been removed. A project without links renders without a link action.

Before adding or restoring a link, check it as an unauthenticated visitor. Access
through the owner's GitHub account does not establish that a portfolio visitor can
open it.

## Open-source contributions

`oss.summary` introduces the section, `upstreams` lists project names, and `prs`
contains `title`, `repo`, and `url` for each contribution. Six public PR links are
currently displayed. Verify the author, title, repository, and status when changing
an entry. `allPrsUrl` points to an author-scoped GitHub search.

## Navigation and retained fields

Menu order follows the page: home, work, open source, builds, about, experience,
contact. Each `nav.id` must match its section anchor. Desktop navigation uses the
wordmark for home and a separate contact action; the mobile dialog lists all entries.
Impact is deliberately absent. The old SidebarNav is not mounted.

`education` and `site.resumeUrl` remain unused. There is no `public/resume.pdf`, so do
not add a résumé action without supplying the file. The active portrait is
`public/profile.jpg`; `profile-photo.jpg` and the legacy canvas portrait are not used
by the mounted page. Hero-art provenance is documented in [visual assets](ASSETS.md).
