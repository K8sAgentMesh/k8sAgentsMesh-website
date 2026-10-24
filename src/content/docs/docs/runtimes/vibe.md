---
title: vibe runtime
description: Run Mistral's headless vibe coding agent on the mesh — pinned CLI, model routing, credentials, streaming events, and toolchain wiring.
---

**vibe** is Mistral's headless coding agent — the mesh's reference
`agentruntime` engine for the Mistral wire and the chart's default runtime
flavor. This page covers the pinned toolchain, the env contract, how the
envelope reaches the CLI, and the event mapping.

## Pin and defaults

| | |
| --- | --- |
| Engine type | `vibe` |
| CLI pin | `mistral-vibe==2.9.6` (PyPI — the CLI ships as `mistral-vibe`; engine reports `py-v2.9.6`) |
| Toolchain image | `toolchain-vibe` (uv/Python substrate) |
| Default model | `mistral-large-latest` |
| Context window | 131072 tokens (budget authority for the context assembler) |
| Credential shape | `api-key` → `MISTRAL_API_KEY` |
| Task bound | `--max-turns 64` per task |

The CLI pin and the engine pin move together or not at all (ADR-017), and the
unit tests assert both against the constants.

## Env contract

| Variable | Role |
| -------- | ---- |
| `MISTRAL_API_KEY` | The per-user Mistral credential, or a BYO route's token. |
| `MISTRAL_BASE_URL` | A BYO OpenAI-compatible endpoint (e.g. an Ollama lane). |
| `VIBE_ACTIVE_MODEL` | The model the task drives — re-pinned per task so an override always holds. |

vibe speaks the Mistral wire natively, so the credential and a BYO route both
map onto `MISTRAL_API_KEY` — exactly one is emitted. A route without a token
uses the conventional `ollama` placeholder key so the client library still
authenticates against an unauthenticated lane.

`VIBE_ACTIVE_MODEL` exists because the upstream CLI resolves its active model
through a feature flag that misfires without a TTY
(mistralai/mistral-vibe#1140): the mesh pins the model from the routed value
on every task, so the headless process can never silently fall off its model.

## Invocation

One task is a one-shot headless run:

```text
vibe -p --output streaming --auto-approve \
     --workdir <sandbox-dir> --max-turns 64 --trust
```

The **whole envelope rides stdin** — system context first, then the concrete
instruction, separated by a blank line. The prompt never appears in argv, so
it cannot leak through the process table.

## Event mapping

`vibe -p --output streaming` emits an NDJSON stream the adapter decodes into
typed mesh events:

| Stream marker | Mesh event |
| ------------- | ---------- |
| `message` / `assistant` / `chat` | message event (assistant text) |
| `tool` / `tool.call` / `tool.use` | tool event (tool name) |
| `error` | message event (surfaced as agent text) |
| `result` / `done` / `complete` / `finish` family | terminal marker — settles the task |

Parsing is deliberately permissive: an unknown marker degrades to silence,
never a failed run. The terminal marker is the settle signal: once seen and
the stream stays quiet for the settle window, the runner force-terminates the
process and settles the task completed — a pinned CLI can leave non-daemon
handles (inotify watchers, retry loops) holding its event loop open after the
work finished, and the runner no longer waits for process exit alone.

## Capabilities

Streaming, tool calls, and a BYO OpenAI-compatible endpoint are advertised.
Interactive prompting is **not** — headless `-p` only, by design. Artifact
kinds: `file`, `patch`. Docker, GitHub, and package install (uv-managed) are
advertised capabilities of the toolchain substrate.

## Deploy it

The chart defaults to vibe; an explicit minimal values file:

```yaml
agentruntime:
  runtimeType: vibe
  # optional envelope model override — pins VIBE_ACTIVE_MODEL
  model: ""
  credentials:
    existingSecret: mesh-vibe-credentials
    mistralApiKeyKey: mistral-api-key
  # optional BYO lane (e.g. Ollama — any model it serves)
  modelRoute:
    endpoint: http://ollama.ollama.svc:11434/v1
    model: qwen3.5:35b
```

The gateway's standing band takes the same shape (`gateway.runtimeType:
vibe`), with its own toolchain layer — the gateway pod hosts the band, and
the band's children exec the layered CLI.
