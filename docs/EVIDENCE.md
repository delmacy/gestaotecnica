# UX-NAV-02-018: Cancel/Back/Discard Frontend Evidence

This document proves that the frontend experience implementation for the Cancel/Back/Discard model satisfies the Acceptance Criteria based on the backend contract (`resolveCancelBack`).

## User Journey Fulfillment

The implemented frontend components explicitly define and answer the core journey:
- **Where the user came from:** The user's historical origin context (such as the referer path or entity context like `/builder/portfolio`) is maintained securely and passed to the backend upon secondary navigation.
- **What they do here:** Users can initiate one of three non-destructive secondary actions:
  - **CANCEL:** Abort a localized action (like completing a form) before submission.
  - **BACK:** Navigate up the structural application hierarchy.
  - **DISCARD:** Attempt to leave a view when unsaved (dirty) data is present.
- **Where they go next:** Upon executing one of these actions, they are explicitly navigated using the native Next.js router to their immediate parent context or precise historical origin instead of a hardcoded default page.
- **How they return:**
  - Standard navigation (Cancel/Back) resolves a path back to the historical origin context immediately and invokes `router.push`.
  - If a **DISCARD** intervention gate activates due to unsaved changes (dirty state), the frontend explicitly intervenes with a commercial-framed prompt (e.g. "Discard Configuration") ensuring data is not accidentally lost unless the user confirms, at which point routing proceeds.

## Cross-State Outcomes and Validation

The implementation dynamically parses and presents outcomes depending on application context:
- **Real-Data State:** Normal routing resolves and any unsaved modifications reliably trigger the Discard intervention gate.
- **Empty State:** Navigating back properly leverages the backend contract to return to empty views, enabling "Ready to build your first capability?" messaging via empty state taxonomy.
- **Blocked State:** Standard primary actions might be disabled, but Cancel and Back actions remain active so the user can easily escape.
- **Demo State/Synthetic Data:** Operates fluidly like real data. Intervening "Discard" gates still appear realistically. Synthetic prefix indicators persist in breadcrumbs or context labels dynamically via the backend response.

## Product Language and Design

- Rejects internal jargon (e.g. "Clear form state").
- Focuses on contextual commercial framing provided by the backend label logic (e.g. "Return to Portfolio" or "Discard Configuration").
- Accessible and responsive elements (demonstrated within standard Tailwind setup for forms and intervention modals).

## Quality Assurance

- **Unit/Architecture Rules Passed:** Confirmed zero explicit `any` violations (`npm run check:architecture` and `npm run build`).
- **E2E Playwright Path Verification:** The UI contract tester `cancel-back-test` mounts the hook `useCancelBack` and successfully executes Playwright suites to cover CANCEL resolution and execution, DISCARD intervention triggering and subsequent interaction routing on dirty forms, and BACK logic against blocked constraints.

---

# UX-NAV-03-047: Queue, search, and draft recovery - Permissions, audit, and receipts

Stage evidence for the operator loop slice (`Queue, search, and draft recovery complete the operator loop`).

## Base SHA and scope

- Base branch: `main`, base SHA `0d2631f760f268ba9aad05b3f1b470ed14f735c1` (synced with `origin/main` before editing).
- Changed files and why:

| File | Change needed |
| --- | --- |
| `src/modules/queues/contracts/queue-audit.ts` (new) | Defines the persisted audit/receipt contract (`QueueAuditEventSchema`, `QueueAuditReceiptSchema` with `real`/`empty`/`blocked` states and the declared event types). |
| `src/modules/queues/contracts/index.ts` | Exports the new audit contract. |
| `src/modules/queues/audit-labels.ts` (new) | Commercial/product label mapping for audit event types (no implementation jargon, no secret references). |
| `src/modules/queues/queries.ts` | `getQueueItemReceipts`: Queries `eventLogs` mapping platform events into commercial queue receipts. Preserves `workspaceId` context. |
| `src/modules/queues/actions.ts` | Integrates `requireCurrentUser`, authorization boundaries `queueItemScopedToWorkspace`, and audit emission `recordQueueAuditEvent` for create/update/delete/recover. |
| `src/modules/queues/queue-activity-receipt.tsx` (new) | The domain UI component for rendering the receipt/evidence log. |
| `src/app/search/page.tsx` | Embeds `<QueueActivityReceipt />` to complete the loop. |
| `src/app/admin/queues/page.tsx` | Embeds `<QueueActivityReceipt />` to complete the loop. |

## Product Proof

**Route/Screen Affected:**
- Global Search (`/search`).
- Admin Queues (`/admin/queues`).

**Persisted Data Path:**
- Mutations strictly write to the `events` table (platform log) mapped as queue audits via `recordQueueAuditEvent`.
- Queries read from `events` filtering by `QueueAuditEventTypes`.
- Boundary: Everything runs inside `ensureActiveWorkspaceConfig()`.

**User Journey Map:**
1. Operator opens Search or Queues list.
2. Operator attempts to discard or recover a draft queue item.
3. The Next.js Server Action (`recoverQueueItem`, `deleteQueueItem`) requires the current user and asserts workspace access to the queue.
4. Once the operation succeeds, the server writes an immutable audit log (`queue_item.recovered` etc) pointing to the entity.
5. The UI revalidates the route. The right sidebar explicitly shows the "Comprovante de atividade" (QueueActivityReceipt), proving what was done and when.
6. Unknown events fall back safely to "Evento registrado", and empty states read "Nenhuma atividade registrada neste workspace ainda" (Empty state distinct from Blocked/Demo states).

## Validations (Tester Role)

- **Rules Engine / Any / Types:**
  - Fixed explicit `any` in `events.map((event: any) => ...)` by using `Pick<QueueAuditEvent, 'id' | 'eventType' | 'occurredAt' | 'actorName' | 'entityType'>`. Build now passes perfectly.
  - `npm run check:no-explicit-any` passed.
  - `npm run check:architecture` passed.

- **Test Suite Verification:**
  - Executed `npx tsx --test tests/unit/queue-audit-contract.test.ts`. All 9 domain/contract tests strictly passed without skipping or synthetic data fallbacks.
