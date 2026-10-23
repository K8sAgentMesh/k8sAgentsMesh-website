---
title: K8sAgentMesh overview
description: What K8sAgentMesh is, what lives in the module, and the rules it extracts under.
---

K8sAgentMesh is the runtime-agnostic **AgentMesh** seam: the generic mesh
surfaces of the AgentMesh architecture that any platform can host for standing
AI coding agents on Kubernetes.

It is **the mesh layer — communication, discovery, and memory for
self-orchestrating agent teams.**

## What lives in the module

| Package | Contents |
| --------- | ----------------------------------------------------------- |
| `mesh` | RuntimeAdapter 7-op contract (Spawn / Register / Route / Hibernate / Wake / Stop / Recreate), per-pod Gateway process manager, router, lifecycle state machine, child-process substrate, runtime adapters (opencode #1, codex #2); Supervisor-side registration seams — `Registry` store interface, registration `Ingress`, TTL-prune `Sweeper`, health-sweep `SupervisorHealth` loop, route-to-endpoint selection |
| `a2a` | A2A wire types (Task / Event / Status / AgentCard / ModelRoute) |
| `apis/mesh/v1alpha1` | Mesh-owned CRD contracts — `MeshPool` (standing band, saturation, D4.2 lifecycle knobs, registration heartbeat/TTL), `MeshRoute` (selection strategy, recreate SLO, fallback), `MeshTelemetry` (per-event emission, emitter `none\|otel`, metric namespace) — plus deepcopy and CRD YAML in `apis/mesh/v1alpha1/crd/`. Types + YAML only, no controller. |

See [Concepts — Architecture](/concepts/architecture/) for the shape of each
surface.

## Hosts, not owners

K8sAgentMesh is host-agnostic by design. **k8squad is host #1** (the reference
adopter): its role-based scheduling plugs in as a POLICY on the mesh scheduling
interface; CRD shapes, `coord.*` guards, telemetry spine, board/SCM and memory
stay host-side behind the seam. A second adopter maps the same elements onto
its own equivalents.

See [Host integration](/docs/host-integration/) for the adoption path.

## Extraction-clean rule

No package in this module may import `github.com/K8squad/K8squad/*`. The guard
runs in CI (`hack/extraction-clean.sh`).

## Status

**P3 extraction is complete** — stories P3.1–P3.8 are done, host #1
(k8squad) is cut over to the module, and
the mesh-owned CRD contracts (`MeshPool`, `MeshRoute`, `MeshTelemetry`) are
published in `apis/mesh/v1alpha1`. The code is lifted, not rewritten, from the
proven seam in k8squad (P1 prototype + P2 second-adapter proof: zero
control-plane change).

## License

Apache-2.0.
