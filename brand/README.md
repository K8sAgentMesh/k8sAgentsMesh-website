# K8sAgentMesh brand assets

Brand identity kit — **Viking North-Cross Constellation Compass**, direction
board-locked 2026-10-17 (acceptance card `ba1755b0`). Full usage rules:
[`brand-guide.md`](./brand-guide.md).

The logo suite in `logos/` is synced from the locked kit sources
(`branding/logo/` in the agentMesh repo — `north-cross-master.svg`,
`north-cross-mono-dark.svg`, `north-cross-reverse.svg`,
`north-cross-favicon.svg`); the same artwork is rolled out as display assets
in the K8sAgentMesh repo `brand/` (`logo.png`, `avatar.png`, `favicon.png`,
`banner.png`). When the kit changes, re-sync `logos/` and regenerate the PNG
exports (the master/mono/reverse/favicon sizes that already exist in the kit's
`exports/` can be copied byte-for-byte; the rest render with
`sharp` — see `scripts/generate-banner.mjs` for the engine).

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
