---
title: Architecture
description: The K8sAgentMesh architecture — RuntimeAdapter contract, pod gateways, supervisor seams, A2A wire types, CRD posture, temporal memory.
---

K8sAgentMesh is a **protocol-first agent mesh for Kubernetes**: pod-level
gateways, standing A2A agents, ephemeral lifecycles, and a temporal memory
contract. This page is the map of how the pieces fit.

```text
            ┌──────────────────────────────────────────────┐
            │                 MESH MODULE                  │
            │                                              │
 A2A wire ─▶│  Router ──▶ Route selection ──▶ Registry      │
 (Task,      │                │                (endpoints)  │
  Event,     │         Per-pod Gateway                     │
  Status,    │          ├─ lifecycle state machine          │
  AgentCard, │          ├─ child-process substrate           │
  ModelRoute)│          └─ RuntimeAdapter (7 ops)            │
            │                 │                              │
            │  apis/mesh/v1alpha1 — MeshPool / MeshRoute /   │
            │  MeshTelemetry (CRD contracts, no controller)  │
            └──────────────────┬───────────────────────────┘
                               │ implements
                    ┌──────────▼──────────┐
                    │   HOST (e.g. k8squad)│
                    │  control plane,      │
                    │  scheduling POLICY,  │
                    │  telemetry spine,     │
                    │  memory backends      │
                    └─────────────────────┘
```

## The RuntimeAdapter 7-op contract

Everything a runtime must provide to host an agent on the mesh is seven
operations — the seam that makes the mesh runtime-agnostic:

1. **Spawn** — start an agent process in a pod.
2. **Register** — announce the agent and its capabilities on the mesh.
3. **Route** — deliver a wire task to the agent.
4. **Hibernate** — park a long-idle agent (S4) and free its resources.
5. **Wake** — restore a hibernated agent to serve work.
6. **Stop** — terminate an agent run cleanly.
7. **Recreate** — rebuild an agent after pod churn without losing identity.

Two adapters ship as references: `opencode` (#1) and `codex` (#2). A third
runtime means a new adapter — zero control-plane change.

## Pod gateways

Each pod runs a **per-pod Gateway** — the process manager that owns the
agent's lifecycle inside that pod. The gateway speaks the RuntimeAdapter
contract downward to the runtime and A2A wire traffic upward into the mesh. It
is the **sole producer** of lifecycle events, reported through its
`GatewayConfig.Observer` — never a telemetry SDK.

## Supervisor-side seams

Above the pods, the module defines the registration machinery as interfaces
(hosts provide the machinery):

| Seam | Role |
| --- | --- |
| `Registry` | Endpoint store: upsert / heartbeat / prune / deregister / lookup / sweep / list |
| `Ingress` | The registration surface the gateway POSTs to |
| `Sweeper` | TTL-prune loop for dead registrations |
| `SupervisorHealth` | Health-sweep loop |
| Route selection | The route-to-endpoint leg, with `idle` \| `overflow` \| `wake` vocabulary |

## A2A wire types

The `a2a` package owns the wire form: **Task**, **Event**, **Status**,
**AgentCard**, and **ModelRoute**. The module owns the wire shapes; hosts
stamp their own schema brand (e.g. `k8sagentmesh.a2a/v1` by default, hosts
override) and pin their accepted A2A revisions.

## Lifecycle

Agents are **standing** (registered, long-lived) but individually ephemeral:
pods churn, agents hibernate and wake. The lifecycle state machine makes every
transition explicit and replayable from the mesh's point of view — see
[Lifecycle](/concepts/lifecycle/).

## Scheduling as policy

The module ships a `SchedulingPolicy` interface and a generic target-N
scheduler loop. Who deserves a slot is **policy** — the host's — never baked
into the mesh. k8squad's role-based RolePool is policy #1. See
[Scheduling](/concepts/scheduling/).

## CRD posture

The module owns a **thin, host-agnostic CRD set** — only for the concerns mesh
code itself consumes, always mechanism-not-policy: `MeshPool`, `MeshRoute`,
`MeshTelemetry` (Tier A); the `MeshEndpoint` registration record and the
lifecycle-event schema (Tier B, Go contract types); identity CRDs, scheduling
policy config, the telemetry spine, custody guards and rollout flags are Tier
C — never mesh-owned. The full tier rules live on
[CRD contracts](/concepts/crds/).

## Temporal memory

The mesh defines a **temporal memory contract**: team context — decisions,
artifacts, conversation state — is durable and addressable across ephemeral
agent lifecycles, so a recreated agent resumes with its history intact. See
[Memory](/concepts/memory/).

## Where the implementation lives

| Package | Contents |
| --- | --- |
| `mesh` | Gateway, router, lifecycle, scheduling, registration seams, events, runtime adapters |
| `a2a` | Wire types |
| `apis/mesh/v1alpha1` | `MeshPool` / `MeshRoute` / `MeshTelemetry` types + CRD YAML |
