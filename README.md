# k8sAgentsMesh-website

Website + documentation for **K8sAgentMesh** — the mesh layer for agent teams
on Kubernetes.

- **Stack**: [Astro](https://astro.build) + [Starlight](https://starlight.astro.build) (SSG) — static output, markdown-native docs, built-in dark mode, minimal JS.
- **Design system**: tokens live in one canonical location, [`brand/tokens/tokens.css`](brand/tokens/tokens.css) — spacing, radii, dark-mode-first neutrals are stable; brand palette and typography are **placeholders** until the brand identity kit lands (then integrate them there only).
- **Deploy**: GitHub Pages from CI at `https://k8sagentmesh.github.io/k8sAgentsMesh-website/` until a custom domain is chosen.

## Layout

```
brand/tokens/     canonical design tokens (CSS custom properties)
src/pages/        standalone landing page at `/`
src/content/docs/ Starlight docs (overview, roadmap, concepts)
src/styles/       Starlight theme mapping onto the brand tokens
.github/          CI: build check (PRs) + Pages deploy (main)
```

## Quality targets

- Lighthouse ≥ 95 (static HTML, system font stacks, no webfont fetch, no client framework).
- WCAG AA contrast; fully responsive; dark mode is the default.

## Develop

```bash
npm install
npm run dev     # local dev server
npm run build   # static build to dist/
```

## License

Apache-2.0 — see [LICENSE](LICENSE).
