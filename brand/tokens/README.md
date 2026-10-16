# brand/tokens — canonical token location

`tokens.css` is the single canonical home for K8sAgentMesh design tokens.
Site styling must consume tokens from here (via `src/styles/theme.css`),
never redefine them inline.

Current state:

- **Stable**: spacing scale, radii, dark-mode-first neutral ramp.
- **Placeholder**: brand palette (`--mesh-brand-*`) and typography
  (`--mesh-font-*`) ramps. Final values land from the brand identity kit
  (ISI-6046) — integrate them **in this file only**, then adjust the Starlight
  mapping in `src/styles/theme.css`.

Change tokens via PR to this directory.
