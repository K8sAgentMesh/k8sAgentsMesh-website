---
title: Scheduling
description: The SchedulingPolicy seam — the mesh runs a generic target-N loop; who deserves a slot is host policy.
---

Scheduling on K8sAgentMesh is split the way the rest of the mesh is: the module
owns the **mechanism**, the host owns the **policy**.

## The seam

```go
// mesh.SchedulingPolicy — the host implements the decision.
// The mesh runs the generic target-N loop that consults it.
```

The module ships a **generic target-N scheduler loop**: keep N standing agents
of a kind, decide which endpoints to spawn, park, or prune, and feed route
selection. What it never decides is *who deserves a slot* — that is injected as
a `SchedulingPolicy`.

## Policy #1: RolePool

**k8squad is host #1**: its role-based scheduling plugs in as a POLICY on the
mesh scheduling interface. Its `RolePool` remains host #1's source of truth and
**projects into `MeshPool` semantics** via the P3.5 seam — it is not replaced.
A second adopter writes its own policy against the same interface.

## What the mesh consumes

`MeshPool` (Tier A CRD, `apis/mesh/v1alpha1`) carries the knobs mesh code
itself consumes: the standing band, saturation, the D4.2 lifecycle knobs, and
the registration heartbeat/TTL. Scheduling *policy config* stays host-side —
Tier C, never mesh-owned (see [CRD contracts](/concepts/crds/)).

## Route selection vocabulary

When a task arrives, the router selects an endpoint with a bounded vocabulary:

- `idle` — a ready process took the task,
- `overflow` — no process existed; one was recreated from the envelope
  (the ≤3 s recreate-SLO path),
- `wake` — a hibernated process was woken (S4).

Every selection is reported as a `RouteEvent` through the
[lifecycle-event contract](/concepts/telemetry/) — one bounded vocabulary from
scheduler to telemetry.
