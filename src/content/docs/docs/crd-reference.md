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

## Examples

Minimal, copy-pasteable configuration — one object per CRD. All three are
namespaced; apply them with `kubectl apply -f` after the quickstart install.

### MeshPool — a standing band of coders

```yaml
apiVersion: mesh.k8sagentmesh.io/v1alpha1
kind: MeshPool
metadata:
  name: team-alpha-coder
  namespace: mesh
spec:
  poolId:
    team: team-alpha
    role: coder
  envelope:
    runtimeType: opencode
    model: glm-4.6
  standing:
    min: 2
    max: 6
  saturation:
    overflowPolicy: grow # grow toward max, then transient overflow — or "reject"
  lifecycle:
    hibernate: true
    idleToHibernate: 10m
    hibernateToStop: 30m
  registration:
    heartbeatInterval: 15s
    endpointTtl: 60s
```

### MeshRoute — prefer idle agents, recreate within the SLO

```yaml
apiVersion: mesh.k8sagentmesh.io/v1alpha1
kind: MeshRoute
metadata:
  name: team-alpha-coder
  namespace: mesh
spec:
  match:
    team: team-alpha
    role: coder
  selection: preferIdle # preferIdle | random | sticky
  lruTiebreak: true
  recreateSlo: 30s
  fallback: legacy # legacy | fail
```

### MeshTelemetry — OTel emission for the lifecycle hooks

```yaml
apiVersion: mesh.k8sagentmesh.io/v1alpha1
kind: MeshTelemetry
metadata:
  name: cluster-default
  namespace: mesh
spec:
  emitter: otel # none | otel
  namespace: ksquad # metric prefix (ksquad → ksquad.mesh.*); empty uses the emitter default
  events: [route, spawn, wake]
  otel:
    spans: true
    metrics: true
```

Verify the objects landed:

```sh
kubectl get meshpools,meshroutes,meshtelemetries -n mesh
kubectl describe meshpool team-alpha-coder -n mesh
```

## Where this content lands

Field-level tables are generated/curated in phase P2 of the website plan.
Until then, the source of truth is `apis/mesh/v1alpha1` (types) and
`apis/mesh/v1alpha1/crd/` (CRD YAML) in the product repo.
