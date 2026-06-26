# TASK-SB-PHASE-2-ENV-001 - Proof of Environment Blocker Report

## Status
`blocked/review`

## Blocker Details

The gate `ENV-001` demands honest proof for `test:integration` and `test:e2e` on a fresh CI Postgres database. However, this is currently blocked due to a fundamental issue in the CI script configuration:

1. **Drizzle Migration TTY Requirement:**
   Running `npm run db:migrate-ci` (which relies on `npx drizzle-kit migrate` internally or runs migrations that eventually trigger interactive prompts, though the documentation indicates it might be `drizzle-kit push` failing when triggered from `db:migrate`) fails because it requires an interactive TTY terminal (`Interactive prompts require a TTY terminal`). This breaks the automated migration pipeline in the headless CI/Agent environment.

2. **Database Initialization Sequence (Clean State):**
   When attempting to initialize a fresh database via `npm run db:setup:unified-test`, the script attempts to execute `ALTER TABLE workflow.process_definitions`. Because the migrations have not yet successfully run (due to the point above or incorrect script sequencing), the `workflow.process_definitions` table does not exist, causing a `PostgresError: relation "workflow.process_definitions" does not exist`.

3. **Missing Drizzle Migration SQL:**
   The `db:verify-ci` CI validation step explicitly searches for the `builder.agent_gateway_submissions` and `workspace.workspaces` tables. In a fresh, un-migrated database, these are naturally not found, causing the pipeline to fail with `Error: builder.agent_gateway_submissions table not found.`

### Evidence

**1. `npm run db:setup:unified-test` Failure:**
```
> gestaotecnica@0.1.0 db:setup:unified-test
> npx tsx src/scripts/setup-unified-test-database.ts

Failed to prepare unified test database: PostgresError: relation "workflow.process_definitions" does not exist
    at ErrorResponse (/app/node_modules/postgres/cjs/src/connection.js:815:30)
```

**2. `npm run db:migrate` (CI TTY failure) via `drizzle-kit push`:**
```
Error: Interactive prompts require a TTY terminal (process.stdin.isTTY or process.stdout.isTTY is false). This can happen when running in CI, piped input, or non-interactive shells.
    at render10 (/app/node_modules/drizzle-kit/bin.cjs:1450:31)
    at pgPush (/app/node_modules/drizzle-kit/bin.cjs:82737:72)
```

**3. `npm run db:verify-ci` Failure:**
```
> gestaotecnica@0.1.0 db:verify-ci
> npx tsx src/scripts/db/verify-schema-ci.ts

Connecting to database via lazy client...
Error: builder.agent_gateway_submissions table not found.
Error: workspace.workspaces table not found.
```

## Recommended Next Steps

A separate, explicit task must be created to repair the database bootstrap and migration sequence for headless/CI environments.

1. **Remove or Replace Interactive Commands:** Ensure that CI migration pipelines (like `db:migrate-ci`) strictly use `drizzle-kit migrate` and that all migrations are correctly pre-generated without relying on `drizzle-kit push` which triggers interactive prompts.
2. **Fix `setup-unified-test-database.ts` Sequencing:** Ensure that any `.ts` script trying to alter tables (like adding columns or constraints) only runs *after* the initial Drizzle SQL migrations have been applied, or check if the table exists first.

Once the CI environment can consistently and safely instantiate the schema from scratch without user interaction, `ENV-001` integration and E2E tests can be properly evaluated.
