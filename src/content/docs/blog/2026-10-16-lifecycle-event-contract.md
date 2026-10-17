---
title: 'The lifecycle-event contract: observable without an SDK'
description: 'P3.6 formalized the mesh lifecycle events: Gateway as sole producer, a host-pluggable LifecycleObserver, and a cardinality firewall.'
pubDate: 2026-10-16
---

**P3.6** formalized the mesh's observability contract: what the lifecycle
reports, and the exact seam through which hosts receive it. The NATS-emission
concept of the AgentMesh chapter became a transport-agnostic
[lifecycle-event contract](/concepts/telemetry/) in the module.

Three decisions carried the design:

**The Gateway is the sole producer.** It reports through its
`GatewayConfig.Observer` and never touches a telemetry SDK. The mesh stays
emitter-agnostic; the host stays in charge of its observability spine.

**The observer is informational.** `mesh.LifecycleObserver` is injected at the
composition root; nil is a valid no-op, and an observer error can never fail
the lifecycle. Telemetry is a witness, never a participant.

**The vocabulary is bounded.** Three events — `RouteEvent`, `SpawnEvent`,
`WakeEvent` — carry identity, fixed-vocabulary fields and timings. Identity
labels come from the pool set `{team, role}` (+ `pod` where the host spine
already carries it); endpoint and run ids are span attributes, never metric
labels. That firewall (NFR-OBS3) is what lets a second emitter exist at all.

The reference emitter — k8squad's OTel spine (`mesh.route`/`mesh.spawn`/
`mesh.wake` spans, `ksquad.mesh.*` metrics) — implements the contract with
zero behavior change. A NATS JetStream emitter is possible later, reusing the
same schema. Read the full contract on the
[Telemetry page](/concepts/telemetry/).
