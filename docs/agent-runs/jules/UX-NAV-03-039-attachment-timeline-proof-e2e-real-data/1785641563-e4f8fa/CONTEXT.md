# Context

        OpenCode worker prepared an initial draft for this task.

    Draft handling policy:
    - Jules must act as tester/finalizer for the worker draft.
    - Inspect the worker diff first.
    - Keep only changes that satisfy the task contract and allowed scope.
    - Run focused validation and add evidence.
    - Make only minimal corrections if validation fails.
    - Open the PR only after validation is coherent.
    - If the draft is unsafe, empty, out of scope, or not salvageable, stop with a concise blocker.

    Worker model: `opencode/deepseek-v4-flash-free`
    Worker raw output: `/opt/delmacy/system-builder-orchestrator/runs/opencode-worker/UX-NAV-03-039-attachment-timeline-proof-e2e-real-data/opencode-deepseek-v4-flash-free-raw.jsonl`

    Worker changed files:
    - `tests/integration/ux-nav-03-039-attachment-timeline-proof-real-data.test.ts`

    Worker summary:
    I have a full picture of the slice. Now I'll write the real-data journey validation integration test, modeled on the existing `ux-nav-03-029` real-data test pattern.
Let me make the user identity consistent (same email in both user tables, mirroring the official seed) and re-read the final file.
Draft complete. The `check:no-explicit-any`/`build` commands cannot run here because `node_modules` is not installed in this checkout (Jules must repair the environment); my new file contains zero `any` usage (verified by grep).

## Micro-draft: UX-NAV-03-039

**Changed file (1, within `tests/**` allowlist):**
- `tests/integration/ux-nav-03-039-attachment-timeline-proof-real-data.test.ts` (new)

**What it proves (real persisted data, no mocks):**
- Route/screen: `/work-items/[id]` — Work Item Detail. User reaches it from `/work-items`, returns via "Voltar para WorkItems". The three proof sections are: **Anexos** (`EntityCollaboration` → `getEntityAttachments` → `entity_attachments`), **Historico** (`WorkItemEventTimeline` → `getWorkItemEvents` → `workflow.events`), and **Comentarios** (empty state). Same persistence path feeds `/service-orders/[id]`.
- Persistence objects: `entity_attachments` (legacy) + `workflow.events` (runtime) in `tec_db`, seeded under a real org/workspace/user mirroring `src/db/seeds/work-items/seed.ts`.
- Journey: inserts real org → workspace → operator user (legacy + runtime identity) → work item → attachment → 2 timeline events (+1 control entity event), then asserts the exact page read paths (`getWorkItemById`, `getEntityAttachments`, `getWorkItemEvents`) return the persisted rows conforming to `EntityAttachmentSchema` / `WorkItemEventSchema`; asserts newest-first ordering, cross-entity non-leakage, workspaceId carried on every event, empty-vs-real state distinctness, the `CreateEntityAttachmentInputSchema` mutation round-trip, and `resolveWorkspaceContext` preserving the selected workspace (no silent `sala-tecnica` fallback).
- Builder amendment: this is a **direct operator journey** (workspace-scoped, `accessProfile: operador`), so no Builder privileges are exercised; evidence records organization, selected workspace, operator mode, destination route, and return path. Cleanup deletes all created rows.

**No blocker:** all required layers (DB → contract → queries → UI route → workspace context → evidence) were exercised within the allowlist. No migrations, no package changes, no broad cleanup.

    Original task context:
    UX-NAV-03 UX/Full Stack Flow. Stack-based vertical product-slice task generated after governor review showed too little frontend/persistence impact.
