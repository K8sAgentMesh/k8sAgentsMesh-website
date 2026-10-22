# Design package — P3 Website UX (ISI-6416)

Design deliverables for the K8sAgentMesh marketing landing, ready for **P4
implementation (ISI-6417)**. Phase P3 of the ISI-6394 plan (rev 3). Owner:
Graphic Designer.

| File | Contents |
|---|---|
| `ia.md` | Information architecture — URL ownership, site map, nav model, landing→docs link contract, responsive model, changes vs. the shipped landing |
| `wireframes/landing-desktop.svg` | Annotated desktop wireframe (≥48rem), 5 bands + header/footer |
| `wireframes/landing-mobile.svg` | Annotated mobile wireframe (<48rem), stacked layout |
| `visual-design-spec.md` | Token → component mapping, type scale, spacing, motion, diagram standards, a11y checklist, definition of done |
| `landing-copy.md` | Full copy deck — hero, architecture band, how-to-use, features, footer, meta/OG |
| `diagrams/architecture-overview.mmd` | Mermaid source for the landing Architecture band (parse-validated against the repo's mermaid) |
| `diagrams/runtime-adapter-7op.mmd` | Compact 7-op contract strip (fallback / secondary visual) |

## The one-sentence brief

Single-page landing: **Hero → Architecture (new: Mermaid diagram + 7-op +
hosts-not-owners) → How to use (3 steps) → Why (6 features) → Footer**, all
on-brand (Viking North-Cross palette, dark-first), every diagram Mermaid/SVG,
logo on every page via the header.

## Hard acceptance criteria (board-directed) — how this package meets them

- **Logo on every page:** header lockup retained on the landing; Starlight
  header covers docs (spec §6). No regression.
- **Mermaid/SVG only, no ASCII art:** the Architecture band diagram is Mermaid
  (`diagrams/*.mmd`), rendered through the site's astro-mermaid theme; the
  wireframes are SVG. No ASCII anywhere in the deliverables.
- **Legible light + dark:** landing Mermaid inherits the pinned
  `MERMAID_THEME_VARIABLES` (self-contained dark-navy node surfaces); wireframe
  SVGs use the dark-safe brand palette; text colors use the AA-verified
  `*-strong` token variants (spec §1, §7).

## Grounding

- Brand: `brand/tokens/tokens.css` (canonical, board-locked), `brand/brand-guide.md`
- Vocabulary: `src/content/docs/concepts/architecture.md`, `…/hosts.md`,
  `src/content/docs/docs/quickstart.md`
- Scaffold: Astro + Starlight (ISI-6045/6047), Mermaid via astro-mermaid
  (`astro.config.mjs`)

## Notes for P4

- Implement against `main` — the stale `design/isi-6416-landing-ux` branch
  predates the content-complete build; do not merge it.
- All internal hrefs need `import.meta.env.BASE_URL` prefixing (Pages base
  path), as the current `index.astro` does.
- The two `.mmd` files parse-clean against the repo's mermaid version
  (validated 2026-10-22). Render check happens naturally in the P4 build
  preview; no separate raster export is required for Mermaid.
