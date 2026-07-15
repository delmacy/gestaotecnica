# Phase 2: Persistence - Entry Package

## 1. Context and Objective

This document defines the Entry Package for Phase 2 (Persistence) of the System Builder.
As established in the Phase 1 Final Gate (Phase 1 Final Gate), Phase 1 was conditionally accepted. This conditional acceptance mandates that the environment constraints (lack of dev/test Postgres and Playwright binaries) must be resolved before Phase 2 can be fully accepted and operationalized.

The primary goal of Phase 2 is to establish the fundamental, unbreakable layer of data storage and schema models in the database, adhering strictly to Drizzle rules and Postgres architecture for separation of Platform vs Runtime.

## 2. Blockers & Phase 1 Condition

**Critical Condition for Phase 2 Full Acceptance:**
Phase 2 **CANNOT** be fully accepted, and its subsequent gates cannot be passed, until the following operational evidence exists:
1. **Provisioned Environment:** A dev/test Postgres instance is provisioned and Playwright binaries are installed (or a documented CI service supplying these is configured).
2. **Execution Receipts:** Verifiable operational evidence showing successful execution of `npm run db:bootstrap`, `npm run db:validate`, `npm run test:integration`, and `npm run test:e2e`.

Any attempt to bypass this condition will trigger an immediate rollback to the Phase 2 Entry Gate.

## 3. Scope and Dependencies

### Dependencies
- **Upstream:** Phase 1 Consolidation (Conditionally Accepted).
- **Environment:** Postgres (Dev/Test), Playwright (E2E).

### Out of Scope for Phase 2
- Workflow/Action execution logic (Phase 4).
- Domain/Client-specific business capabilities (Phase 5).
- UI/API end-to-end integration (Phase 3).

## 4. Ordered Tasks

The work for Phase 2 Persistence is divided into the following sequential tasks:

1. **TASK-SB-PHASE-2-ENV-001:** Resolve Phase 1 constraints. Provision Postgres and Playwright. Provide verifiable evidence of successful `db:bootstrap`, `test:integration`, and `test:e2e`.
2. **TASK-SB-PHASE-2-SCHEMA-PLATFORM-001:** Define and refine Platform schemas (System Builder internal models).
3. **TASK-SB-PHASE-2-SCHEMA-RUNTIME-001:** Define and refine Runtime schemas (Client/Execution models).
4. **TASK-SB-PHASE-2-MIGRATION-001:** Generate Drizzle migrations and validate safe push (`npm run db:migrate`).
5. **TASK-SB-PHASE-2-DATA-ACCESS-001:** Implement foundational data access utilities (queries/mutations) matching the defined schemas.
6. **TASK-SB-PHASE-2-FINAL-GATE-001:** Compile Phase 2 evidence, run full test suite, and evaluate acceptance.

## 5. Acceptance Criteria

- All tasks listed above are completed with verifiable evidence.
- The Phase 1 condition (Postgres and Playwright evidence) is explicitly resolved and documented.
- Architecture validation (`npm run check:architecture`) passes without errors.
- Unit and integration tests for the Persistence layer pass.
- Drizzle migrations apply cleanly to a pristine Postgres instance.

## 6. Rollback Rules

- If `db:bootstrap` or `drizzle-kit push` fails destructively or causes data loss in an existing environment, immediately abort the operation and restore the database state (or drop the test schema).
- If validation checks fail after a schema change, revert the schema change commit before opening the PR.
- If the Phase 1 environment constraint cannot be resolved, halt Phase 2 execution and escalate to Codex/Manager.
