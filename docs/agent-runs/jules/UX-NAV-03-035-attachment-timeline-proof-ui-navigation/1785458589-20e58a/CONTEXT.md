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
    Worker raw output: `/opt/delmacy/system-builder-orchestrator/runs/opencode-worker/UX-NAV-03-035-attachment-timeline-proof-ui-navigation/opencode-deepseek-v4-flash-free-raw.jsonl`

    Worker changed files:
    - `src/app/(runtime)/[workspaceKey]/timeline/page.tsx`
- `src/components/layout/AppShell.tsx`
- `src/components/runtime/workspace-home.tsx`

    Worker summary:
    Let me check how evidence queries work and whether they're workspace-scoped.
Now I have a clear picture. Let me implement the 3 edits:

**Edits planned:**
1. `src/components/layout/AppShell.tsx` — Add "Evidências" sidebar entry (currently no nav link to the evidence page exists)
2. `src/components/runtime/workspace-home.tsx` — Add "Evidências" card linking workspace home to the evidence library
3. `src/app/(runtime)/[workspaceKey]/timeline/page.tsx` — Flesh out timeline page with navigation surface
Now update the workspace home to add the evidence card:
Now update the workspace timeline page with proper navigation surface:
Let me fix the timeline page to link to actual existing routes instead of query params that would 404:
Let me verify the files and run validation:
The validation commands require dependencies not installed in the worker environment. Jules will handle environment repair. Let me verify no explicit `any` was introduced in my changes:
Micro-draft complete. Here is the summary for Jules:

## UX-NAV-03-035 — UI Navigation Surface for Attachments & Timeline Proof of Work

### Files changed (3)

1. **`src/components/layout/AppShell.tsx`** — Added `Image` import and new `{ href: "/evidences", ... }` nav item in "Governança do workspace" section. Also corrected the `Documentos` description from "Evidências e arquivos" (which now matches the actual `/evidences` page) to "Relatórios, despachos e revisões" to accurately reflect the `/documents` page purpose.

2. **`src/components/runtime/workspace-home.tsx`** — Added `Image` import and an "Evidências" card linking to `/evidences`. Renamed "Execution" card to "Linha do Tempo" with Portuguese commercial description, linking to `/[workspaceKey]/timeline`.

3. **`src/app/(runtime)/[workspaceKey]/timeline/page.tsx`** — Replaced skeleton page with full navigation surface: breadcrumb (Workspace > Linha do Tempo), back link to workspace home, three navigation cards (Demandas → `/work-items`, Ordens de Serviço → `/service-orders`, Evidências → `/evidences`), and an explanatory section.

### Routes affected
- `/evidences` — now reachable from sidebar and workspace home
- `/[workspaceKey]/timeline` — now has navigation context, back path, and onward links to entity detail pages that already render `WorkItemEventTimeline`/`ServiceOrderEventTimeline` + `EntityCollaboration` (attachments)

### Navigation flow
1. User enters via sidebar "Evidências" → `/evidences` page (existing evidence library), returns via "Voltar ao painel" link
2. User enters via workspace home "Linha do Tempo" card → `/[workspaceKey]/timeline` page, returns via "Voltar ao workspace" link, and can go deeper into entity lists where entity-scoped timelines + attachments already render

### Persisted data path
`evidences` table → `getEvidences()` query (in `src/modules/evidences/queries.ts`) → `/evidences` page → visible evidence records. Entity timelines consume `event_logs` via entity-specific queries.

### Validation pending
- `npm r

    Original task context:
    UX-NAV-03 UX/Full Stack Flow. Stack-based vertical product-slice task generated after governor review showed too little frontend/persistence impact.
