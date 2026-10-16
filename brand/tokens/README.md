# brand/tokens — canonical token location

`tokens.css` is the single canonical home for K8sAgentMesh design tokens.
Site styling must consume tokens from here (via `src/styles/theme.css`),
never redefine them inline.

State (after the brand identity kit, ISI-6046):

- **Final**: brand palette (Agent Constellation: deep-space navy, k8s-blue
  routes, route-teal edges, A2A-green signal + semantic states), text-safe
  `*-strong` variants with light-theme AA overrides, typography stacks
  (Inter + JetBrains Mono, SIL OFL), motion tokens.
- **Stable**: spacing scale, radii, dark-mode-first neutral ramp.

Usage rule: raw brand colors (`#326CE5`, `#2DD4BF`, `#22C55E`) are for
graphics, large text, and dark-surface text (all ≥3.8:1, AA where applied);
body-size text uses the `*-strong` variants (≥6:1 on dark, ≥4.5:1 on light).
Contrast matrix and full rules: `../brand-guide.md` §4.

Change tokens via PR to this directory.
