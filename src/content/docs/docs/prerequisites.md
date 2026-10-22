---
title: Prerequisites & troubleshooting
description: System requirements, setup prerequisites, and common troubleshooting scenarios for K8sAgentMesh.
---

This page covers the system requirements, setup prerequisites, and common
troubleshooting scenarios for K8sAgentMesh. For the guided end-to-end path,
follow the [Quickstart](/docs/quickstart/).

## System Requirements

### Kubernetes Cluster
- **Kubernetes Version**: 1.29 or later
- **Cluster Type**: Any standard Kubernetes cluster (EKS, GKE, AKS, kind, minikube, etc.)
- **Resources**: Minimum 2 CPU cores, 4GB RAM for development/testing
- **Networking**: Standard Kubernetes networking with HTTP ingress

### Supported Platforms
| Platform | Status | Notes |
|---|---|---|
| **kind** | Verified | The quickstart development environment |
| **minikube** | Unverified | Single-node development clusters; should work |
| **EKS** | Unverified | AWS managed Kubernetes; should work |
| **GKE** | Unverified | Google Kubernetes Engine; should work |
| **AKS** | Unverified | Azure Kubernetes Service; should work |
| **OpenShift** | Unverified | May require RBAC adjustments |

## Prerequisites Checklist

### Required Tools
| Tool | Minimum Version | Installation | Purpose |
|---|---|---|---|
| **kubectl** | 1.29 | [Installation Guide](https://kubernetes.io/docs/tasks/tools/) | Kubernetes CLI |
| **helm** | 3.12 | [Installation Guide](https://helm.sh/docs/intro/install/) | Package manager |
| **docker** | 20.10+ | [Installation Guide](https://docs.docker.com/get-docker/) | Container runtime |
| **kind** | 0.20 | [Installation Guide](https://kind.sigs.k8s.io/docs/user/quick-start/) | Kubernetes in Docker |

### Optional Tools
| Tool | Purpose |
|---|---|
| **k9s** | Kubernetes cluster management UI |
| **stern** | Multi-pod log tailing |
| **jq** | JSON processing for script automation |

### Verification Commands

Run these commands to verify your setup:

```sh
# Check kubectl version and connectivity
kubectl version --client
kubectl cluster-info

# Check helm version
helm version

# Check Docker status
docker --version
docker info

# Check kind version (if using kind)
kind version
```

## Setup Process

The steps below mirror the [Quickstart](/docs/quickstart/); the chart installs
from a local checkout and pulls nothing from a Helm repository or any host
project.

### 1. Prepare Images

K8sAgentMesh requires four Docker images. Build them from the repo root and
load them into kind:

```sh
# from the repo root — build and load all required images
for img in mesh-gateway agentruntime toolchain-vibe toolchain-codex; do
  echo "Building $img..."
  docker build -f images/Dockerfile.$img -t ghcr.io/k8sagentmesh/$img:0.1.0 .
  echo "Loading $img into kind..."
  kind load docker-image ghcr.io/k8sagentmesh/$img:0.1.0 --name mesh-qs
done
```

### 2. Create Cluster

```sh
kind create cluster --name mesh-qs
```

For other platforms, ensure your kubeconfig points at the target cluster.

### 3. Deploy K8sAgentMesh

```sh
# Install the chart from the local checkout
helm install mesh ./deploy/helm/k8sagentmesh \
  --namespace mesh --create-namespace \
  --wait --timeout=300s
```

## Troubleshooting Guide

### Installation Issues

#### Helm Chart Installation Fails

**Symptoms:**
- `helm install` command fails
- Error messages about dependencies or invalid YAML

**Solutions:**
```sh
# Validate chart before installation
helm lint ./deploy/helm/k8sagentmesh

# Dry-run install to check for issues
helm install mesh ./deploy/helm/k8sagentmesh \
  --namespace mesh --create-namespace \
  --dry-run --debug
```

**Common Causes:**
- Invalid YAML in chart
- Missing prerequisites
- Kubernetes version incompatibility

#### CRD Installation Issues

**Symptoms:**
- CustomResourceDefinitions not found
- `kubectl get crd` shows no mesh resources

**Solutions:**
```sh
# Check CRD YAML validity
kubectl apply -f deploy/helm/k8sagentmesh/crds/ --dry-run=client

# Manually install CRDs if needed
kubectl apply -f deploy/helm/k8sagentmesh/crds/meshpools.mesh.k8sagentmesh.io.yaml
kubectl apply -f deploy/helm/k8sagentmesh/crds/meshroutes.mesh.k8sagentmesh.io.yaml
kubectl apply -f deploy/helm/k8sagentmesh/crds/meshtelemetries.mesh.k8sagentmesh.io.yaml

# Verify CRDs are installed
kubectl get crd | grep mesh.k8sagentmesh.io
```

### Pod Issues

#### Pods CrashLoopBackOff

**Symptoms:**
- Pods repeatedly start and crash
- `kubectl describe pod` shows `CrashLoopBackOff`

**Diagnostic Steps:**
```sh
# Check pod events and recent logs
kubectl describe pod -n mesh <pod-name>
kubectl logs -n mesh <pod-name> --tail=50

# Check previous terminated container logs
kubectl logs -n mesh <pod-name> --previous
```

**Common Causes & Solutions:**

1. **Image Pull Failures**
```sh
# Check if images are available in the cluster
kubectl describe pod -n mesh <pod-name> | grep -A 10 -B 10 "ImagePull"

# Re-pull images if needed
kubectl rollout restart deployment/<deployment-name> -n mesh
```

2. **Resource Issues**
```sh
# Check resource requests/limits
kubectl get deployment -n mesh <deployment-name> -o yaml

# Increase resources
kubectl patch deployment <deployment-name> -n mesh --patch '{"spec":{"template":{"spec":{"containers":[{"name":"<container-name>","resources":{"limits":{"cpu":"1","memory":"2Gi"},"requests":{"cpu":"500m","memory":"1Gi"}}}]}}}}'
```

3. **Configuration Errors**
```sh
# Check config maps and secrets
kubectl get configmaps,secrets -n mesh

# Validate configuration files
kubectl apply -f <config-file> --dry-run=client
```

#### Pods Pending

**Symptoms:**
- Pods stay in `Pending` state
- Node scheduling issues

**Solutions:**
```sh
# Check node availability
kubectl get nodes -o wide

# Check pod scheduling constraints
kubectl describe pod -n mesh <pod-name> | grep -A 10 -B 10 "Events"

# Check taints and tolerations
kubectl describe node <node-name> | grep -A 10 -B 10 "Taints"
```

### Network Issues

#### Service Connectivity Problems

**Symptoms:**
- Can't access services via cluster DNS
- Port-forwarding fails
- Service endpoints not ready

**Solutions:**
```sh
# Check service endpoints
kubectl get endpoints -n mesh

# Test service connectivity from within cluster
kubectl exec -n mesh deployment/k8sagentmesh-agentruntime -- nslookup k8sagentmesh-gateway.mesh.svc.cluster.local

# Check service configuration
kubectl get service -n mesh -o yaml
```

#### Port-Forward Issues

**Symptoms:**
- `kubectl port-forward` fails to connect
- Local port already in use

**Solutions:**
```sh
# Check for existing port-forward processes
ps aux | grep port-forward

# Kill existing processes
pkill -f "port-forward"

# Try alternative port
kubectl port-forward svc/k8sagentmesh-gateway 9090:8080 -n mesh
```

### Task Execution Issues

#### Tasks Fail Immediately

**Symptoms:**
- POST /task returns a `failed` terminal state immediately
- No task execution logs

**Solutions:**
```sh
# Check agentruntime logs
kubectl logs -n mesh deployment/k8sagentmesh-agentruntime --tail=100

# Check gateway logs
kubectl logs -n mesh deployment/k8sagentmesh-gateway --tail=100

# Verify task format
curl -X POST -H "Content-Type: application/json" \
  -d '{"a2a_task_id":"test-123","envelope":{"input":"test"}}' \
  http://localhost:8080/task
```

**Common Task Format Issues:**
- Missing `a2a_task_id` field
- Incorrect envelope structure
- Missing required parameters

A task ends in the terminal state `failed` when the mesh cannot route or
execute it. Two gateway-side conditions account for most immediate failures:

| Condition | Meaning | Fix |
|---|---|---|
| `mesh: no idle process in pool` | No standing agent was available to accept the task | Check the `MeshPool` standing band and agentruntime logs |
| `mesh: target process has an active task` | The selected agent was already busy | Retry, or increase pool size |

#### Tasks Time Out

**Symptoms:**
- Tasks hang in `working` state
- No progress for extended periods

**Solutions:**
```sh
# Check for resource constraints
kubectl top pods -n mesh

# Check gateway and agentruntime logs
kubectl logs -n mesh deployment/k8sagentmesh-agentruntime --tail=50 | grep -i deadlock

# Increase timeouts if needed
kubectl patch deployment k8sagentmesh-agentruntime -n mesh --patch '{"spec":{"template":{"spec":{"containers":[{"name":"agentruntime","env":[{"name":"TASK_TIMEOUT","value":"300s"}]}]}}}}'
```

### Performance Issues

#### High Latency

**Symptoms:**
- Slow task execution
- High response times

**Solutions:**
```sh
# Monitor resource usage
kubectl top pods -n mesh --sort-by=cpu
kubectl top pods -n mesh --sort-by=memory

# Check network latency
kubectl exec -n mesh deployment/k8sagentmesh-gateway -- ping k8sagentmesh-agentruntime.mesh.svc.cluster.local

# Optimize resource allocation
kubectl patch deployment <deployment-name> -n mesh --patch '{"spec":{"template":{"spec":{"containers":[{"name":"<container-name>","resources":{"limits":{"cpu":"2","memory":"4Gi"},"requests":{"cpu":"1","memory":"2Gi"}}}]}}}}'
```

#### Memory Issues

**Symptoms:**
- Pods being OOM killed
- High memory usage

**Solutions:**
```sh
# Check memory limits and requests
kubectl get deployment -n mesh <deployment-name> -o yaml | grep -A 10 resources

# Increase memory limits
kubectl patch deployment <deployment-name> -n mesh --patch '{"spec":{"template":{"spec":{"containers":[{"name":"<container-name>","resources":{"limits":{"memory":"8Gi"},"requests":{"memory":"4Gi"}}}]}}}}'
```

## Debug Tools

### Enhanced Logging

```sh
# Enable debug logging
kubectl set env deployment/k8sagentmesh-gateway LOG_LEVEL=debug -n mesh
kubectl set env deployment/k8sagentmesh-agentruntime LOG_LEVEL=debug -n mesh

# View logs with timestamps
kubectl logs -n mesh deployment/k8sagentmesh-gateway --follow --tail=100
kubectl logs -n mesh deployment/k8sagentmesh-agentruntime --follow --tail=100
```

### Telemetry

The mesh emits lifecycle events through a host-pluggable observer contract —
see [Telemetry](/concepts/telemetry/) for the event contract and the
`none|otel` emitter configuration on `MeshTelemetry`. To inspect what a host
deploys in practice, look at the host's telemetry spine (k8squad runs an OTel
collector with the `ksquad.mesh.*` metrics and `mesh.route` / `mesh.spawn` /
`mesh.wake` spans).

### Network Debugging

```sh
# Check pod-to-pod connectivity
kubectl exec -n mesh deployment/k8sagentmesh-gateway -- wget -qO- http://k8sagentmesh-agentruntime.mesh.svc.cluster.local:8080/health

# Check DNS resolution
kubectl exec -n mesh deployment/k8sagentmesh-gateway -- nslookup k8sagentmesh-agentruntime.mesh.svc.cluster.local

# Port-forward and test locally
kubectl port-forward svc/k8sagentmesh-gateway 8080:8080 -n mesh &
curl -X POST -H "Content-Type: application/json" \
  -d '{"a2a_task_id":"debug-123","envelope":{"input":"test connectivity"}}' \
  http://localhost:8080/task
```

## Getting Help

### Issue Reporting

When filing issues on GitHub, include:

```sh
# System information
kubectl version --short
helm version --short
docker --version
kind version  # if using kind

# Cluster information
kubectl cluster-info
kubectl get nodes -o wide

# Installation details
helm list -n mesh
helm get values mesh -n mesh

# Pod status
kubectl get pods -n mesh -o wide

# Recent events
kubectl get events -n mesh --sort-by=.metadata.creationTimestamp --tail=20
```

### Community Resources

- **GitHub Issues**: [K8sAgentMesh Issues](https://github.com/K8sAgentMesh/k8sAgentMesh/issues)
- **Source code**: [K8sAgentMesh/K8sAgentMesh](https://github.com/K8sAgentMesh/k8sAgentMesh)
- **This documentation**: [k8sagentmesh.github.io](https://k8sagentmesh.github.io/k8sAgentsMesh-website/)

## Best Practices

### Resource Management
- Monitor CPU and memory usage regularly
- Set appropriate resource requests and limits
- Implement horizontal pod autoscaling for production

### Security
- Use proper RBAC policies
- Enable network policies for isolation
- Regularly scan images for vulnerabilities

### Monitoring
- Set up alerts for critical metrics
- Monitor task success/failure rates
- Track response times and throughput

### Maintenance
- Regularly update to newer versions
- Monitor deprecation notices
- Test in staging before production updates
