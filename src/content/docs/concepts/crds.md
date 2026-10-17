---
title: CRD contracts
description: The thin, host-agnostic CRD set the module owns — MeshPool, MeshRoute, MeshTelemetry — and the tier rules for what is never mesh-owned.
---

K8sAgentMesh owns a **thin, host-agnostic CRD set** — only for the concerns
mesh code itself consumes. Types + YAML only, no controller.

## The rule

A CRD is mesh-owned **iff** all three hold:

1. mesh code consumes it,
2. it is host-reference-free,
3. it is mechanism, not policy.

## Tier A — shipped in the module (`apis/mesh/v1alpha1`)

| CRD            | Owns                                                                                                   |
| -------------- | ------------------------------------------------------------------------------------------------------ |
| `MeshPool`     | Standing band, saturation, D4.2 lifecycle knobs, registration heartbeat/TTL                             |
| `MeshRoute`    | Selection strategy, recreate SLO, fallback                                                              |
| `MeshTelemetry`| Per-event emission, emitter `none\|otel`, metric namespace                                               |

Shapes derive from the lifted, proven interfaces (P3.4 `Registry`, P3.5
`SchedulingPolicy`, P3.6 `LifecycleObserver`) — never designed ahead of them.

Host #1's RolePool **stays host #1's source of truth** and *projects* into
`MeshPool` semantics via the P3.5 seam — it is not replaced. Board decisions
fixed two shapes: the `MeshTelemetry` emitter ships `none|otel` only (a NATS
emitter was deferred), and `MeshRoute.fallback` stays (host #1 uses `legacy`,
host #2 uses `fail`).

The CRD YAML passes structural-schema validation in CI
(`hack/crd-structural-validate.sh`), which also cross-checks every spec
property against the Go types' JSON tags — **extraction-clean applies to CRD
shapes exactly as to imports**.

## Tier B — Go contract types, not CRDs

- The **`MeshEndpoint`** registration record behind the P3.4 `Registry`
  interface.
- The P3.6 **lifecycle-event schema** (`mesh/EVENTS.md`).

Hosts materialize these in their own store or CRD form.

## Tier C — never mesh-owned

Identity CRDs (Role, AgentRuntime, RolePool, Team, ModelConfig, ...),
scheduling policy config, the `OtelConfig` spine, `coord.*` custody guards,
per-team rollout flags (D9.3), and MemKeys all stay host-side. If it names a
host concept, it is not in the module.
