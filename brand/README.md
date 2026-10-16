# K8sAgentMesh brand assets

Brand identity kit (ISI-6046), direction B — Agent Constellation, board-accepted
on ISI-6042. Full usage rules: [`brand-guide.md`](./brand-guide.md).

```
brand/
  brand-guide.md            usage rules: clear space, min sizes, don'ts, motion
  tokens/tokens.css         canonical design tokens — single source of truth
  logos/                    SVG sources + PNG exports:
                              primary mark, navy tile, mono light/dark,
                              horizontal lockups (color + mono),
                              GitHub org avatar (circle-crop safe), favicon
  diagrams/                 diagram-style sample (Gateway Geometry line style)
  preview/brand-sheet.png   one-page overview of the whole kit
```

Integration notes:

- The website consumes tokens via `src/styles/theme.css` (`@import`s
  `brand/tokens/tokens.css`). Never redefine token values inline.
- `public/favicon.svg` is a copy of `logos/k8sagentmesh-favicon.svg` —
  update both when the favicon changes.
- Wordmark SVGs are exact vector outlines generated from the OFL fonts
  (Inter, JetBrains Mono); no font install needed to view them.
- Fonts are not committed. Self-host via `@fontsource-variable/*` packages
  (SIL OFL 1.1) when wiring the type system into the site.
