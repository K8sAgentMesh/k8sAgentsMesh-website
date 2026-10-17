---
title: Hosts, not owners
description: K8sAgentMesh is host-agnostic by design — how host #1 (k8squad) adopts the seam and what stays host-side.
---

K8sAgentMesh is extracted from a real platform, but it is not a platform. The
module owns the generic mesh mechanism; every host keeps its own identity,
policies, and telemetry.

## What the module owns

- The RuntimeAdapter 7-op contract and runtime adapters,
- the per-pod Gateway process manager, router, and lifecycle state machine,
- the supervisor seams (`Registry`, `Ingress`, `Sweeper`, `SupervisorHealth`),
- the `SchedulingPolicy` seam and target-N scheduler loop,
- the `LifecycleObserver` event contract and A2A wire types,
- Tier-A CRD contracts (`MeshPool`, `MeshRoute`, `MeshTelemetry`).

## What stays host-side

- Identity CRDs and policy config (Role, RolePool, Team, ModelConfig...),
- the `coord.*` custody guards and board/SCM integration,
- the telemetry spine (`OtelConfig`) and the OTel/NATS emitters,
- per-team rollout flags,
- memory (host #1 uses MemKeys behind the temporal-memory contract).

## Host #1 — k8squad

k8squad is the **reference adopter**: the seam was proven there (P1 prototype,
P2 second-adapter proof), lifted into this module during P3, and at the P3.7
cutover k8squad **pins the module** — it imports `K8sAgentMesh` directly and
the full suite runs green, with its RolePool scheduling plugged in as
SchedulingPolicy #1. Its CRD shapes project into the mesh Tier-A semantics; its
aliases re-point to the module's packages.

## Host #2 — bring your own

A second adopter maps the same elements onto its own equivalents: its
scheduling model becomes a `SchedulingPolicy` implementation, its registration
store a `Registry` implementation, its telemetry an `LifecycleObserver`
emitter. Zero mesh-code change — that is the extraction-clean rule in action:

> No package in the module may import `github.com/K8squad/K8squad/*`.

The guard runs in CI (`hack/extraction-clean.sh`).
