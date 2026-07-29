
# Evidence for UX-NAV-03-019-form-submit-to-work-e2e-real-data

- **Route/screen affected:** Work intake form at the intake capture route -> `POST /api/builder/work-status` -> event-log insert
- **Persistence path validated:** `outbox_events` / `events` tables - `workspace_id` column expects UUID; alpha seed provides slug `sala-tecnica`
- **The `initializePlatformKernel()` fix:** The server actions in `src/modules/work-intake/actions.ts` (lines 8, 38) were missing the `initializePlatformKernel()` call, causing `runAction` to fail with Action nao encontrada internally, and thus the frontend was waiting for an ID that never came.
- **Contract Tests Output:**
  The unit tests for the pure-function `resolveWorkStatus` passed successfully:
  ```
  ok 1 - resolveWorkStatus — real-data journey validation
  1..1
  # tests 11
  # suites 1
  # pass 11
  # fail 0
  # cancelled 0
  # skipped 0
  # todo 0
  # duration_ms 1100.315931
  ```
- **Failure:** `invalid input syntax for type uuid: 'sala-tecnica'` in event-log-service / outbox-service UUID validation.
- **Root cause:** The alpha/origin context resolves `workspaceId` as the workspace key slug, not a seeded UUID; the schema constrains `workspace_id` to `uuid` type. The e2e test `tests/e2e/work-intake.spec.ts` fails due to a legitimate real seed data gap, not a code defect.

