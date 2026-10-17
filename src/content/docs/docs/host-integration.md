---
title: Host integration
description: How a platform adopts K8sAgentMesh — implement the seams, inject the builders, keep your control plane.
---

K8sAgentMesh is host-agnostic: hosts keep their own control planes and plug in
behind the module's seams. **k8squad is host #1** — the reference adopter — and
a second adopter maps the same elements onto its own equivalents. This page is
the adoption path; [Hosts, not owners](/concepts/hosts/) explains the split in
depth.

## 1. Depend on the module

```sh
go get github.com/K8sAgentMesh/K8sAgentMesh
```

The module path is `github.com/K8sAgentMesh/K8sAgentMesh`; packages are `mesh`,
`a2a`, and `apis/mesh/v1alpha1`.

## 2. Implement a RuntimeAdapter

Everything a runtime must provide to host an agent on the mesh is the
**7-op contract**:

1. **Spawn** — start an agent process in a pod.
2. **Register** — announce the agent and its capabilities on the mesh.
3. **Route** — deliver a wire task to the agent.
4. **Hibernate** — park a long-idle agent (S4) and free its resources.
5. **Wake** — restore a hibernated agent to serve work.
6. **Stop** — terminate an agent run cleanly.
7. **Recreate** — rebuild an agent after pod churn without losing identity.

Two adapters ship in the module as references (`opencode` #1, `codex` #2). Your
adapter speaks downward to your runtime; the Gateway handles the rest.

## 3. Compose the Gateway with injected builders

The per-pod **Gateway** is the process manager that owns the agent lifecycle
inside the pod: it speaks the RuntimeAdapter contract downward and A2A wire
traffic upward into the mesh. The composition root injects the builders —
adapters, stores, observers — so no mesh code depends on a host type.

## 4. Provide the Supervisor-side seams

The module defines the interfaces; the host provides the machinery:

- **`Registry`** — the endpoint store (upsert / heartbeat / prune / deregister /
  lookup / sweep / list). Back it with your own store; the `MeshEndpoint`
  registration record is a Go contract type, not a CRD.
- **`Ingress`** — the registration surface the gateway POSTs to.
- **`Sweeper`** — the TTL-prune loop for dead registrations.
- **`SupervisorHealth`** — the health-sweep loop.

## 5. Plug scheduling in as a POLICY

Implement **`SchedulingPolicy`** — or use the generic target-N scheduler loop
with your policy #1 (k8squad's role-based RolePool is the reference policy).
Your pool CRD projects into `MeshPool` semantics through the seam; it is not
replaced.

## 6. Emit telemetry through the event contract

Implement **`mesh.LifecycleObserver`** and inject it at the composition root
(no telemetry SDK inside the module — the Gateway is the sole producer; nil is
a valid no-op, and observer errors never fail the lifecycle). Poll
`ProcessStateSnapshot` for gauge inputs. k8squad's OTel emitter
(`ksquad.mesh.*` metrics, `mesh.route`/`mesh.spawn`/`mesh.wake` spans) is the
live reference; a NATS JetStream emitter is a possible later addition. See
[Telemetry](/concepts/telemetry/).

## 7. Consume the CRD contracts

`apis/mesh/v1alpha1` publishes the mesh-owned Tier A contracts —
`MeshPool`, `MeshRoute`, `MeshTelemetry` — as Go types plus CRD YAML, with no
controller. Hosts materialize them (or project their own CRDs into their
semantics). Identity CRDs, scheduling policy config, `coord.*` custody guards
and rollout flags are **Tier C — never mesh-owned**; they stay host-side.

## Keep it extraction-clean

No package in this module may import `github.com/K8squad/K8squad/*` — and the
reverse dependency direction is the healthy one: the host imports the module,
never the other way around.
