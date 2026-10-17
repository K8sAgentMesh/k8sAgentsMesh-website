# brand/tokens — canonical token location

`tokens.css` is the single canonical home for K8sAgentMesh design tokens.
Site styling must consume tokens from here (via `src/styles/theme.css`),
never redefine them inline.

State (after the brand identity kit, ISI-6046 — Viking North-Cross
Constellation Compass, kit approval card `ba1755b0`, 2026-10-17):

- **Final**: brand palette — the 6 board-locked CORE `--k8sam-*` anchors
  (navy depth gradient `#101B30/#0B1220/#070D17`, primary gradient
  glacier-cyan → compass-teal `#7DE9FA/#2DD4BF`, diagonal accents
  sky/signal-cyan `#38BDF8/#22D3EE`) plus supporting kit values, mapped
  onto text-safe `*-strong` variants with light-theme AA overrides,
  semantic states, typography stacks (Inter + JetBrains Mono, SIL OFL),
  motion tokens. Supersedes the earlier Agent Constellation baseline.
- **Stable**: spacing scale, radii, dark-mode-first neutral ramp.

Usage rule: raw brand colors are for graphics, large text, and
dark-surface text; body-size text uses the `*-strong` variants
(≥4.5:1 in both themes). Contrast matrix and full rules: brand guide
(ISI-6046 attachment; kit copy in the agentMesh repo
`branding/logo/brand-guide.md`).

Change tokens via PR to this directory.
