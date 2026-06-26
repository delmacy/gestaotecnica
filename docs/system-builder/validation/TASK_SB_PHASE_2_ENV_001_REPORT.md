# TASK-SB-PHASE-2-ENV-001 - Proof of Environment Blocker Report

## Status
`blocked/review`

## Overview
The gate `ENV-001` (fresh DB integration proof) remains blocked because of integration test failures and database cleanup sequence violations during the testing pipeline. While partial proof has been established (CI can provision Postgres, run `db:migrate-ci` / `db:bootstrap`, validate architecture, typecheck, and build), the final pipeline steps for `test:integration` and `test:e2e` fail on a fresh CI Postgres database.

## Details of the Blocker

1. **Integration Test Assertions Fail After Schema Traceability Updates:**
   Recent attempts to satisfy missing traceability constraints (from PR #321) introduced `traceability.receipts`, but the updated Agent Gateway flow failed during `test:integration`. Specifically:
   - In `tests/integration/agent-gateway-idempotency.integration.test.ts`, the assertion for `candidate` persistence (`assert.ok(candidate)` at line 67) returned false.
   - The assertion for the submission record (`assert.ok(submission)` at line 126) also returned false.
   This indicates that after traceability is present, the agent gateway initial or invalid submissions do not successfully persist the expected candidates or submission states in the integration environment.

2. **Database Cleanup Foreign Key Violations:**
   The integration tests failed during their Postgres cleanup phase. Attempting to delete from `workspace.workspaces` violated the foreign key constraint `receipts_workspace_id_workspaces_id_fk` on `traceability.receipts` because receipts still reference workspace rows. The cleanup strategy needs to be re-ordered to safely drop references in `traceability.receipts` before clearing workspaces.

3. **E2E Tests Blocked:**
   Because the integration tests fail (and `test:e2e` relies on a successful preceding `test:integration` step in the workflow), the E2E tests are skipped and the gate cannot be evaluated for final UI/environment proof.

## Recommended Next Steps / Follow-up Task

Create a follow-up task to narrowly address the schema integration and cleanup:
1. **Fix Test Cleanup Sequence:** Update the testing teardown logic to ensure `traceability.receipts` (and any other dependencies) are cleared before attempting to delete `workspace.workspaces`.
2. **Investigate Agent Gateway Persistence:** Debug `processAgentSubmissionWithMetadata` inside `agent-gateway-idempotency.integration.test.ts` to identify why candidates and submissions are not persisting as expected when evaluated against the real `traceability.receipts` schema in CI.

Once these integration failures and cleanup violations are safely resolved without neutralizing the tests, `ENV-001` can be re-evaluated.
