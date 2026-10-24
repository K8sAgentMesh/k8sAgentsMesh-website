---
title: codex runtime
description: Run OpenAI's codex coding agent on the mesh — the pinned Rust CLI, the stdin wrapper, envelope spill, config.toml rendering, and the JSONL event mapping.
---

**codex** is OpenAI's official Rust coding agent. On the mesh it is a
first-class, conformant runtime — not experimental — driven through the same
engine contract as [vibe](/docs/runtimes/vibe/). Two halves matter to
operators: the pinned CLI substrate and the stdin wrapper that delivers the
envelope.

## Pin and defaults

| | |
| --- | --- |
| Engine type | `codex` |
| CLI pin | `@openai/codex@0.152.0` (engine reports `rust-v0.152.0`) |
| Toolchain image | `toolchain-codex` (Node substrate + the vendored `mesh-codex-exec` wrapper) |
| Default model | `gpt-5.4-codex` |
| Context window | 272000 tokens |
| Credential shape | `api-key` → `OPENAI_API_KEY` |

## The D4 stdin wrapper

The engine does not exec `codex` directly — it execs
**`mesh-codex-exec`**, a small wrapper that combines the transported context
envelope and pipes it into `codex exec -`, argv untouched:

```text
mesh-codex-exec --json --skip-git-repo-check \
  -m <model> -C <workdir> -s workspace-write -a never
```

A host embedding the engine with its own wrapper keeps its binary name via
`MESH_CODEX_EXEC_BIN` without forking the engine.

## Env contract

| Variable | Role |
| -------- | ---- |
| `OPENAI_API_KEY` | The per-user OpenAI credential, or a BYO route's token. |
| `OPENAI_BASE_URL` | A BYO OpenAI-compatible endpoint (with the route's token above). |
| `KSQUAD_SYSTEM_CONTEXT_FILE` | Path to the spilled system-context file in the workdir. |
| `KSQUAD_INPUT` | The bounded concrete work instruction. |
| `CODEX_HOME` | Points at the sandbox workdir, where the rendered `config.toml` lands. |

The envelope rides **env, not argv** — and the large system-context half
spills to a workdir file with only its path in the environment. A
token-budgeted context (hundreds of KiB) would otherwise overrun the kernel's
per-env-string ceiling and kill exec with `E2BIG`; the spill lifted that
ceiling. The wrapper reads the file, joins it with `KSQUAD_INPUT`, and pipes
the result into the CLI on stdin.

Exactly one credential is emitted: a BYO route carries its own token and base
URL; otherwise the per-user key. Emitting both would shadow the route token —
getenv is first-wins.

## MCP and BYO config rendering

When a task demands MCP servers or rides a BYO endpoint, the adapter renders a
`config.toml` into `CODEX_HOME` before launch:

```toml
[mcp_servers.github]
command = "gh-mcp-server"

[mcp_servers.docs]
url = "https://mcp.example.com/mcp"

[model_providers.ksquad-byo]
name = "ksquad-byo"
base_url = "http://ollama.ollama.svc:11434/v1"
wire_api = "chat"
```

Credentials ride the process environment only — the IR carries env-var
**names** (`envNames`), never values, and the rendered document carries no
credential material or references; secret material never lands in the file.

## Event mapping

`codex exec --json` emits a JSONL thread-event stream. The adapter decodes it
into typed mesh events, so tool and model activity reaches the A2A wire and
the telemetry spine as structured data:

| codex thread event | Mesh event |
| ------------------ | ---------- |
| `item.completed` · `command_execution` | tool event (`bash` + recognized command head, exit status) |
| `item.completed` · `mcp_tool_call` | tool event (server + tool name, status) |
| `item.completed` · `web_search` | tool event (query) |
| `item.completed` · `agent_message` | message event |
| `turn.completed` | usage event (input / output / reasoning / cached-read tokens) |
| `turn.failed` / `error` | message event (error surfaced) |
| `thread.started`, `turn.started`, `item.started/updated` | dropped — progress bookkeeping |

Only `item.completed` settles a call, so exactly one span settles per tool
call. A non-JSON line (codex diagnostics can interleave on stdout) degrades
to a message event, never an error — parse failure must not kill a running
task.

## Capabilities

Streaming, tool calls, interactive prompting, and a BYO OpenAI-compatible
endpoint are advertised, plus `file`/`patch` artifact kinds and the toolchain
substrate capabilities (Docker, GitHub, package install).

## Deploy it

```yaml
agentruntime:
  runtimeType: codex        # swaps the toolchain layer to toolchain-codex
  credentials:
    existingSecret: mesh-codex-credentials
    openaiApiKeyKey: openai-api-key
```

```sh
kubectl -n mesh create secret generic mesh-codex-credentials \
  --from-literal=openai-api-key=sk-...

helm upgrade mesh ./deploy/helm/k8sagentmesh -n mesh \
  --reuse-values --set agentruntime.runtimeType=codex --wait
```
