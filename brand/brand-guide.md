# K8sAgentMesh Brand Guide — Viking North-Cross Constellation Compass

Board-locked direction (2026-10-17; kit approval card `ba1755b0`). This is the
synced copy for the website repo — the canonical original lives at
`branding/logo/brand-guide.md` in the agentMesh repo; re-sync from there when
the kit changes. It supersedes the earlier **Agent Constellation** guide
(2026-10-16, decision card `cc83324a`): the logo suite, palette and usage
rules below describe the selected logo only.

## 1. Concept

A navigation compass whose cross rays ARE the mesh edges: they connect four
agent-bots at the cardinal points, secondary agent-stars on the diagonals, and
a bright hub core — a mesh of agents navigating together. The
nautical/cloud-native lineage (Kubernetes = helmsman; Helm, Harbor, Tiller) is
carried by the compass and the sail-hint arcs, with no literal boat.

## 2. Logo suite

All sources live in `brand/logos/` (SVG + PNG exports). The suite is synced
from the locked kit (`branding/logo/` in the agentMesh repo); the display assets
`k8sagentmesh-mark-navy-512.png`, `k8sagentmesh-avatar-512.png` and
`k8sagentmesh-favicon-32.png` are byte-identical to the K8sAgentMesh repo
`brand/logo.png`, `brand/avatar.png` and `brand/favicon.png` rollout assets.
Wordmarks are exact vector outlines (no font dependency for viewers).

| Asset | File | Use |
|---|---|---|
| Primary mark (full color) | `logos/k8sagentmesh-mark.svg` + `-512/-256.png` | Hero surfaces on dark backgrounds (transparent bg) |
| Mark on navy tile | `logos/k8sagentmesh-mark-navy.svg` + `-1024/-512.png` | Cards, social tiles — the selected master as shipped |
| Monochrome light | `logos/k8sagentmesh-mark-mono-light.svg` + `-512.png` | One-color on dark surfaces (engraved, print, single-hue UI) |
| Monochrome dark | `logos/k8sagentmesh-mark-mono-dark.svg` + `-512.png` | One-color on light surfaces |
| Horizontal lockup | `logos/k8sagentmesh-lockup-horizontal.svg` (+ mono light/dark, + `-1600.png`) | Site header, docs, README |
| GitHub org avatar | `logos/k8sagentmesh-avatar.svg` + `-512/-256/-128.png` | Org avatar — content sits inside a circle-safe zone, survives circle/square crops |
| Favicon | `logos/k8sagentmesh-favicon.svg` + `-64/-32/-16.png` | Browser tab; simplified cross + hub core + bots, verified legible at 16px |

`public/favicon.svg` is a copy of `logos/k8sagentmesh-favicon.svg` — update
both when the favicon changes.

## 3. Palette (locked)

- Background radial gradient: `#101B30` (focus, center-up) → `#0B1220` → `#070D17`
- Primary gradient (rays, bot strokes): `#7DE9FA` → `#2DD4BF`
- Diagonal accents: `#38BDF8` → `#22D3EE`
- Stars: satellite `#A5F3FC`; hub halo / antenna tips / north pointer `#E0FBFF`; hub center + reverse ink `#FFFFFF`
- Sail arcs: `#5EEAD4` at 0.35–0.5 opacity
- Bot hull: `#0E1B2E`

Tokens ship as `--k8sam-*` CSS variables in `brand/tokens/tokens.css`
(canonical, board-locked — the 6 CORE gradient anchors change via PR to that
directory only), with `tokens.json` as the machine-readable twin in the kit.
The website consumes them through `src/styles/theme.css`; never redefine token
values inline.

## 4. Usage rules

- **Clear space:** keep at least one compass-arm span (tip of N ray to hub
  core) free on all sides; nothing enters the tile.
- **Minimum sizes:** master 48px; favicon floor 16px (verified: cross arms, hub
  core, and a bot silhouette all read at 16px); OG as delivered at 1200x630.
- **Surfaces:** the master is for dark surfaces. On light surfaces use the
  mono-dark variant; the reverse (pure white) is for dark surfaces — never
  place white ink on light backgrounds.
- **Motion:** dashes may flow along the mesh links (compass arms stay static);
  respect `prefers-reduced-motion`. The bots never bounce or blink.
- **Don'ts:** no gradients other than the locked ones; no recoloring the bots'
  eyes or rays; no rotation of the compass; no emoji glyphs and no textPath
  anywhere in brand assets (sharp/librsvg compatibility); do not add a literal
  boat. Do not rebuild the wordmark in other fonts; do not stretch the lockup.

## 5. Typography and site design system

| Role | Family | Weights | License |
|---|---|---|---|
| Display / hero | Inter (variable) | Light 300, SemiBold 600 | SIL OFL 1.1 — OSS-safe |
| Body / UI | Inter (variable) | Regular 400 | SIL OFL 1.1 |
| Operator voice (code, CLI, diagrams, labels) | JetBrains Mono (variable) | Regular 400, SemiBold 600 | SIL OFL 1.1 |

- Headings: Inter SemiBold 600. Hero display: Inter Light 300, large sizes only.
- Body: Inter Regular, 16–18px, ~1.6 line height.
- Code, kubectl snippets, and diagram labels: JetBrains Mono.
- Self-host the variable files (`@fontsource-variable/inter`,
  `@fontsource-variable/jetbrains-mono`); CSS stacks in `tokens.css` fall back
  to system fonts first-paint.
- Architecture diagrams follow the brand-aligned Mermaid theme wired in
  `astro.config.mjs` (self-contained dark-navy node surfaces, teal/sky strokes);
  reference render: `brand/diagrams/diagram-style-sample.svg` / `.png`.
- Motion tokens (`--mesh-motion-*`): 120–200ms, `cubic-bezier(0.4, 0, 0.2, 1)`.

## 6. Rendering and re-sync

PNG exports render via **sharp/libvips** (cairosvg is broken on this machine
and must not be used). The kit's verification pipeline lives with the canonical
sources (`tools/build-kit.js`, 26/26 probes); re-run it there after any kit
change, then re-sync `brand/logos/` here — copy the kit exports byte-for-byte
where the size exists, render the rest with sharp (see
`scripts/generate-banner.mjs` for the engine), and regenerate
`brand/banner.png` + `public/banner.png`.

## 7. File map

```
brand/
  brand-guide.md            this guide (synced from the agentMesh kit)
  README.md                 kit contents + provenance
  tokens/tokens.css         canonical design tokens (CSS variables)
  logos/                    SVG sources + PNG exports (mark, lockups, avatar, favicon)
  diagrams/                 diagram-style sample (SVG + PNG)
  preview/brand-sheet.png   one-page kit overview
```

## 8. Changelog

- **2026-10-23** — synced to the board-locked Viking North-Cross Constellation
  Compass kit (acceptance card `ba1755b0`): logo suite, palette and usage
  rules now describe the selected logo; the Agent Constellation guide
  (2026-10-16, card `cc83324a`) is superseded.
