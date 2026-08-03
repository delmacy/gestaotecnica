# UX-NAV-03-044 - Queue, Search, and Draft Recovery Use Case API

## Required Product Proof

- **Affected Route/Screen:** `/admin/queues`
- **Database/Persistence Objects Touched:**
  - `queueItems` (legacy/schema.ts) via `updateQueueItem` and `deleteQueueItem` server actions.
- **Domain Object/Contract Affected:** The core domain contract `UpdateQueueItemSchema` inside `src/modules/queues/contracts/queue-item.ts`.
- **Use Case / API Path:** The Next.js server actions `updateQueueItem` and `deleteQueueItem` were introduced inside `src/modules/queues/actions.ts` directly exposing the draft recovery and discard capabilities using the `UpdateQueueItemSchema`.
- **Validation Evidence:** `updateQueueItem` enforces structural schema validation using `UpdateQueueItemSchema.safeParse` and explicitly extracts the payload identifier using `readRequiredText`.
- **Workspace Isolation:** Both actions properly preserve the workspace context by calling `ensureActiveWorkspaceConfig()` prior to performing any database operations, guaranteeing they do not leak access.

## Journey Explanation
- **How the user reaches the screen:** An operator views queue drafts via `/admin/queues` (or a dedicated draft interface component leveraging these actions).
- **What they do:** The operator triggers the `updateQueueItem` action to modify the draft and elevate it to an "open" or active status. Conversely, they can call `deleteQueueItem` to discard the draft via a hard deletion.
- **Where they go next:** Upon completion, the actions immediately call `revalidatePath("/admin/queues")` redirecting or refreshing the view.
- **How they return:** Navigation continues through standard routing inside the queue operation interface.

## Local validation notes
- `tests/unit/module-boundaries.test.ts` fails identically on `main` and branch, with 2 new boundary violations pre-existing in baseline execution for `src/platform/workflows/infra/workflow.repository.ts` importing `@/db` and `@/db/runtime/schema/workflow`.
- Other failures observed in test suite run for APIs or pre-existing seed idempotency are also present in `main` as blockers that must be formally owned by a separate task.

## Environment Details
- Node Version: v24.18.1
- Base SHA: d04133d359cec5d9f99e6f482cf09d17a80627ce
