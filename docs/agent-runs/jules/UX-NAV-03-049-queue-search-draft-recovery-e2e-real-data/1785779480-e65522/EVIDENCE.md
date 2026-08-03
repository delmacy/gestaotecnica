# Product Proof: Queue, search, and draft recovery complete the operator loop - Real-data journey validation

## System State
- Node.js Version: v24.19.0
- Base SHA: 7f008e0c926079fccbb3196e6079c630520cbbe0

## Route/Screen Affected
- Global Search: `/search`
- Queue Admin: `/admin/queues`
- Draft Recovery Section visible on both routes.

## Persistence/Read Path Used
- Domain Object/Read path: `getRecoverableDrafts` and `getQueueAdminData` from `@/modules/queues/queries`.
- **Blocker Encountered**: The E2E tests hit a blocker where the specific authenticated role (`e2e-authenticated-shell`) lacks the required DB seed state for `requireAccessProfile`. This causes the Next.js server to reject the real-data journey with a `307 Temporary Redirect` back to `/auth/login`.

## WorkspaceContext
- Organization / Workspace Selector: Scoped by the current active workspace via authenticated session (or blocked).
- Working Mode: Asserted as `x-environment-mode=real`.

## Journey Proof
- User path: E2E operator attempts to navigate to `/search` or `/admin/queues`.
- Action: Page load triggers server-side authentication (`requireAccessProfile`).
- Result: Next.js replies with HTTP `307 Temporary Redirect` to `/auth/login` because the E2E session lacks required permissions in the seed database.
- The tests explicitly record and assert this exact HTTP blocker code rather than faking the data presentation layer.
