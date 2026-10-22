# Visual Design Spec — K8sAgentMesh landing

Phase **P3** of ISI-6394 (rev 3). Owner: Graphic Designer. Consumer: **P4
(ISI-6417)**. Governs the standalone landing page (`src/pages/index.astro`) and
its diagrams. Docs pages follow Starlight + `src/styles/theme.css` and are out
of scope here.

Everything in this spec maps to the canonical tokens in
`brand/tokens/tokens.css`. **Tokens are board-locked** — if a value below seems
missing, add a local alias on the page, never edit `brand/tokens/`.

Wireframes: `design/wireframes/landing-desktop.svg`,
`design/wireframes/landing-mobile.svg`. Copy: `design/landing-copy.md`.
IA: `design/ia.md`.

---

## 1. Theme model

- **Dark is the default experience.** Canvas `--mesh-neutral-0` (#0B0E14);
  brand navy surfaces `--mesh-brand-navy` (#0B1220) for emphasis panes.
- **Light theme** is keyed off `html[data-theme='light']` (explicit choice or OS
  preference), never a bare `prefers-color-scheme` media query — the shipped
  page already does this; keep the pattern.
- The theme toggle persists under the `starlight-theme` localStorage key so the
  preference follows the visitor between landing and docs. Do not introduce a
  second key.
- Light-theme text-safe brand colors are the `*:root[data-theme='light']`
  overrides in tokens.css (`--mesh-brand-primary-strong` #0F766E etc.). Raw
  compass teal #2DD4BF fails AA as body text on light — never use it for text
  there; it remains valid for graphics/large text and all dark-theme uses.

## 2. Type scale (landing)

| Role | Spec |
|---|---|
| H1 (hero) | Inter Variable Light 300 → fallback SemiBold per tokens; `clamp(2.1rem, 5vw, 3.4rem)`, line-height 1.15, letter-spacing −0.02em, max-width 21ch, centered |
| H2 (section) | Inter SemiBold 600, 1.6rem, letter-spacing −0.01em, centered, `--mesh-neutral-7` |
| H3 (card/step) | Inter SemiBold 600, 1.15–1.2rem, `--mesh-neutral-7` |
| Body / lede | Inter Regular 400; lede 1.15rem max 62ch `--mesh-neutral-5`; card body 0.95rem `--mesh-neutral-5` |
| Numerals / kickers / diagram labels | JetBrains Mono; kickers 0.8rem 600 uppercase +0.12em `--mesh-brand-accent-soft`; card numerals 0.8rem `--mesh-brand-accent-soft` |
| Nav links | 0.95rem (0.9rem under 48rem), `--mesh-neutral-5` → hover `--mesh-neutral-7` |

Fonts self-hosted via `@fontsource-variable/inter` and
`@fontsource-variable/jetbrains-mono` (both SIL OFL). The current page relies on
system fallbacks — P4 may add the fontsource packages as a polish step, but it
is not a launch blocker.

## 3. Component specs (wireframe annotations)

Annotation numbers match the circled numerals in the wireframes.

1. **Header.** Height 56px, bottom hairline `--mesh-neutral-2`. Lockup height
   1.75rem; theme-aware pair (full-color on dark, mono-dark on light) with the
   unused variant `display:none` so assistive tech sees exactly one logo.
   Clear space per brand guide §2 (≥22% of mark height).
2. **Hero.** Padding `--mesh-space-9` top, `--mesh-space-8` bottom, centered.
   Kicker pill: 1px border `--mesh-neutral-3`, radius `--mesh-radius-pill`.
   CTAs: `.btn-primary` = `--mesh-brand-primary` bg / `--mesh-neutral-0` text
   (light theme: #0F766E/#FFF); `.btn-ghost` = 1px `--mesh-neutral-3` border,
   `--mesh-neutral-7` text. Both radius `--mesh-radius-md`, padding
   `var(--mesh-space-3) var(--mesh-space-6)`.
3. **Architecture band (new).** Section padding `--mesh-space-8` vertical.
   Diagram container: max-width 56rem, centered, no card chrome around the
   Mermaid render itself (diagrams sit on the page canvas per §7). Caption
   line under the diagram: 0.9rem `--mesh-neutral-5`, centered, with the
   deep-link. Rail: two cards side-by-side (gap `--mesh-space-5`), stacking
   under 48rem. Cards use the shared card spec: `--mesh-neutral-1` bg, 1px
   `--mesh-neutral-2` border, radius `--mesh-radius-lg`, padding
   `--mesh-space-5`, hover border `--mesh-brand-primary`.
4. **How-to-use band.** 3-column strip ≥48rem (gap `--mesh-space-5`), stacked
   below. Step cards share the card spec; the numeral is JetBrains Mono
   `--mesh-brand-accent-soft`. Each step card is an `<a>` (whole card
   clickable) with the deep links from ia.md §3. Section CTA centered below
   the strip.
5. **Why/features band.** 3×2 grid ≥48rem, stacked below. Cards are links;
   keep the shipped hover (border → `--mesh-brand-primary`, no underline).
6. **Footer.** Top hairline `--mesh-neutral-2`, 0.9rem `--mesh-neutral-5`,
   space-between row wrapping on narrow screens.

## 4. Spacing & layout

- Content column: max-width 72rem, side padding `--mesh-space-5`.
- 4px spacing base — use only `--mesh-space-*` tokens.
- Band rhythm: `--mesh-space-8` vertical padding per section; hero is the
  exception (`--mesh-space-9` top).
- Single breakpoint 48rem (matches shipped CSS). No hamburger below that; see
  ia.md §6 for the overflow escape hatch.

## 5. Interaction & motion

- Route-only motion rule (brand guide §7): nothing on the landing animates
  except hover color/border transitions ≤ `--mesh-motion-normal` (200ms),
  easing `--mesh-motion-ease`. Respect `prefers-reduced-motion` by dropping
  transitions.
- Focus: `:focus-visible` outline 2px `--mesh-brand-primary-strong`,
  offset 2px (shipped). Keep on all new links/cards.
- Skip-link stays first in `<body>`.

## 6. Logo usage on the landing

- Header: horizontal lockup pair as shipped (`k8sagentmesh-lockup-horizontal.svg`
  dark / `k8sagentmesh-lockup-mono-dark.svg` light).
- Optional hero backdrop (P4 polish, not launch-blocking): primary mark
  `k8sagentmesh-mark.svg` at 8–12% opacity, right of the hero copy on ≥64rem,
  hidden below. Never recolor, rotate, or animate the mark (brand guide §3).

## 7. Diagram standards (hard board criteria)

Applies to the landing Architecture band and any future landing diagram.

**Mermaid first.** The site already wires `astro-mermaid` with
`MERMAID_THEME_VARIABLES` in `astro.config.mjs` — self-contained dark-navy node
surfaces with light text, so diagrams read identically on both themes; strokes
on the page canvas use #0E7490 (≥3:1 on light and dark). Landing Mermaid
diagrams MUST render through that pipeline (i.e. a ```mermaid fence or the
astro-mermaid component) — do not hand-roll per-diagram theme overrides. The
vetted sources for the landing live in `design/diagrams/`:

- `architecture-overview.mmd` — mesh module vs host, router/registry/gateway,
  A2A wire types, CRD posture.
- `runtime-adapter-7op.mmd` — the 7-op contract as a compact horizontal strip
  (fallback visual if the overview ever renders too wide on mobile).

**Authoring rules for landing Mermaid:**

- `flowchart` only (`LR` or `TB`); no sequence/state diagrams on the landing
  (docs may use them).
- ≤6 top-level nodes, labels ≤ 4 words, `<br/>` for line breaks — guarantees
  no horizontal scroll at 390px.
- No ASCII-art anywhere; no embedded raster images.
- Keep node wording identical to the docs' architecture page vocabulary
  (Router, Registry, Gateway, RuntimeAdapter) — the landing diagram is a
  teaser, not a second source of truth.

**Standalone SVG** (only if Mermaid genuinely cannot express the visual): follow
brand guide §6 Gateway Geometry — teal agent circles (2.5px stroke), double-ring
rounded-rect gateways (k8s-blue), cylinder memory stores, k8s-blue routes with
arrowheads, JetBrains Mono labels; dark-safe palette (`--k8sam-*` hexes); minimum
font size 11px at final render size; ship both `.svg` and a 2× `.png`.

## 8. Accessibility checklist for P4

- [ ] All new links reachable by keyboard in source order; focus outline visible.
- [ ] Diagram has an accessible name (`aria-label` on the container or a
      visually-hidden caption) — Mermaid renders SVG, which is not
      self-describing.
- [ ] Card links announce destination context (the visible `h3` + body copy is
      sufficient; no bare "read more").
- [ ] Light theme: verify the four text-on-canvas pairs against tokens.css
      ratios (body #38435C, secondary #5A6883, links #0F766E, headings #10131C).
- [ ] 200% text zoom: bands stack without overlap; diagram may scroll
      horizontally only past 200% zoom.
- [ ] `prefers-reduced-motion: reduce` disables transitions.

## 9. Definition of done for the landing (what P5 checks)

1. Header lockup present and theme-correct on every page (landing + docs).
2. Architecture band present with a Mermaid diagram rendered through the site
   theme; zero ASCII-art on the page.
3. Landing legible in light and dark (screenshot both at 1280 and 390).
4. All links in ia.md §3 resolve (no 404 under the Pages base path).
5. Copy matches `design/landing-copy.md` verbatim (modulo P4 typos fixes).
