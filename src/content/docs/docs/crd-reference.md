---
title: CRD reference — MeshPool, MeshRoute, MeshTelemetry
description: Field-level reference for the mesh-owned CRDs — MeshPool, MeshRoute, MeshTelemetry — with copy-paste configuration examples and usage commands.
---

The mesh owns a thin, host-agnostic CRD set (types + YAML, no controller).
All three kinds live in the `mesh.k8sagentmesh.io/v1alpha1` API group and are
namespaced. For the design rules behind what is and is not mesh-owned, see
[CRD contracts](/concepts/crds/).

## Install the CRDs

The CRDs ship in the Helm chart (`crds/`) and as plain YAML in the product
repo (`apis/mesh/v1alpha1/crd/`). Installing the chart installs them;
otherwise apply them directly:

```sh
# From the Helm chart
kubectl apply -f deploy/helm/k8sagentmesh/crds/

# Or from the product repo
kubectl apply -f apis/mesh/v1alpha1/crd/

# Verify the API group is served
kubectl api-resources --api-group=mesh.k8sagentmesh.io
```

Expected output:

```
NAME            SHORTNAMES   APIVERSION                  NAMESPACED   KIND
meshpools       mpool,mpools mesh.k8sagentmesh.io/v1alpha1   true    MeshPool
meshroutes      mroute,mroutes mesh.k8sagentmesh.io/v1alpha1 true    MeshRoute
meshtelemetries mtelemetry   mesh.k8sagentmesh.io/v1alpha1   true    MeshTelemetry
```

## Example: a standing pool of coders

A `MeshPool` declares the standing band of agent processes for one
(team, role) pair: what every process is pre-loaded with (the envelope), how
many stand by (`standing`), what happens when all are busy (`saturation`),
the lifecycle knobs, and the registration heartbeat/TTL:

```yaml
apiVersion: mesh.k8sagentmesh.io/v1alpha1
kind: MeshPool
metadata:
  name: team-alpha-coders
  namespace: mesh
spec:
  poolId:
    team: team-alpha      # the isolation boundary the pool serves
    role: coder           # the role the pool's processes stand for
  envelope:
    runtimeType: codex    # the RuntimeAdapter flavor to spawn
    model: gpt-5-codex    # resolved model id; empty uses the runtime default
    skills:               # announced on the agent card
      - review
      - tests
    identity:             # stamped on the agent card and telemetry
      name: alpha-coder
      squad: team-alpha
  standing:
    min: 2                # processes the pool must hold (clamps to >= 1)
    max: 6                # saturation ceiling; 0/<=min keeps the band-less shape
  saturation:
    overflowPolicy: grow  # grow toward max, then transient cold-overflow;
                          # "reject" refuses with ErrNoIdleProcess instead
    growIdleShrink: 2m    # idle time before a grown slot is reclaimed
  lifecycle:
    checkInterval: 30s        # gateway state-sweep cadence
    hibernate: true            # arm the IDLE -> hibernate -> STOP ladder
    idleToHibernate: 5m       # idle bound before hibernation
    hibernateToStop: 4h       # idle/hibernated bound before stop (RAM reclaim)
  registration:
    heartbeatInterval: 30s    # registration ticker
    endpointTtl: 90s          # routability TTL (three missed beats)
```

Apply it and watch the printer columns:

```sh
kubectl apply -f meshpool.yaml
kubectl get mpools -n mesh
# NAME               TEAM         ROLE    MIN   MAX   STANDING
# team-alpha-coders  team-alpha   coder   2     6     2
```

### MeshPool field reference

| Field | Type | Default | Description |
| ----- | ---- | ------- | ----------- |
| `spec.poolId.team` | string | required | The isolation boundary the pool serves. |
| `spec.poolId.role` | string | required | The role the pool's processes stand for. |
| `spec.envelope.runtimeType` | string | required | Coding-agent flavor to spawn (the module's RuntimeAdapter set, e.g. `codex`, `opencode`). |
| `spec.envelope.model` | string | runtime default | Resolved model id; empty uses the runtime's default. |
| `spec.envelope.modelRoute` | object | — | BYO OpenAI-compatible provider seam: `endpoint`, `model`, `token` (secret material — never logged). |
| `spec.envelope.skills` | string[] | — | Skill set surfaced on the agent card. |
| `spec.envelope.identity` | object | — | Standing agent identity: `name` (required), `squad`, `project`. |
| `spec.envelope.workDir` | string | host default | Sandbox working directory. |
| `spec.envelope.env` | map | — | Extra process environment; values may be secret material. |
| `spec.envelope.source` | object | — | Per-process source-checkout layout: `teamMainDir` (read-only), `worktreeDir`, `branch`, `baseRef`. |
| `spec.standing.min` | int | required | Standing process count the pool must hold (values < 1 clamp to 1). |
| `spec.standing.max` | int | — | Saturation ceiling of the band; 0 or <= `min` keeps the band-less shape. |
| `spec.saturation.overflowPolicy` | string | `reject` | `grow` (grow toward max, then transient cold-overflow) or `reject` (refuse with `ErrNoIdleProcess`). |
| `spec.saturation.growIdleShrink` | duration | `2m` | How long a saturation-grown slot may stand idle before the sweep reclaims it. Consumed only when `overflowPolicy: grow`. |
| `spec.lifecycle.checkInterval` | duration | `30s` | Gateway state-sweep cadence. |
| `spec.lifecycle.hibernate` | bool | `false` | Arms the two-tier ladder (IDLE → hibernate → STOP). |
| `spec.lifecycle.idleToHibernate` | duration | `5m` | Idle bound before hibernation; consumed only when `hibernate` is armed. |
| `spec.lifecycle.hibernateToStop` | duration | `4h` | Idle/hibernated bound before the gateway terminates the process — the RAM reclaim. |
| `spec.lifecycle.alwaysUp` | bool | `false` | Exempts the pool from stop/hibernate: pinned ACTIVE/IDLE, floor 1 — the coordinator role. |
| `spec.registration.heartbeatInterval` | duration | `30s` | Registration ticker; each tick re-POSTs the endpoint set. |
| `spec.registration.endpointTtl` | duration | `90s` | Routability TTL — an endpoint whose last beat is older is unroutable. |

## Example: routing policy

A `MeshRoute` declares how the route leg picks a standing process and what it
does when it cannot route. `match` scopes the policy; absent means the
cluster default:

```yaml
apiVersion: mesh.k8sagentmesh.io/v1alpha1
kind: MeshRoute
metadata:
  name: team-alpha-coders
  namespace: mesh
spec:
  match:
    team: team-alpha   # scope to one team's dispatches
    role: coder        # scope to one role; empty matches every role of the team
  selection: preferIdle   # preferIdle | random | sticky
  lruTiebreak: true       # order equal-preference candidates least-recently-seen first
  recreateSlo: 3s         # arrival -> process-ready target on the recreate path
  fallback: legacy        # legacy (host #1's pre-mesh dispatch leg) | fail (host #2)
```

```sh
kubectl apply -f meshroute.yaml
kubectl get mroutes -n mesh
# NAME               TEAM         ROLE    SELECTION    FALLBACK
# team-alpha-coders  team-alpha   coder   preferIdle   legacy
```

### MeshRoute field reference

| Field | Type | Default | Description |
| ----- | ---- | ------- | ----------- |
| `spec.match.team` | string | — | Scopes the route policy to one team's dispatches. |
| `spec.match.role` | string | — | Scopes to one role; empty matches every role of the team. |
| `spec.selection` | string | `preferIdle` | Standing-process pick strategy: `preferIdle`, `random`, or `sticky`. |
| `spec.lruTiebreak` | bool | `true` | Orders equal-preference candidates least-recently-seen first (spreads wear, keeps caches warm). |
| `spec.recreateSlo` | duration | `3s` | Status-facing target the route leg observes: arrival → process-ready on the overflow/recreate path. |
| `spec.fallback` | string | `legacy` | No-route behavior: `legacy` (fall back to the host's pre-mesh dispatch leg) or `fail` (surface the error). |

## Example: lifecycle telemetry

A `MeshTelemetry` object is the declarative on/off switch and sink selector
over the lifecycle-event contract (`route`, `spawn`, `wake`). It references
the host's OTel spine; it does not duplicate it:

```yaml
apiVersion: mesh.k8sagentmesh.io/v1alpha1
kind: MeshTelemetry
metadata:
  name: team-alpha-events
  namespace: mesh
spec:
  scope:
    team: team-alpha   # scope emission to one team's pools; absent = cluster-wide
  emitter: otel        # none | otel ("nats" is reserved until it ships)
  namespace: k8sagentmesh   # metric prefix (host impl renders e.g. k8sagentmesh.mesh.*)
  events:              # subset of route|spawn|wake; empty means ALL events on
    - route
    - spawn
    - wake
  otel:
    spans: true        # mesh.route / mesh.spawn / mesh.wake spans
    metrics: true      # the namespace.* metric set
```

```sh
kubectl apply -f meshtelemetry.yaml
kubectl get mtelemetry -n mesh
# NAME                EMITTER   NAMESPACE      EVENTS
# team-alpha-events   otel      k8sagentmesh   [route,spawn,wake]
```

### MeshTelemetry field reference

| Field | Type | Default | Description |
| ----- | ---- | ------- | ----------- |
| `spec.scope.team` | string | — | Scopes emission to one team's pools. |
| `spec.scope.role` | string | — | Scopes to one role; empty matches every role of the team. |
| `spec.emitter` | string | `none` | Sink: `none` (events dropped) or `otel` (the host's OTel spine impl). |
| `spec.namespace` | string | emitter default | Metric prefix. |
| `spec.events` | string[] | all on | Per-event on/off subset of `route`, `spawn`, `wake` (max 3). Listing a subset turns the unlisted hooks off. |
| `spec.otel.spans` | bool | `true` | Turns the `mesh.route` / `mesh.spawn` / `mesh.wake` spans on/off. Consumed only when `emitter: otel`. |
| `spec.otel.metrics` | bool | `true` | Turns the `namespace.*` metric set on/off. Consumed only when `emitter: otel`. |

## Working with the resources

```sh
# List and inspect
kubectl get meshpools,meshroutes,meshtelemetries -n mesh
kubectl describe mpool team-alpha-coders -n mesh

# Field-level schema straight from the cluster
kubectl explain meshpool.spec.standing
kubectl explain meshroute.spec.selection
kubectl explain meshtelemetry.spec.otel

# Validate a manifest before applying
kubectl apply -f meshpool.yaml --dry-run=server
```

Two things to know when operating these objects:

- **No controller ships with the module.** The CRDs are contracts: mesh code
  consumes them, and a host controller (or your own) stamps defaults and
  status. `kubectl get` printer columns such as `STANDING` reflect whatever
  the consuming host writes into `status`.
- **Durations are Go-style strings** (`30s`, `5m`, `4h`); enums are validated
  by the schema (`selection`, `fallback`, `overflowPolicy`, `emitter`,
  `events`), so a typo is rejected at apply time, not at runtime.

The source of truth for the shapes is `apis/mesh/v1alpha1` (Go types) and
`apis/mesh/v1alpha1/crd/` (CRD YAML) in the product repo — CI cross-checks
every spec property against the Go types' JSON tags
(`hack/crd-structural-validate.sh`).
