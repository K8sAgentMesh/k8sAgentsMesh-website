---
title: Memory
description: The temporal memory contract — durable, addressable team context that survives ephemeral agent lifecycles.
---

Agent teams generate context worth keeping: decisions, artifacts, conversation
state. On a mesh where processes hibernate, wake, churn and recreate, that
context must outlive any single process. The **temporal memory contract** is
the mesh's answer.

## The contract

Team context is **durable and addressable across ephemeral agent lifecycles**:

- a recreated agent resumes with its history intact — identity, registration,
  and memory references come back with the process,
- context is addressed by stable identity (team, role, run), never by
  process-local handles that die with the pod,
- writes and reads ride the mesh's identity vocabulary, so any host can back
  the contract with its own store.

## Where backends live

The module owns the **contract, not the backend**. Memory stores are
host-side machinery behind the seam — exactly like the telemetry spine and the
scheduling policy. The reference host (k8squad) wires a temporal knowledge
backend (Grail/DQL reference lineage) into that contract; a second adopter can
back it with anything that honors the same identity and addressing rules.

## Why it matters for standing agents

Standing agents are only useful if they keep their promises cheaply:

- **hibernation** (S4) parks an idle agent and reclaims its RAM — the process
  forgets; the memory layer does not,
- **recreate** (the ≤3 s envelope path) rebuilds a process after churn — the
  memory layer restores what "you" meant,
- **wake with rebind** respawns from the current envelope — the model changes,
  the history does not.

That is the whole point of a *temporal* contract: memory with time in it, so
the team's narrative survives the churn of its members.
