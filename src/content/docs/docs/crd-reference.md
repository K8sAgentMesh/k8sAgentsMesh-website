---
title: CRD reference — MeshPool, MeshRoute, MeshTelemetry
description: Field-level reference for the mesh-owned CRDs — MeshPool, MeshRoute, MeshTelemetry — in apis/mesh/v1alpha1.
---

The mesh owns a thin, host-agnostic CRD set (types + YAML, no controller).
For the design rules behind what is and is not mesh-owned, see
[CRD contracts](/concepts/crds/).

## MeshPool

Standing band of agents: saturation policy, lifecycle knobs, registration
heartbeat/TTL.

## MeshRoute

Route-to-endpoint selection: strategy, recreate SLO, fallback behaviour.

## MeshTelemetry

Per-event emission: emitter (`none` | `otel`), metric namespace.

## Where this content lands

Field-level tables are generated/curated in phase P2 of the website plan.
Until then, the source of truth is `apis/mesh/v1alpha1` (types) and
`apis/mesh/v1alpha1/crd/` (CRD YAML) in the product repo.
