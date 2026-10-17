---
title: Roadmap
description: K8sAgentMesh P3 extraction stories and their status.
---

The K8sAgentMesh module is extracted from the proven seam in k8squad
(P1 prototype + P2 second-adapter proof). The P3 story set below tracks the
lift; status reflects the current state of the main repo.

| Story | Title | Status |
| ----- | --------------------------------------------------------- | ------ |
| P3.1 | Org + repo + module skeleton | Done |
| P3.2 | Lift A2A wire types; host re-export alias | Done |
| P3.3 | Lift `mesh` core + adapters behind injected builders | Done |
| P3.4 | Registration + supervisor seams (`Registry`/`Supervisor`) | Done |
| P3.5 | `SchedulingPolicy` interface; RolePool as policy #1 | Done |
| P3.6 | Lifecycle-event contract + gauge inputs; OTel impl stays host-side | Done |
| P3.7 | Host-#1 cutover: k8squad pins the module, suite goes green | Done |
| P3.8 | Mesh-owned CRD contracts: `MeshPool`/`MeshRoute`/`MeshTelemetry` | Done |

## What shipped in P3

- **The module** — `github.com/K8sAgentMesh/K8sAgentMesh` with the `mesh`, `a2a`
  and `apis/mesh/v1alpha1` packages, lifted from k8squad with behavior fidelity
  (lifted, not rewritten).
- **The seams** — `RuntimeAdapter` (7 ops), `Registry` store, registration
  `Ingress`, TTL-prune `Sweeper`, `SupervisorHealth` loop, `SchedulingPolicy`,
  `LifecycleObserver` event contract, and process-state gauge inputs.
- **The CRD posture** — a thin, host-agnostic Tier A CRD set
  (`MeshPool`, `MeshRoute`, `MeshTelemetry`) with structural-schema validation
  in CI; identity CRDs, scheduling policy config, the telemetry spine and
  rollout guards stay host-side.
- **Host #1 cutover** — k8squad pins the module and its suite goes green with
  zero control-plane change.

## What is deliberately next, not now

- A **NATS JetStream emitter** for the lifecycle-event contract (implementation
  #2) — deferred by board decision; the schema is ready for it.
- **A second host proof** — mapping the same seams onto another platform's
  equivalents, the final test that the seam is truly host-agnostic.
- **A controller** for the Tier A CRDs, if and when a mesh-owned reconcile loop
  is justified — the YAML ships as contracts first.

Track the work in the
[K8sAgentMesh GitHub org](https://github.com/K8sAgentMesh); the extraction
history is told in the [blog](/blog/).
