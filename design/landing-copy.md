# Landing Copy Deck — K8sAgentMesh

Phase **P3** of ISI-6394 (rev 3). Final copy for the landing page, band by band
in page order (ia.md §4). P4 implements verbatim; wording is grounded in the
docs (`/docs/`, `/concepts/architecture/`, `/concepts/hosts/`,
`/docs/quickstart/`) so the site tells one story.

Voice: technical, direct, second-person plural only in CTAs. No marketing
superlatives. Contract names (`RuntimeAdapter`, `SchedulingPolicy`) keep exact
capitalization.

---

## Meta

- **Title:** `K8sAgentMesh — the mesh layer for agent teams on Kubernetes`
- **Description (meta/OG):** `K8sAgentMesh — the mesh layer for agent teams on Kubernetes. Protocol-first communication, discovery, and memory for standing AI agents.`
- **OG image:** `brand/logos/k8sagentmesh-mark-navy-1024.png` (until a dedicated
  social card is commissioned — follow-up, not launch-blocking)

## Header

Nav labels: `Docs · Concepts · Blog · Community · GitHub` + theme toggle.
(Links per ia.md §3.)

## 1. Hero (`#hero`)

- **Kicker:** `Protocol-first agent mesh`
- **H1:** `The mesh layer for agent teams on Kubernetes`
  ("mesh layer" carries the `.accent` teal span, as shipped)
- **Lede:** `K8sAgentMesh is the runtime-agnostic seam for standing AI agents:
  communication, discovery, and memory for self-orchestrating agent teams — a
  mesh any platform can host.`
- **CTA primary:** `View on GitHub` → repo
- **CTA secondary:** `Get started` → `/docs/quickstart/`
  *(changed from "Read the docs" → `/docs/`; the quickstart is the stronger
  first click — see ia.md §5.4)*

## 2. Architecture (`#architecture`) — NEW

- **H2:** `A seam, not a silo`
- **Intro line (above diagram, optional if space is tight):**
  `Pod gateways, a router, and a registry — wrapped around one small contract.`
- **Diagram:** `design/diagrams/architecture-overview.mmd` (Mermaid, site theme)
- **Caption (below diagram):**
  `The mesh owns mechanism — gateways, routing, lifecycle, registration seams.
  Everything else is a host decision.` + link `Read the architecture overview →`
  to `/concepts/architecture/`

**Rail card A — The 7-op contract**

- **H3:** `One contract, seven operations`
- **Body:** `Everything a runtime must provide to host an agent on the mesh:
  Spawn, Register, Route, Hibernate, Wake, Stop, Recreate. Two adapters ship as
  references — opencode and codex. A third runtime means a new adapter, not a
  control-plane change.`
- **Link:** `The RuntimeAdapter contract →` to
  `/concepts/architecture/#the-runtimeadapter-7-op-contract`

**Rail card B — Hosts, not owners**

- **H3:** `Hosts, not owners`
- **Body:** `Scheduling decisions, identity, telemetry backends, and memory
  stores stay host-side, plugged in behind the seams. k8squad is host #1: its
  role-based scheduling runs as SchedulingPolicy #1, and its CRDs project into
  the mesh contracts rather than being replaced by them.`
- **Link:** `What the module owns vs. what stays host-side →` to
  `/concepts/hosts/`

## 3. How to use (`#how-to-use`)

- **H2:** `Three steps to your first task`
- **Step 01 — `Create a cluster`**
  `Spin up a fresh kind cluster — the zero-host-project path needs nothing but
  a container runtime.` → `/docs/prerequisites/`
- **Step 02 — `Install the chart`**
  `One helm install of the vanilla chart. No host project, no dependencies,
  fully independent.` → `/docs/quickstart/`
- **Step 03 — `Run your first task`**
  `POST a task to the gateway and watch the A2A event stream settle to a
  terminal state.` → `/docs/quickstart/#run-your-first-task`
- **Section CTA:** `Open the quickstart` → `/docs/quickstart/`

## 4. Why / features (`#why`)

- **H2:** `What the mesh gives you`
- **01 Runtime-agnostic seam** — `Everything a runtime must provide is the 7-op
  RuntimeAdapter contract — Spawn, Register, Route, Hibernate, Wake, Stop,
  Recreate. Two adapters ship as references; a third means zero control-plane
  change.` → `/concepts/architecture/`
- **02 Per-pod gateways** — `Each pod runs a Gateway — the process manager that
  owns the agent lifecycle inside the pod, speaking the contract downward and
  A2A wire traffic upward.` → `/concepts/lifecycle/`
- **03 A2A wire types** — `Task, Event, Status, AgentCard, ModelRoute — the
  module owns the wire shapes; hosts stamp their own schema brand and pin their
  accepted revisions.` → `/concepts/architecture/`
- **04 Lifecycle events, by contract** — `Route, spawn and wake events ride a
  transport-agnostic contract: the Gateway is the sole producer, your
  LifecycleObserver the sole consumer. No telemetry SDK in the mesh — ever.` →
  `/concepts/telemetry/`
- **05 Scheduling as policy** — `The mesh runs a generic target-N scheduler
  loop; who deserves a slot is your SchedulingPolicy. k8squad's RolePool is
  policy #1 — projecting into MeshPool semantics, never replaced.` →
  `/concepts/scheduling/`
- **06 Temporal memory contract** — `Team context — decisions, artifacts,
  conversation state — is durable and addressable across ephemeral agent
  lifecycles. A recreated agent resumes with its history intact.` →
  `/concepts/memory/`

(Feature card copy is the shipped copy — already tight and doc-grounded. The
change in P3 is positional: this band moves after How-to-use.)

## 5. Footer

- `Apache-2.0 — K8sAgentMesh Authors`
- `Staging at k8sagentmesh.github.io` (link) — swap when the custom domain
  lands; pair with the `site`/`base` change in `astro.config.mjs`.

## Copy debt / follow-ups (not P3 scope)

- Dedicated OG/social card image (1200×630) — commission under P4 or P5.
- If P2 retitles `/docs/using-runtimes/`, re-check nav label "Docs" ordering —
  no copy change needed on the landing.
