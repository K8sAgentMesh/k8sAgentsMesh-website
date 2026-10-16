---
title: Architecture
description: The K8sAgentMesh architecture stub — RuntimeAdapter contract, pod gateways, A2A wire types, lifecycle, temporal memory.
---

K8sAgentMesh is a **protocol-first agent mesh for Kubernetes**: pod-level
gateways, standing A2A agents, ephemeral lifecycles, and a temporal memory
contract. This page is the architecture stub — the content-complete build
lands with the P3 docs gate.

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

## Pod gateways

Each pod runs a **per-pod Gateway** — the process manager that owns the
agent's lifecycle inside that pod. The gateway speaks the RuntimeAdapter
contract downward to the runtime and A2A wire traffic upward into the mesh.

## A2A wire types

The `a2a` package owns the wire form: **Task**, **Event**, **Status**,
**AgentCard**, and **ModelRoute**. The module owns the wire shapes; hosts stamp
their own schema brand (e.g. `k8sagentmesh.a2a/v1` by default, hosts override)
and pin their accepted A2A revisions.

## Lifecycle

Agents are **standing** (registered, long-lived) but individually ephemeral:
pods churn, agents hibernate and wake. The lifecycle state machine makes every
transition explicit and replayable from the mesh's point of view.

## Temporal memory

The mesh defines a **temporal memory contract**: team context — decisions,
artifacts, conversation state — is durable and addressable across ephemeral
agent lifecycles, so a recreated agent resumes with its history intact.

## Where the implementation lives

- Module: [github.com/K8sAgentMesh/K8sAgentMesh](https://github.com/K8sAgentMesh/K8sAgentMesh)
- Reference host: k8squad (host #1) — policies, CRDs, telemetry, and memory
  stay host-side behind the seam.
