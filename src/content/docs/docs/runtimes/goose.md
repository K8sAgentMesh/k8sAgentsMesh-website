---
title: goose runtime
description: Run the goose coding agent on the mesh — the pinned static binary, the headless env contract, XDG config isolation, and the stream-json event mapping.
---

**goose** (aaif-goose/goose) is the third engine in the `agentruntime` set —
the fourth mesh-side proof that a new runtime lands with zero control-plane
change. It differs from [vibe](/docs/runtimes/vibe/) and
[codex](/docs/runtimes/codex/) in one visible way: it carries an explicitly
**honest, spike-proven capability surface** — nothing is advertised that was
not verified against the pinned binary.

## Pin and defaults

| | |
| --- | --- |
| Engine type | `goose` |
| CLI pin | `1.55.0` (static musl build of aaif-goose/goose; the repo moved off block/goose in October 2026) |
| Default model | `qwen3.5:35b` — the shared-LAN Ollama lane the adoption spike probed |
| Context window | 131072 tokens |
| Credential shape | `api-key` → `OPENAI_API_KEY` |
| Toolchain image | none yet — the pinned static binary rides the host/sandbox image (no Node/Python substrate needed) |

Upstream is mid-migration to client/server + ACP; the surface is re-verified
on every pin bump, and ACP (`goose acp` / `goose serve`) is proven but
deliberately deferred.

## Env contract

The headless contract is locked by the adoption spike — every value below is
stamped on each task:

| Variable | Value | Why |
| -------- | ----- | --- |
| `GOOSE_MODE` | `auto` | Headless: no interactive approval prompts in a sandbox. |
| `GOOSE_TELEMETRY_OFF` | `1` | No telemetry egress from the mesh. |
| `GOOSE_DISABLE_KEYRING` | `1` | No keyring in a sandbox; goose falls back to `secrets.yaml` in its config dir. |
| `GOOSE_MODEL` | resolved model | Route model > envelope model > runtime default. |
| `GOOSE_PROVIDER` + `OPENAI_BASE_URL`/`OPENAI_API_KEY` | BYO lane | A BYO OpenAI-compatible route selects goose's `openai` provider; the route token overrides the per-user key (exactly one emitted). |

## Config-dir isolation

goose v1.55.0 has **no** `GOOSE_CONFIG_DIR` (verified against the binary) —
it resolves its config directory through the XDG base-dir strategy. The
evidence-backed isolation knob is therefore **`XDG_CONFIG_HOME`**: the
standing adapter points it inside the process's launch directory, and goose
nests `config.yaml`, `secrets.yaml`, and `sessions.db` under
`<root>/goose`. The per-task engine deliberately does not re-derive it — the
runner inherits the standing process's value, so a task-relative workdir can
never split config away from the isolated dir.

## Invocation

One task is a one-shot run reading the prompt from stdin:

```text
goose run -i - --output-format stream-json --no-session --no-profile
```

The whole envelope (system context + instruction) rides stdin — the same
no-argv invariant as the vibe seam.

## Event mapping

The `stream-json` output is OpenAI-chat-completion shaped; the adapter decodes
it into typed mesh events:

| stream-json event | Mesh event |
| ----------------- | ---------- |
| `message` with `text` content blocks | message event (per-token granularity; consumers coalesce) |
| `message` with `thinking` blocks | dropped (reasoning bookkeeping) |
| `complete` | usage event (input / output / cache-read tokens) — and the terminal settle marker |
| non-JSON banner preamble | skipped |

The terminal `complete` marker is the settle signal: once seen and the stream
stays quiet for the settle window, the runner force-terminates the process
and settles the task — the same contract as vibe's `result` family.

## The honest capability posture

The advertised set is exactly what the spike captured: streaming, tool
calls, and a BYO model endpoint. Interactive prompting is **not** advertised
(`GOOSE_MODE=auto` is headless). Artifact kinds are declared **empty** — not
guessed `file`/`patch` — because no tool loops ran in the spike capture; the
list fills in when the tool-loop vocabulary is enumerated for real. A gap is
advertised, never discovered as a mid-run failure.

## Deploy it

The chart projects the credential (goose maps onto the OpenAI key lane); the
pinned binary must be present on the image the supervisor runs. One wiring
note: the chart's `agentruntime.modelRoute` block stamps the **vibe** lane
(`MISTRAL_BASE_URL` / `VIBE_ACTIVE_MODEL`) — goose's BYO lane rides the
top-level `extraEnv` instead:

```yaml
agentruntime:
  runtimeType: goose
  credentials:
    existingSecret: mesh-goose-credentials
    openaiApiKeyKey: openai-api-key

# goose's BYO openai lane (applies to both Deployments)
extraEnv:
  - name: GOOSE_PROVIDER
    value: openai
  - name: OPENAI_BASE_URL
    value: http://ollama.ollama.svc:11434/v1
  - name: GOOSE_MODEL
    value: qwen3.5:35b
```
