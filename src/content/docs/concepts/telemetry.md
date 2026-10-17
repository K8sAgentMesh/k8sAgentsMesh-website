---
title: Telemetry
description: The lifecycle-event contract — Gateway as sole producer, host-pluggable LifecycleObserver, bounded-vocabulary events, gauge inputs.
---

The mesh is observable by contract, not by SDK. The P3.6 lifecycle-event
contract formalizes what the mesh reports; **how** it reaches your backend is
host-pluggable.

## Shape

| Role | Bearer | Notes |
| --- | --- | --- |
| Producer | `Gateway` (`mesh/gateway.go`) | The **sole** producer. It reports through its `GatewayConfig.Observer` and never touches a telemetry SDK — the extraction contract. |
| Emitter interface | `mesh.LifecycleObserver` (`mesh/lifecycle.go`) | Host-pluggable: injected by the composition root; nil is a valid no-op. All hooks are informational — an observer error can never fail the lifecycle. |
| Gauge inputs | `mesh.ProcessStateSnapshot` + `mesh.SnapshotProcessStates` (`mesh/events.go`) | Bounded per-state counts polled by the emitter on its own cadence. |

The contract is deliberately **transport-agnostic**: events carry identity,
bounded-vocabulary fields and timings, never a telemetry-SDK type. That is
what makes a second emitter possible.

## Events

### `RouteEvent` — `ObserveRoute(ctx, e)`

One routing decision: A2A arrival → process-ready (the ≤3 s recreate-SLO
window). `ctx` carries the dispatch request's trace context so an emitter can
parent the event to the run's trace.

| Field | Type | Schema |
| --- | --- | --- |
| `Team`, `Role`, `Pod`, `EndpointID` | `string` | Bounded routing identity (span attributes / metric label set). |
| `Selection` | `RouteSelection` | Vocabulary: `idle` \| `overflow` \| `wake`. |
| `Duration` | `time.Duration` | Arrival→ready wall-clock. |
| `Err` | `error` | Non-nil when the route failed (outcome vocabulary: `success` \| `error`). |

### `SpawnEvent` — `ObserveSpawn(ctx, e)`

One spawn or recreate with wall-clock duration. On the recreate path `ctx` is
the triggering route's context, so an emitter can nest it under the route.

| Field | Type | Schema |
| --- | --- | --- |
| `Team`, `Role`, `Pod`, `EndpointID` | `string` | Bounded routing identity. |
| `Source` | `SpawnSource` | Vocabulary: `envelope` (recreate) \| `cold` (pool boot). |
| `Duration` | `time.Duration` | Spawn wall-clock. |
| `Err` | `error` | Non-nil when the spawn failed. |

### `WakeEvent` — `ObserveWake(ctx, e)`

One hibernation wake (S4): SIGCONT → ready.

| Field | Type | Schema |
| --- | --- | --- |
| `Team`, `Role`, `Pod`, `EndpointID` | `string` | Bounded routing identity. |
| `Duration` | `time.Duration` | Wake wall-clock. Absent (zero) on a rebind wake. |
| `Rebind` | `bool` | `true` when the envelope's model moved while the process slept and the wake respawned from the current envelope. |
| `Err` | `error` | Non-nil when the wake failed. |

There is deliberately **no `ObserveHibernate` hook** — the interface is
lifted, not extended. Hibernation signals ride the schema as-is: the
`StateHibernated` gauge state, a `RouteEvent{Selection=wake}` + `WakeEvent`
pair, and a `SpawnEvent{Source=envelope}` recreate as the hibernate-miss
signal.

## Process-state gauge inputs

`ProcessStateSnapshot` is polled by the emitter on its own cadence. Rules:
cheap and non-blocking (back it with the gateway's in-memory listing, never a
live call into a process); stopped slots stay counted; zero-count states may
be omitted.

## Cardinality firewall

Every label an emitter derives from this schema is bounded: identity is the
pool set `{team, role}` (+ `pod` where the host spine already carries it),
state is the fixed four-value enum, spawn source is a two-value set. Endpoint
ids and run ids are attributes only, never metric labels. `pool_saturated`
stays **metric-only** — derive `busy == max` from the gauge.

## Implementations

| # | Emitter | Status |
| --- | --- | --- |
| 1 | k8squad `pkg/telemetry/meshobs` — OTel spine: `mesh.route`/`mesh.spawn`/`mesh.wake` spans, `ksquad.mesh.*` metrics | **Live** — host-side, unchanged in behavior. |
| 2 | NATS JetStream emitter | Possible later — **not in P3**. Five-event lifecycle set, reusing this event schema. |

Adding an emitter means implementing `mesh.LifecycleObserver` (+ optionally a
gauge over `ProcessStateSnapshot`) and injecting it at the composition root —
no gateway change, no telemetry SDK in the module.
