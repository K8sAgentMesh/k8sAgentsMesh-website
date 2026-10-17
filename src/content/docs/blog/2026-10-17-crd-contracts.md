---
title: 'Mesh-owned CRD contracts: thin by design'
description: 'P3.8 published MeshPool, MeshRoute and MeshTelemetry — only the slice of configuration mesh code itself consumes.'
pubDate: 2026-10-17
---

**P3.8** closed the P3 set with the module's CRD posture:
[`apis/mesh/v1alpha1`](https://github.com/K8sAgentMesh/K8sAgentMesh) publishes
`MeshPool`, `MeshRoute` and `MeshTelemetry` — Go types plus CRD YAML,
**no controller**.

The rule for mesh-ownership is strict. A CRD is mesh-owned iff mesh code
consumes it, it is host-reference-free, and it is mechanism-not-policy:

- **Tier A — shipped:** `MeshPool` (standing band, saturation, D4.2 lifecycle
  knobs, registration heartbeat/TTL), `MeshRoute` (selection strategy,
  recreate SLO, fallback), `MeshTelemetry` (per-event emission, emitter
  `none|otel`, metric namespace).
- **Tier B — Go contract types, not CRDs:** the `MeshEndpoint` registration
  record and the lifecycle-event schema. Hosts materialize these in their own
  store or CRD form.
- **Tier C — never mesh-owned:** identity CRDs (Role, AgentRuntime, RolePool,
  Team, ModelConfig), scheduling policy config, the `OtelConfig` spine,
  custody guards, rollout flags.

k8squad's RolePool stays host #1's source of truth and *projects* into
`MeshPool` semantics via the P3.5 seam — it is not replaced. The shapes derive
from the lifted, proven interfaces, never designed ahead of them.

And the posture is enforced, not aspirational: the CRD YAML passes
structural-schema validation in CI, which also cross-checks every spec property
against the Go types' JSON tags — extraction-clean applies to CRD shapes
exactly as to imports.
