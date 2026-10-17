# K8sAgentMesh Brand Guide

Direction **B — Agent Constellation**, accepted by the board on [ISI-6042] decision card `cc83324a` (2026-10-16). Produced by the brand identity kit, [ISI-6046].

- Lead glyph: **B2 Hub Constellation** — a hub node with a gateway ring, two agents orbiting on a dotted route orbit, and k8s-blue routes descending to the hub. The two descending routes carry the **B1 "Constellation M"** silhouette: the routes plus the orbit arc above them read as an `M` at small sizes.
- **Viking compass at the hub (v4)** — per the board's inspiration image (an 8-armed compass medallion on navy): the hub is an **eight-point compass rose** — four long kite rays at the cardinals, four short rays at the diagonals, a core circle, framed by a thin **medallion ring**. It carries the cloud-native nautical lineage (kubernetes = helmsman, istio = sail, harbor = port) in one clean symbol, and stays on the constellation story: the Northern Cross is itself a constellation. The dotted orbit keeps its **four cardinal compass ticks**, aligned with the long rays.
- Supporting languages: **C — Gateway Geometry** (double-ring rounded rectangles for gateways) governs architecture diagrams; **A — Mesh Lattice** is demoted to a subtle background texture (hairline grid, ≤45% opacity, never a foreground element).
- Semantics are fixed: **k8s-blue = routes**, **route-teal = edges/agents**, **A2A-green = signals**, near-white = the hub/control plane.

## 1. Logo suite

All sources live in `brand/logos/` (SVG + PNG exports). Wordmarks are exact vector outlines (no font dependency for viewers).

| Asset | File | Use |
|---|---|---|
| Primary mark (full color) | `logos/k8sagentmesh-mark.svg` + `-512/-256.png` | Hero surfaces on dark backgrounds |
| Mark on navy tile | `logos/k8sagentmesh-mark-navy.svg` + `-1024/-512.png` | Cards, social tiles |
| Monochrome light | `logos/k8sagentmesh-mark-mono-light.svg` + `-512.png` | One-color on dark surfaces (engraved, print, single-hue UI) |
| Monochrome dark | `logos/k8sagentmesh-mark-mono-dark.svg` + `-512.png` | One-color on light surfaces |
| Horizontal lockup | `logos/k8sagentmesh-lockup-horizontal.svg` (+ mono light/dark) | Site header, docs, README |
| GitHub org avatar | `logos/k8sagentmesh-avatar.svg` + `-512/-256/-128.png` | Org avatar — content sits inside a circle-safe zone, survives circle/square crops |
| Favicon | `logos/k8sagentmesh-favicon.svg` + `-64/-32/-16.png` | Browser tab; simplified viking compass + two agents, verified legible at 16px |

Construction (256 design units): hub = viking compass at (128,148) — 4 long kite rays to r=38 (half-width 10.1 at the core) at the cardinals, 4 short rays to r=26 (half-width 6.75) at the diagonals, core circle r=13, medallion ring r=44 at 2.5 stroke; agents r=14 at (64,78) and (192,78); orbit r≈94.85 dotted (dash `0.1 8.5`) with 4 cardinal compass ticks (half-length 5); routes stroke 8, terminating at the core edge; signals r=6 and r=4.5 on the routes. The favicon draws the compass bolder (long rays to 14, short to 9, core 5) so it still resolves at 16px.

## 2. Clear space and minimum sizes

- **Clear space:** keep at least one hub-node diameter (56/256 of mark height; ~22% of the mark's height) free on all sides of the mark or lockup. Nothing enters this zone — no type, no UI, no other logos.
- **Minimum sizes:** primary mark 24px; horizontal lockup 120px wide; favicon 16px; avatar 128px. Below these, switch to the simplified favicon glyph (hub + two agents).
- **Quality gates met:** one-color lockups (mono light/dark), 16px favicon legibility verified by pixel census (hub, both agents, and routes resolve at 16px and 32px), minimum white space around the hub enforced by the clear-space rule.

## 3. Don'ts

- Do not recolor elements — semantic colors are fixed. No gradients on the mark.
- Do not rotate, skew, add drop shadows or glows, or outline the mark.
- Do not place the full-color mark on mid-tone or cluttered surfaces; use mono-light on dark, mono-dark on light, or the navy tile.
- Do not animate nodes or the ring. **Route-only motion:** any motion travels along routes (dash offsets, signal dots easing along a path, ≤200ms transitions). Nodes, ring, and orbit never pulse or spin.
- Do not rebuild the wordmark in other fonts; Inter SemiBold only. Do not stretch the lockup; scale proportionally.
- Do not use the Mesh Lattice as a foreground element or logo component.

## 4. Color system

Dark-mode-first, for an infra audience. WCAG ratios measured against the dark canvas/surface and light canvas:

| Foreground | On navy `#0A1628` | On surface `#111521` | On light `#F6F8FC` |
|---|---|---|---|
| Ink `#E8ECF5` (text) | 15.3:1 | 15.4:1 | — |
| Neutral-6 `#C4CCDE` (body) | 11.3:1 | 11.3:1 | — |
| Neutral-5 `#8B96AD` (secondary) | 6.1:1 | 6.1:1 | — |
| K8s-blue `#326CE5` (routes/graphics, large text) | 3.8:1 | 3.8:1 | 4.5:1* |
| Route-blue `#5B9CF8` (links/text dark) | 6.5:1 | 6.6:1 | use `#2B6BC4` |
| Route-teal `#2DD4BF` (edges) | 9.7:1 | 9.8:1 | use `#0F766E` as text |
| A2A-green `#22C55E` (signal/success) | 8.0:1 | 8.0:1 | use `#15803D` as text |
| Amber `#FBBF24` (warning) | 10.9:1 | 10.9:1 | use `#A16207` |
| Danger `#F87171` | 6.6:1 | 6.6:1 | use `#B91C1C` |

`#326CE5` meets AA for large text (≥3:1) and graphics on dark, and AA for normal text on the light canvas; body-size text on dark uses the `*-strong` variants (all ≥6:1, well past AA).

Tokens ship in `brand/tokens/tokens.css` (canonical): brand palette, semantic states (text + tinted backgrounds), text-safe light-theme variants, dark-mode-first neutrals, spacing, radii, typography, and motion. The website consumes them through `src/styles/theme.css`.

## 5. Typography

| Role | Family | Weights | License |
|---|---|---|---|
| Display / hero | Inter (variable) | Light 300, SemiBold 600 | SIL OFL 1.1 — OSS-safe |
| Body / UI | Inter (variable) | Regular 400 | SIL OFL 1.1 |
| Operator voice (code, CLI, diagrams, labels) | JetBrains Mono (variable) | Regular 400, SemiBold 600 | SIL OFL 1.1 |

- Headings: Inter SemiBold 600. Hero display: Inter Light 300, large sizes only.
- Body: Inter Regular, 16–18px, ~1.6 line height.
- Code, kubectl snippets, and diagram labels: JetBrains Mono.
- Self-host the variable files (`@fontsource-variable/inter`, `@fontsource-variable/jetbrains-mono`); CSS stacks in `tokens.css` fall back to system fonts first-paint.

## 6. Iconography and diagram style

Governed by Gateway Geometry (direction C), Mesh Lattice as background texture only:

- **Agent node:** teal circle outline, 2.5px stroke, inner solid dot (36% of radius).
- **Gateway:** double-ring rounded rectangle — outer 2.5px k8s-blue stroke, inner 1.5px at 55% opacity; the gateway ring of the primary mark is the same motif.
- **Memory:** outlined cylinder (teal, 2.5px).
- **Routes:** k8s-blue 3px, round caps, arrowheads for request direction. **Edges:** teal 3px for stateful/ambient links.
- **A2A signals:** solid green dots on routes (r=5 in diagrams).
- **Background:** hairline 60px Mesh Lattice grid at ≤45% opacity on navy.
- **Labels:** JetBrains Mono SemiBold, teal for agents, route-blue for gateways.

Reference render: `brand/diagrams/diagram-style-sample.svg` / `.png`. A one-page overview of the whole kit: `brand/preview/brand-sheet.png`.

## 7. Motion

Route-only. Signals and dashes animate along routes; durations 120–200ms, easing `cubic-bezier(0.4, 0, 0.2, 1)` (tokens `--mesh-motion-*`). Nodes, rings, orbit, and the mark itself are static. Respect `prefers-reduced-motion`.

## 8. File map

```
brand/
  brand-guide.md            this guide
  README.md                 kit contents
  tokens/tokens.css         canonical design tokens (CSS variables)
  logos/                    SVG sources + PNG exports (mark, lockups, avatar, favicon)
  diagrams/                 diagram-style sample (SVG + PNG)
  preview/brand-sheet.png   one-page board-review poster
```

## 9. Changelog

- **v1 (2026-10-16)** — initial kit on the accepted Territory B baseline: B2 Hub Constellation glyph, palette, tokens, diagram style, guide.
- **v2 (2026-10-17)** — navigator accents (helm spokes, sail cut-outs, compass ticks) per board feedback. Rejected by the board: compass liked, mark read as unclear.
- **v3 (2026-10-17)** — "Viking north cross" per board rejection reason: hub becomes a four-pointed north cross (compass rose / Northern Cross constellation); compass ticks kept; helm spokes and sails removed for clarity.
- **v4 (2026-10-17)** — per the board's inspiration image (8-armed viking compass medallion): the hub becomes an eight-point compass rose (4 long cardinal rays + 4 short diagonal rays + core) framed by a thin medallion ring; favicon redrawn bolder and 16px gate re-verified. Fixed a latent fill-rule defect (core-circle subpath winding against the rays punched holes over routes) by emitting core and ring as separate circle elements. Verified: mark structure probes (core, cardinal and diagonal rays, ring, clean background between rays, agents, routes, ticks, signals), AA contrast matrix unchanged.

[ISI-6042]: /ISI/issues/ISI-6042
[ISI-6046]: /ISI/issues/ISI-6046
