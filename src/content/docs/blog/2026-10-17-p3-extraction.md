---
title: "The P3 extraction: lifting the mesh out of k8squad"
description: "How the proven AgentMesh seam in k8squad became the standalone K8sAgentMesh module — eight stories, one rule: lifted, not rewritten."
---

*2026-10-17*

K8sAgentMesh did not start as a design document. It started as a seam inside
k8squad — a platform for self-orchestrating agent teams on Kubernetes — that
kept proving itself: a P1 prototype, then a P2 second-adapter proof with
**zero control-plane change**. P3 was the natural next move: lift that seam
into its own runtime-agnostic module that any platform can host.

This post is the story of the lift, story by story.

## The rule: lifted, not rewritten

Every P3 story moved proven code, not ideas. The fidelity rule kept the
extraction honest, and one guard enforced it in CI: **no package in the
module may import the host.** CRD shapes are cross-checked against Go JSON
tags under the same rule — extraction-clean applies to shapes exactly as to
imports.

## P3.1 — Org + repo + module skeleton

The `K8sAgentMesh/K8sAgentMesh` repository, Go module skeleton, and CI came
first, so every later story landed on a running build.

## P3.2 — A2A wire types

The `a2a` package — Task, Event, Status, AgentCard, ModelRoute — moved
first because everything speaks it. Hosts re-export through an alias, so
existing call sites keep compiling while they migrate.

## P3.3 — Mesh core + adapters behind injected builders

The heavy lift: the RuntimeAdapter 7-op contract, the per-pod Gateway, router,
lifecycle state machine, and child-process substrate, with the runtime
adapters composed through injected builders instead of hard-coded runtimes.

## P3.4 — Registration + supervisor seams

The supervisor side became interfaces: a `Registry` store, registration
`Ingress`, a TTL-prune `Sweeper`, and the `SupervisorHealth` loop. Hosts own
the store; the mesh owns the mechanism.

## P3.5 — SchedulingPolicy

"The loop is the mesh's, the decisions are the policy's." The target-N
scheduler loop moved into the module; k8squad's RolePool scheduling plugged
back in as policy #1 — the second zero-control-plane-change proof, this time
for scheduling.

## P3.6 — The lifecycle-event contract

Route, spawn, and wake events got a formal, transport-agnostic contract
(`mesh/EVENTS.md`): the Gateway is the sole producer, the host-pluggable
`LifecycleObserver` the sole consumer, and no event ever carries a
telemetry-SDK type. The OTel implementation stayed host-side.

## P3.7 — Host #1 cutover

k8squad pinned the module: imports re-pointed, aliases re-exported, the full
suite green. The seam it had proven in production was now the module it
consumed — tagged **v0.1.0**.

## P3.8 — Mesh CRD contracts

The Tier-A CRDs — `MeshPool`, `MeshRoute`, `MeshTelemetry` — shipped as types
+ YAML, no controller, with shapes derived from the already-proven interfaces
rather than designed ahead of them. Board review fixed the emitter to
`none|otel` and kept `MeshRoute.fallback` per-host.

## What it means

With P3 complete, the mesh layer is a standalone, host-agnostic Go module:
communication, discovery, scheduling mechanism, lifecycle, and event
contracts for standing agent teams — pinned by its first host and ready for
a second.
