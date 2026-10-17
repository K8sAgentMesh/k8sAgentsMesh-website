---
title: Community
description: Where to talk about K8sAgentMesh, how to report issues, and how the project is run.
---

K8sAgentMesh is a young Apache-2.0 open-source project with one host and a
small crew: an open, protocol-first agent mesh for Kubernetes — communication,
discovery, and memory for self-orchestrating agent teams. The fastest way to
reach us is the repository.

## Where to talk

- **Issues and feature requests:**
  [github.com/K8sAgentMesh/K8sAgentMesh/issues](https://github.com/K8sAgentMesh/K8sAgentMesh/issues)
- **This website's source:**
  [github.com/K8sAgentMesh/k8sAgentsMesh-website](https://github.com/K8sAgentMesh/k8sAgentsMesh-website)
- **Discussions:** use the issue tracker for now — we'll open a discussions
  board as the community grows.
- **Blog & changelog:** the [blog](/blog/) tells the extraction story and
  announces releases as they ship.

## Reporting bugs

Open an issue with:

1. the module version (`go list -m github.com/K8sAgentMesh/K8sAgentMesh`),
2. a minimal reproducer (Go test or sequence of mesh operations),
3. what you expected vs. what happened.

For security-sensitive reports, prefer a private vulnerability report on the
repository over a public issue — do not post exploit details publicly.

## How the project is run

- **Hosts, not owners** — adopters keep their own control planes and plug in
  behind the seams. k8squad is host #1, the reference adopter.
- **Lifted, not rewritten** — code moves from the proven reference seam with
  behavior fidelity; the [roadmap](/docs/roadmap/) documents every story.
- **Extraction-clean** — no package in the module may import
  `github.com/K8squad/K8squad/*`; the guard runs in CI.
- **Docs stay in sync** — the website's module-surface claims are verified
  against the live main repo by a CI check, so the site cannot silently drift.

## Conduct

Be precise, be kind. The project runs on review — of code, of designs, and of
docs — and everyone doing that work deserves a respectful thread. Hostile,
harassing, or exclusionary behavior is not welcome.

## Adopting the mesh

Building a second host? That is the best contribution there is — read
[Concepts — Hosts](/concepts/hosts/) for what the module owns and what stays
host-side, then open an issue early so the seams can be proven against your
platform too.

Want to contribute code or docs? See [Contributing](/community/contributing/).
