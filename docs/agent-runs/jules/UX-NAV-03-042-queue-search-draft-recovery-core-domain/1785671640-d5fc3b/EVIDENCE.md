# UX-NAV-03-042 - Core Domain Model Completion

## Required Product Proof

- **Affected Route/Screen:** `/admin/queues`
- **Database/Persistence Objects Touched:**
  - `workspaceQueues` (legacy/schema.ts)
  - `queueItems` (legacy/schema.ts)
  - `slaPolicies` (legacy/schema.ts)
- **Domain Object/Contract Affected:** New contracts have been introduced in `src/modules/queues/contracts/` to securely model the aforementioned legacy database schema properties natively within the domain.
  - `WorkspaceQueue` (workspace-queue.ts)
  - `QueueItem` (queue-item.ts)
  - `SlaPolicy` (sla-policy.ts)
- **Use Case / API Path:** The Next.js server actions responsible for creating queue entries and SLAs (`createQueueItem`, `createSlaPolicy` inside `src/modules/queues/actions.ts`) were hardened using these contracts and the robust `zod` parsers `CreateQueueItemSchema.safeParse` and `CreateSlaPolicySchema.safeParse`. The explicit `FormData` string extraction mechanism has been entirely replaced.
- **Validation Evidence:** The server actions in `src/modules/queues/actions.ts` now rely on these contracts for payload parsing and structural assurance.

## Journey Explanation
- **How the user reaches the screen:** Navigating to `/admin/queues`.
- **What they do:** An operator will evaluate recent queue items via the "Itens recentes" panel, view SLA policy limitations, or register new SLA rules via the "Nova politica SLA" form, all strictly isolated by `ensureActiveWorkspaceConfig()`.
- **Where they go next:** Upon interaction, form events hit server actions that now validate cleanly via the new core domain schemas before performing database inserts.
- **How they return:** A "Voltar" link mapped to `/admin` guarantees a safe exit strategy.

## Environment Details
- Node Version: v24.18.1
- Base SHA: 77788c8fcd40b7bebdf39b74abba2656984f9a3a
