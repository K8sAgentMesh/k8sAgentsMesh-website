# Information Architecture — K8sAgentMesh website

Phase **P3** of ISI-6394 (rev 3). Owner: Graphic Designer. Consumer: **P4
(ISI-6417)** implements the landing from this package; **P5 (ISI-6419)** reviews
against it.

Scope: the marketing landing at `/` plus how it links into the Starlight-owned
docs surface. This document is the site map and navigation contract — it does
not restyle docs; docs IA is owned by the P0 sidebar skeleton (`astro.config.mjs`)
and P1/P2 content.

---

## 1. URL ownership

| URL space | Owner | Surface |
|---|---|---|
| `/` | Standalone Astro page (`src/pages/index.astro`) | Marketing landing |
| `/docs/**` | Starlight | User documentation (quickstart, prerequisites, host integration, roadmap) |
| `/concepts/**` | Starlight | Architecture, lifecycle, memory, scheduling, hosts, telemetry, CRDs |
| `/blog/**` | Starlight | Blog & changelog |
| `/community/**` | Starlight | Community, contributing |

The landing is the only non-Starlight page. Everything it links to (except
GitHub) resolves inside the Starlight surface. **Rule: the landing never
duplicates docs content — it teases and deep-links.**

Base path note: the site deploys to GitHub Pages project pages, so all internal
hrefs are prefixed with `import.meta.env.BASE_URL` (`/k8sAgentsMesh-website/`).
All links in this document are written site-root-relative; P4 must wrap them in
`BASE` exactly as the current `index.astro` does.

## 2. Site map

```
/ (landing — this package)
├── #hero                value prop + CTA (Getting Started, GitHub)
├── #architecture        Mermaid diagram + 7-op contract + hosts-not-owners
├── #how-to-use          3-step quickstart teaser → /docs/quickstart/
├── #why                 feature grid (6 cards) → /concepts/* deep links
└── footer               license, staging URL, GitHub

/docs/                   Starlight sidebar (P0 skeleton, P1/P2 fill):
├── What is K8sAgentMesh?      /docs/, /docs/roadmap/
├── Architecture               /docs/concepts/architecture/, lifecycle, memory,
│                              scheduling, hosts, telemetry
├── Getting started            /docs/prerequisites/, /docs/quickstart/,
│                              /docs/host-integration/
├── Using runtimes             /docs/using-runtimes/  (P2)
├── CRD reference              /docs/concepts/crds/, /docs/crd-reference/ (P2)
├── Reference                  /docs/reference/ (P2)
├── Blog & changelog           /blog/**
└── Community                  /community/, /community/contributing/
```

Note on a Starlight quirk P4 must preserve: concept pages live under
`src/content/docs/concepts/` and are reachable both at `/concepts/*` (the URLs
the current landing uses) and via sidebar links of the form
`/docs/concepts/architecture`. The landing links below use the canonical
`/concepts/*` short form already in production; do not change link targets
without checking both resolve.

## 3. Navigation model

**Landing header (top nav):** brand lockup (theme-aware, links to `/`) ·
Docs · Concepts · Blog · Community · GitHub · theme toggle.
This mirrors the shipped header — no change.

**Landing section nav:** single-page scroll, anchor links are *not* added to the
header (the page is short; anchors would compete with the docs links). Anchor
targets exist for deep-linking from elsewhere (`/#architecture` etc.).

**Landing → docs deep links (the contract):**

| Landing element | Target |
|---|---|
| Hero CTA primary | `https://github.com/K8sAgentMesh/K8sAgentMesh` |
| Hero CTA secondary | `/docs/quickstart/` (changed from `/docs/` — see §5) |
| Architecture diagram caption link | `/concepts/architecture/` |
| 7-op contract card link | `/concepts/architecture/#the-runtimeadapter-7-op-contract` |
| Hosts-not-owners card link | `/concepts/hosts/` |
| How-to-use step 1 | `/docs/prerequisites/` |
| How-to-use step 2 | `/docs/quickstart/` |
| How-to-use step 3 | `/docs/quickstart/#run-your-first-task` |
| How-to-use CTA | `/docs/quickstart/` |
| Why card 01 Runtime-agnostic seam | `/concepts/architecture/` |
| Why card 02 Per-pod gateways | `/concepts/lifecycle/` |
| Why card 03 A2A wire types | `/concepts/architecture/` |
| Why card 04 Lifecycle events | `/concepts/telemetry/` |
| Why card 05 Scheduling as policy | `/concepts/scheduling/` |
| Why card 06 Temporal memory | `/concepts/memory/` |
| Footer GitHub | `https://github.com/K8sAgentMesh/K8sAgentMesh` |

## 4. Landing page outline (single page, 5 bands + header/footer)

Order is deliberate: **what → how it's shaped → how to try → why it matters**.

1. **Header** — brand lockup + nav + theme toggle (sticky is NOT required;
   current non-sticky header is fine and simpler).
2. **Hero** (`#hero`) — kicker, H1 value prop, one-sentence lede, two CTAs.
   Optional: primary mark as a quiet backdrop right of the copy on ≥64rem
   viewports (see visual-design-spec §6). No carousel, no video.
3. **Architecture** (`#architecture`) — **NEW band, the gap this phase closes.**
   Mermaid architecture diagram (source: `design/diagrams/architecture-overview.mmd`)
   with a two-card rail beneath: "The 7-op contract" and "Hosts, not owners".
   This absorbs the current standalone Hosts band (§5).
4. **How to use** (`#how-to-use`) — 3-step strip (cluster → chart → first task),
   each step deep-linked, plus a section CTA to the quickstart.
5. **Why / features** (`#why`) — the existing 6-card grid, renumbered copy per
   `landing-copy.md`, moved after How-to-use so the page answers "can I try it"
   before "why should I care in depth".
6. **Footer** — license line, staging link, GitHub link.

## 5. Changes from the currently-shipped landing

| # | Change | Rationale |
|---|---|---|
| 1 | **Add Architecture band** with a Mermaid diagram | Hard board requirement: every page's diagrams are Mermaid/SVG, and the landing must explain the 7-op contract and hosts-not-owners visually. Currently absent. |
| 2 | **Merge the Hosts band into Architecture** | "Hosts, not owners" is an architectural property; two bands said overlapping things. The hosts copy becomes the second rail card under the diagram. |
| 3 | **Reorder: How-to-use before Why** | Try-it path surfaces earlier; the feature grid is the deep-dive. Matches the ISI-6416 section order in the ticket. |
| 4 | **Hero secondary CTA → `/docs/quickstart/`** | "Getting Started" is the named CTA in the ticket; `/docs/` is a weaker first click than the quickstart. |
| 5 | **Step cards become links** | Each how-to step deep-links to its docs anchor (§3). |

Everything else (header, theme toggle, footer, card mechanics, responsive
behavior) is already shipped and stays.

## 6. Responsive model

One breakpoint, matching the shipped CSS: **`48rem`**.

- ≥48rem: 3-column feature grid, 3-column step strip, diagram rail = 2 cards
  side-by-side, diagram max-width 56rem centered.
- <48rem: everything stacks single-column; the diagram stays full-width and is
  expected to scroll horizontally *only* if the rendered SVG exceeds the
  viewport — the Mermaid source in this package is sized to avoid that
  (≤6 top-level nodes, short labels).

Mobile nav: the 5 nav links + toggle fit at 48rem down to ~22rem at 0.9rem
font size (shipped behavior). No hamburger in this phase; if P4 measures
overflow below 22rem, drop "Concepts" (redundant with Docs) rather than adding
a menu.

## 7. Accessibility & theme contract (summary — full rules in visual-design-spec)

- Logo appears on every page via the header (landing) and Starlight header
  (docs) — already satisfied; do not regress.
- All diagrams Mermaid (preferred) or SVG; **no ASCII art anywhere.**
- Diagrams legible in light AND dark: landing Mermaid uses the same
  `MERMAID_THEME_VARIABLES` already configured in `astro.config.mjs`
  (`astro-mermaid` auto-themes); standalone SVGs use the dark-safe palette in
  visual-design-spec §7.
- Color contrast ≥ WCAG AA, using the text-safe `*-strong` token variants for
  body-size text.
- Skip-link and `:focus-visible` outlines (shipped) are retained.
- `prefers-reduced-motion`: no motion beyond the shipped route-only rule.

## 8. Out of scope for P3

- Docs sidebar/content changes (P1/P2).
- New pages (no separate /architecture page — the landing band deep-links into
  `/concepts/architecture/` instead).
- Search, versioning, i18n, custom domain.
- Any change to `brand/tokens/` (board-locked; PR-only).
