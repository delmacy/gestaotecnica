# TASK-SB-PHASE-2-SCHEMA-CI-006 Report

## Goal
Create and publish a fresh PR with a minimal deterministic Schema CI Gate that verifies `builder.agent_gateway_submissions` and `workspace.workspaces` in a real CI Postgres database after applying existing official migrations noninteractively.

## Files Changed/Created
1. **`src/scripts/db/verify-schema-ci.ts` (created)**
   - Uses a direct lazy postgres client to avoid top-level database initializations.
   - Requires `DATABASE_URL` or related variables.
   - Verifies the `builder.agent_gateway_submissions` and `workspace.workspaces` tables exist via `information_schema.tables`.

2. **`src/scripts/db/apply-migrations-ci.ts` (created)**
   - Minimal script using `drizzle-orm/postgres-js/migrator` to apply migrations non-interactively in CI.

3. **`package.json` (modified)**
   - Added `"db:verify-ci"` command to execute `verify-schema-ci.ts`.
   - Added `"db:apply-migrations-ci"` command to execute `apply-migrations-ci.ts`.

4. **`.github/workflows/schema-ci-gate.yml` (created)**
   - Creates a Postgres 15 service.
   - Runs `npm run db:bootstrap`, `npm run db:apply-migrations-ci`, and `npm run db:verify-ci`.

## Executed Commands & Results
- **Missing-env behavior:**
  ```bash
  env -u DATABASE_URL -u PLATFORM_DATABASE_URL -u RUNTIME_DATABASE_URL npm run db:verify-ci
  ```
  **Result:** Failed correctly with `ERROR: No database URL provided. Please set DATABASE_URL, PLATFORM_DATABASE_URL, or RUNTIME_DATABASE_URL.`

- **Local run behavior:**
  ```bash
  npm run db:verify-ci
  ```
  **Result:** Successfully failed due to missing tables in the local database.

- **Architecture check:**
  ```bash
  npm run check:architecture
  ```
  **Result:** Architecture validation passed.

- **Test suites (Unit & Integration):** All tests passed.

## Pull Request
A Pull Request candidate was created for Codex review.
The PR body states: "candidate for Codex review, gate not concluded until Codex review."
