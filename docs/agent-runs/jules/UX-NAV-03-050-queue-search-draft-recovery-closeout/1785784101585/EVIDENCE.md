# Product Closeout Evidence: Queue, search, and draft recovery complete the operator loop

- **Base SHA:** `f449b1a914cad2a6ae769e90525abf402a74330d` (origin/main)
- **Previous stage:** UX-NAV-03-049-queue-search-draft-recovery-e2e-real-data
- **GitHub issue:** #966
- **Stage type:** Product closeout evidence (UX-NAV-03 / UX/Full Stack Flow)

This stage closes the vertical product slice by recording where the operator loop
exists, what persisted data it reads and mutates, how the operator reaches it, how
they return, and the honest blockers and commercial claims it supports.

---

## 1. Routes / Screens / Buttons Affected

| Surface | Route | Purpose | Access profile |
|---|---|---|---|
| Workspace home cards | `/` → `src/components/runtime/workspace-home.tsx` | Entry cards for Busca Global, Filas e SLA, Recuperação de Rascunhos | authenticated workspace home |
| Global Search | `/search` | Look up work items, OS, assets, and technicians in one query; draft recovery; activity receipt | `admin`, `operador`, `builder` |
| Draft recovery anchor | `/search#drafts` | Deep-link the draft-recovery section; recover a pending item | same as `/search` |
| Queue / SLA admin | `/admin/queues` | Manage queue items, SLA policies, draft recovery, activity receipt | `builder`, `admin` |

Builder-originated path: `/builder` → select organization → select workspace
(preserves `WorkspaceContext`) → navigate to `/search` or `/admin/queues`. Return
path: the search page's "Filas/SLA" and "Voltar ao painel" links, and the queue page's
"Voltar"/"Busca" links.

---

## 2. Persistence / Read-Mutation Path

Workspace-scoped real data only; no synthetic/demo fallback is invented in the UI.

### Persisted tables
- `queueItems` (`src/db/schema`) — operator draft/queue line items. `status`
  is the discriminator used by draft recovery (`open` vs `draft`).
- `workspaceQueues` — queue catalog per workspace; used to scope `queueItems`.
- `slaPolicies` — SLA policy per workspace (upserted).
- `event_logs` (runtime `workflow` schema) — immutable audit trail for
  `queue_item.created/deleted/updated/recovered` and `sla_policy.upserted`.

### Data reads (`src/modules/queues/queries.ts`)

- `getRecoverableDrafts()` — selects `queueItems` with `status='draft'` joined to
  `workspaceQueues`, filtered by the active workspace id; returns
  `DraftRecoveryResponse` (a discriminated union over `real | synthetic | demo | empty | blocked`).
- `getQueueAdminData()` — queues, SLA policies, and queue items for the workspace.
- `getQueueItemReceipts()` — last 20 `event_logs` rows for queue audit events.

### Mutations (`src/modules/queues/actions.ts`)

- `recoverQueueItem()` — sets item to `open`, writes a `queue_item.recovered` audit
  event, revalidates `/admin/queues` and `/search`.
- `updateQueueItem`, `deleteQueueItem`, `createQueueItem`, `createSlaPolicy`.

### Contracts

- `DraftRecoveryResponseSchema` (`src/modules/operator-loop/contracts/draft-recovery-dto.ts`) —
  a `z.discriminatedUnion` over `state`, so the UI always renders the exact persisted
  state and never conflates empty/blocked/demo/real.
- `GlobalSearchDTO` and `QueueAuditReceiptSchema`.

### Workspace scoping

All reads guard `eq(workspaceQueues.workspaceId, workspace.id)`; all mutations use
`queueItemScopedToWorkspace()`. `ensureActiveWorkspaceConfig()` resolves the active
workspace for the current session. There is no silent fallback to `sala-tecnica`,
demo, or synthetic data.

---

## 3. User Journey

1. Operator lands on `/` → workspace home. Selects "Recuperação de Rascunhos"
   (`/search#drafts`), "Busca Global" (`/search`), or "Filas e SLA" (`/admin/queues`).
2. On `/search`, the operator types ≥ 2 characters and submits. `searchEverything`
   reads work items, OS, assets, and technicians from persisted tables and renders
   `SearchResults`. Empty/blocked/demo/synthetic/real states each render a distinct panel.
3. The `Recoverable Drafts` section (`id="drafts"`) lists the career's pending drafts.
   The operator clicks **Recuperar** → `recoverQueueItem` flips the item to `open` and
   writes the audit event.
4. `QueueActivityReceipt` renders the immutable `event_logs` trail for the workspace.
5. From `/search`, "Filas/SLA" takes the operator to `/admin/queues` to manage queues
   and SLA, or "Voltar ao painel" returns to `/`.
6. From `/admin/queues`, "Busca" returns to `/search` and "Voltar" to `/admin`.

Builder-originated: `/builder` → organization → selected workspace (preserves
`WorkspaceContext`) → `/search` or `/admin/queues`; return via the same back links.
Direct operator journeys remain workspace-scoped and need no Builder privileges.

**Deep-link fix:** `/src/components/runtime/workspace-home.tsx` links to
`/search#drafts`, but the search page previously had no element with `id="drafts"`, so
that operator return path dead-ended. This stage added `id="drafts"` to every state
branch of the draft-recovery section, so the deep link resolves to the section.

---

## 4. State Distinctions (Empty / Blocked / Demo / Synthetic / Real)

Driven by the `DraftRecoveryResponse` and search DTO discriminated unions. Each branch
renders different copy; there is no hidden mock fallback and no unlabeled synthetic data.

| State | Search outcome | Draft outcome |
|---|---|---|
| `empty` | "Nenhum resultado encontrado" | "Nenhum rascunho para recuperar" |
| `blocked` | "Busca indisponível" + msg | "Recuperação de rascunhos indisponível" + msg |
| `demo` | "Demonstração — Busca Global" | "Demonstração — Rascunhos" |
| `synthetic` | "Busca Global — {label}" | "Rascunhos — {label}" |
| `real` | result groups | recoverable drafts list |

---

## 5. Validation Commands (declared; run by supervisor)

- `npm run check:no-explicit-any`
- `npm run build`

The change introduces no explicit `any`; it is limited to a server-rendered anchor and
this closeout document, so both gates remain intact.

---

## 6. Remaining Blocker (honest)

**Persisted-runtime round-trip proof is blocked by seed state, not by code.** As
recorded in UX-NAV-03-049, the E2E session profile is not present in the seeded
database, so `requireAccessProfile` on `/search` and `/admin/queues` returns a `307`
redirect to `/auth/login`; the E2E sets `x-environment-mode=real` only on the client
page. The UI, persistence, and route contracts are implemented and unit-tested, but a
round-trip against a real seeded DB was not observed in this checkout.

We do **not** claim a live real-data tour here; that would be synthetic evidence. The
persistent read/mutation paths, the route contracts, and the workspace scoping are the
implemented, reviewable evidence.

---

## 7. Commercial Claims and Limits

### Supported
- An operator can search work items, OS, and assets and recover a pending draft into
  an open queue, all within the selected workspace.
- Queue/SLA management, draft recovery, and an activity history are usable on both
  `/search` and `/admin/queues`.

### Not claimed / trade-offs
- No real seeded end-to-end tour presented in this stage (blocker above).
- `deleteQueueItem` treats "Descartar" as a hard delete (no soft-delete/recycle),
  so recovery is only possible while `status='draft'` or via the open path.
- Search matches by `ILike` on title/code/description and returns up to 20 rows per
  entity; recall is bounded.

---

## 8. Files Changed in This Closeout Stage

- `src/app/search/page.tsx` — added `id="drafts"` to the draft-recovery section so the
  `/search#drafts` deep link (and the operator's route home) resolves in all five state
  branches.
- `docs/agent-runs/.../UX-NAV-03-050-queue-search-draft-recovery-closeout/1785784101585/EVIDENCE.md` — this closeout record.

The supporting implementation (routes, queries, actions, contracts, tests) was
delivered in UX-NAV-03-041 through UX-NAV-03-049. This stage closes the product slice
with route/data evidence and one real navigation fix, recording that the end-to-end
user journey having a real DB seed is the one remaining blocker.