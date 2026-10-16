---
title: Roadmap
description: K8sAgentMesh P3 extraction stories and their status.
---

The K8sAgentMesh module is being extracted from the proven seam in k8squad
(P1 prototype + P2 second-adapter proof). The P3 story set below tracks the
lift; status reflects the bootstrap snapshot of this site.

| Story | Title                                                            | Status        |
| ----- | ---------------------------------------------------------------- | ------------- |
| P3.1  | Org + repo + module skeleton                                     | Done          |
| P3.2  | Lift A2A wire types; host re-export alias                        | Done          |
| P3.3  | Lift `mesh` core + adapters behind injected builders             | Planned       |
| P3.4  | Registration + supervisor seams (`Registry`/`Supervisor`)        | Planned       |
| P3.5  | `SchedulingPolicy` interface; RolePool as policy #1              | Planned       |
| P3.6  | NATS-emission / event contract; OTel impl stays host-side        | Planned       |
| P3.7  | Host-#1 cutover: k8squad pins the module, suite goes green       | Planned       |

The full content launch of this site is gated on P3 completion and docs
maturity — the skeleton you are reading ships now so the brand, docs pipeline,
and deploy path are proven before that gate opens.
