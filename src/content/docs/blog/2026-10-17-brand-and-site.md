---
title: 'A brand, a name, and a content-complete site'
description: 'The Viking North-Cross Constellation Compass identity is live, and with it this site: full docs, concepts, blog, and community pages.'
pubDate: 2026-10-17
---

K8sAgentMesh has an identity and, as of today, a
[content-complete website](/) to match.

## The mark

The board-locked brand is the **Viking North-Cross Constellation Compass**: an
eight-point compass rose at the hub, two agents on a dotted orbit, routes
descending into the mesh. It carries the cloud-native nautical lineage —
kubernetes = helmsman, istio = sail, harbor = port — in one symbol, and stays
honest to the constellation story: the Northern Cross is itself a
constellation.

The site consumes it through design tokens (`--k8sam-*`, board-locked):
dark-mode-first, WCAG-checked contrasts, route-only motion. The
[brand kit](https://github.com/K8sAgentMesh/k8sAgentsMesh-website/tree/main/brand)
— logo suite, brand guide, tokens — lives in this repo.

## This site

The bootstrap shipped a skeleton to prove the pipeline first. As of today:

- **Home** — what the mesh is and how it works,
- **[Concepts](/concepts/architecture/)** — architecture, lifecycle,
  scheduling, telemetry, memory,
- **[Docs](/docs/)** — overview, roadmap, host-integration guide,
- **[Blog & changelog](/blog/)** — the P3 extraction story,
- **[Community](/community/)** and
  **[contributing](/community/contributing/)** — where to talk and how to help.

The docs track the main repo: a CI check verifies the site's module-surface
claims against `K8sAgentMesh/K8sAgentMesh` on every run, so the site cannot
silently drift.

## Try it

Dark mode is the default (the brand is dark-first); light mode is one toggle
away, and every page is responsive. File site issues in the
[website repo](https://github.com/K8sAgentMesh/k8sAgentsMesh-website) — PRs
welcome.
