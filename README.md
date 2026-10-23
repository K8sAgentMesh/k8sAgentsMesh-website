# k8sAgentsMesh-website

Website + documentation for **K8sAgentMesh** — the mesh layer for agent teams
on Kubernetes.

- **Stack**: [Astro](https://astro.build) + [Starlight](https://starlight.astro.build) (SSG) — static output, markdown-native docs, built-in dark mode, minimal JS.
- **Brand**: the Viking North-Cross Constellation Compass identity kit lives in [`brand/`](brand/) — tokens in one canonical location, [`brand/tokens/tokens.css`](brand/tokens/tokens.css) (the six core `--k8sam-*` values are board-locked; change via PR to that directory only). Dark mode is the default theme; light is an override.
- **Deploy**: GitHub Pages from CI at `https://k8sagentmesh.github.io/k8sAgentsMesh-website/` until a custom domain is chosen.

## Content

| Section | Where | What |
| --- | --- | --- |
| Home | `src/pages/index.astro` | Hero with logo, animated concept diagram, feature grid, how-it-works, hosts section |
| Docs | `src/content/docs/docs/` | Overview, prerequisites, quickstart, host-integration guide |
| Concepts | `src/content/docs/concepts/` | Architecture, lifecycle, scheduling, telemetry, memory, CRD contracts, hosts |
| Community | `src/content/docs/community/` | Community index + contributing guide |

## Docs stay in sync with the module

The site's module-surface claims (packages, CRD kinds, adapter ops, seams,
release tags) are verified against the live
[`K8sAgentMesh/K8sAgentMesh`](https://github.com/K8sAgentMesh/K8sAgentMesh)
repository by `scripts/check-docs-sync.mjs` — claims live in
`src/data/main-repo-facts.json`. It runs in CI on every PR and weekly, so the
docs cannot silently drift from the code.

```bash
MAIN_REPO_PATH=/path/to/K8sAgentMesh npm run check:docs   # local run
```

## Layout

```
brand/            brand identity kit: logos, brand guide, canonical tokens
src/pages/        standalone landing page at `/`
src/content/docs/ Starlight content (docs, concepts, community)
src/styles/       Starlight theme mapping onto the brand tokens
scripts/          docs-sync check against the main repo
.github/          CI: build + docs-sync (PRs), Pages deploy (main), weekly docs-sync
```

## Quality targets

- Lighthouse ≥ 95 (static HTML, system font stacks, no webfont fetch, no client framework).
- WCAG AA contrast; fully responsive; dark mode is the default.
- Docs-sync check green against the main repo.

## Develop

```bash
npm ci
npm run dev     # local dev server
npm run build   # static build to dist/ (what CI runs)
```

## License

Apache-2.0 — see [LICENSE](LICENSE).
