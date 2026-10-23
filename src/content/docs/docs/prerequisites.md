---
title: Prerequisites & troubleshooting
description: System requirements and common fixes for K8sAgentMesh.
---

What you need before the [Quickstart](/docs/quickstart/), and where to look
when something does not behave.

## System requirements

- **Kubernetes 1.29+** — any standard cluster; **kind** is the verified
  development path (minikube/EKS/GKE/AKS should work, OpenShift may need RBAC
  adjustments).
- **Resources** — 2 CPU cores / 4 GB RAM is enough for development.
- **Tools** — `docker` 20.10+, `kind` ≥ 0.20, `helm` ≥ 3.12, `kubectl` ≥ 1.29.

Verify in one line:

```sh
kubectl version --client && helm version && docker --version && kind version
```

Optional niceties: `k9s` (cluster UI), `stern` (multi-pod logs), `jq` (JSON).

## Common fixes

Most failed installs and failed tasks come down to a handful of conditions:

| Symptom | Likely cause | Fix |
|---|---|---|
| Pod `ImagePullBackOff` | image not loaded into kind | re-run the `kind load docker-image` loop from the [quickstart](/docs/quickstart/) |
| Pod `CrashLoopBackOff` | bad config or missing CRDs | `kubectl describe pod -n mesh <pod>`; check `kubectl get crd \| grep mesh.k8sagentmesh.io` |
| Pod `Pending` | no schedulable node / taints | `kubectl get nodes -o wide`; check taints on the node |
| `helm install` fails | invalid values or cluster unreachable | `helm lint ./deploy/helm/k8sagentmesh`, then retry with `--dry-run --debug` |
| Port-forward won't connect | stale forward or port in use | `pkill -f "port-forward"`, retry (or use another local port) |
| Task fails immediately: `mesh: no idle process in pool` | no standing agent available | check the `MeshPool` standing band and agentruntime logs |
| Task fails immediately: `mesh: target process has an active task` | selected agent busy | retry, or grow the pool |
| Task hangs in `working` | resource pressure or stuck agent | `kubectl top pods -n mesh`; `kubectl logs -n mesh deployment/k8sagentmesh-agentruntime --tail=50` |

### Logs, when you need more

```sh
kubectl logs -n mesh deployment/k8sagentmesh-gateway --follow --tail=50
kubectl logs -n mesh deployment/k8sagentmesh-agentruntime --follow --tail=50
```

Lifecycle telemetry is host-pluggable — see [Telemetry](/concepts/telemetry/)
for the event contract and the `none|otel` emitter on `MeshTelemetry`.

## Getting help

Open an issue at
[github.com/K8sAgentMesh/K8sAgentMesh/issues](https://github.com/K8sAgentMesh/K8sAgentMesh/issues)
with your `kubectl`/`helm`/`kind` versions, `kubectl get pods -n mesh` output,
and recent pod logs. For security-sensitive reports, prefer a private
vulnerability report over a public issue.
