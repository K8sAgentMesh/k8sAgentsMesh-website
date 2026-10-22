---
title: Using runtimes
description: How to use K8sAgentMesh with the supported agent runtimes — opencode, codex, goose — and the RuntimeAdapter contract behind them.
---

K8sAgentMesh is **runtime-agnostic**: agent runtimes plug in through the
RuntimeAdapter 7-op contract (`Spawn` / `Register` / `Route` / `Hibernate` /
`Wake` / `Stop` / `Recreate`). This section will cover configuring and
operating each supported runtime.

## Supported runtimes

| Runtime | Adapter package | Status |
| ------- | --------------- | ------ |
| opencode | `agentruntime/` | Reference adapter (#1) |
| codex | `agentruntime/` | Adapter (#2) |
| goose | `agentruntime/` | Adapter, with MCP support |

## Where this content lands

Full per-runtime guides are being written in phase P2 of the website plan.
Until then, the source of truth is the `agentruntime/` package and the
[quickstart](/docs/quickstart/), which exercises a
runtime end to end on kind.
