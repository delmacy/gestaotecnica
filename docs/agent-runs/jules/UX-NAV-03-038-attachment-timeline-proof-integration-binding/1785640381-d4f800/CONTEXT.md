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
    Worker raw output: `/opt/delmacy/system-builder-orchestrator/runs/opencode-worker/UX-NAV-03-038-attachment-timeline-proof-integration-binding/opencode-deepseek-v4-flash-free-raw.jsonl`

    Worker changed files:
    - `src/app/evidences/page.tsx`
- `src/modules/evidences/contracts/evidences-contract.ts`
- `src/modules/evidences/queries.ts`

    Worker summary:
    Now I understand the landscape. The evidences screen (`/evidences`) reads persisted data but its read path is untyped (no contract binding) and the page uses explicit `any`. Let me verify the test file for the handoff and check how `getEvidences` output relates to the contract, then make the minimal binding edits.
Now I'll make the minimal end-to-end contract binding edits: type the persisted read path through the shared `Evidence` contract and remove the explicit `any` from the screen.
`node_modules` is absent, so I can't run the validation commands locally (Jules handles env repair). Let me verify the final diff for type correctness.
Draft ready. 3 files changed, all within the allowlist.

**Slice: contract binding of the persisted evidences read path → UI.**

- `src/modules/evidences/contracts/evidences-contract.ts` — added `EvidenceSummary` and `EvidenceLinkOptions` schemas/types next to the existing `Evidence` contract.
- `src/modules/evidences/queries.ts` — annotated `getEvidences(): Promise<Evidence[]>`, `getEvidenceSummary(): Promise<EvidenceSummary[]>`, `getEvidenceLinkOptions(): Promise<EvidenceLinkOptions>`; the DB reads are now typed through the shared contract the lower layers validated.
- `src/app/evidences/page.tsx` — replaced the untyped `(item: any)` summary map with `(item: EvidenceSummary)` (removes the only explicit `any` on the screen).

**Through-line for Jules' PR evidence:** route `/evidences` (reached via workspace home card → `workspace-home.tsx:134` and the runtime timeline hub → `(runtime)/[workspaceKey]/timeline/page.tsx:72`); persisted path `evidences` table → `getEvidences()`/`getEvidenceSummary()` → `Evidence` contract → `EvidencesTable`/page; mutation path `createEvidence` → `runAction("evidences.attach")` (workspace-scoped) already bound in stage 037. Empty vs. real states remain distinct (empty table shows "Nenhuma evidencia registrada"; no mock/synthetic fallback introduced).

**Blockers/notes for Jules:**
- Cannot run `npm run check:no-explicit-any` or `npm run build` locally — `node_modules` is absent and install is forbidden for this worker. The changed files contain no `any` (verified by inspection).
- Workspace-scoping schema gap (document, do not migrate): `evidences` has no `workspace_id` column (`src/db/legacy/schema.ts:882`), so per-row workspace filtering would require a migration, which this task forbids; mutation side is scoped via `resolveWorkspaceContext` (defaults to `sala-tecnica` when no workspace is active — flag for governor attention in the PR).

    Original task context:
    UX-NAV-03 UX/Full Stack Flow. Stack-based vertical product-slice task generated after governor review showed too little frontend/persistence impact.
