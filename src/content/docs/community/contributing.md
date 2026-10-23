---
title: Contributing
description: How to build, test, and contribute to K8sAgentMesh and this website — the extraction-clean and docs-sync guards included.
---

Thanks for contributing. Two repos, two very small checklists.

## The module (K8sAgentMesh)

```bash
git clone https://github.com/K8sAgentMesh/K8sAgentMesh.git
cd K8sAgentMesh
go build ./... && go test ./...
```

Non-negotiables:

- **Extraction-clean** — no package may import
  `github.com/K8squad/K8squad/*`. The guard runs in CI
  (`hack/extraction-clean.sh`). It applies to CRD shapes too — every spec
  property is cross-checked against the Go types' JSON tags
  (`hack/crd-structural-validate.sh`).
- **Mechanism, not policy** — mesh code must stay host-agnostic. If a change
  needs a host concept to make sense, it belongs host-side.
- **Interfaces are lifted, not extended casually** — seams like
  `LifecycleObserver` stay exactly as proven; host needs compose on top.

Contribution flow: open an issue first for anything non-trivial, then a PR
with tests. New surface area needs a tracked story before it needs code.

## The CRD contracts

`MeshPool` / `MeshRoute` / `MeshTelemetry` shapes must derive from proven
interfaces (Registry, SchedulingPolicy, LifecycleObserver) — never designed
ahead of them. Tier-C concerns (identity, policy config, telemetry spine,
guards, memory) are never mesh-owned; see
[Concepts — CRD contracts](/concepts/crds/).

## This website (k8sAgentsMesh-website)

```bash
git clone https://github.com/K8sAgentMesh/k8sAgentsMesh-website.git
cd k8sAgentsMesh-website
npm ci
npm run dev        # local preview at localhost:4321
npm run build      # what CI runs
npm run check:docs # docs-sync check against the live main repo
```

Rules:

- **Design tokens are canonical in `brand/tokens/tokens.css`** — never
  redefine token values inline. Palette changes go through a PR to that
  directory only (the core hexes are board-locked).
- **Docs stay in sync with the main repo.** The docs-sync check
  (`scripts/check-docs-sync.mjs`, run in CI) verifies the module-surface
  claims this site makes — packages, CRD kinds, adapter ops, seams, release
  tags — against the live `K8sAgentMesh/K8sAgentMesh` repository. If you
  change a claim here or in the module, run `npm run check:docs` and update
  `src/data/main-repo-facts.json` to match reality.
- Dark mode is the primary theme; light is an override in
  `src/styles/theme.css`. The landing page carries its own light-mode override
  block.

## Docs pages

Content pages live under `src/content/docs/` (concepts, docs, community) as
Markdown with `title` and `description` frontmatter. Keep claims checkable —
if a page asserts something about the module, it should be covered by the
facts file.
