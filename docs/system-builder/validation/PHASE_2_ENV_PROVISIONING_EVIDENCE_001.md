# Phase 2 ENV PROVISIONING EVIDENCE 001

## 1. Context and Objective
This document captures the evidence of execution for TASK-SB-PHASE-2-ENV-001, which required resolving the environment gate defined in `PHASE_2_ENV_PROVISIONING_GATE_001.md` by providing reproducible database and Playwright provisioning, executing validation commands, and capturing real outcomes.

## 2. Environment Variables Constraints
To properly execute local tests, the following environment variables are required:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"
PLATFORM_DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"
RUNTIME_DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"
```

## 3. Playwright Constraint
Playwright binaries are now provided via the standard workflow command `npx playwright install`. A new CI workflow has been introduced to ensure dependencies are loaded via `npx playwright install --with-deps`.

## 4. Execution Evidence (GitHub Actions CI)

A new CI workflow `.github/workflows/main-tests.yml` was created to provide a completely clean, isolated, and working test environment. It successfully provisions a postgres service and installs playwright.

### 4.1. Postgres Health & Playwright Install
**Status:** SUCCESS
The workflow successfully established a healthy Postgres service on port 5432 and executed `npx playwright install` with required dependencies.

### 4.2. db:bootstrap & db:validate
**Status:** SUCCESS
The workflow successfully established the database connection and executed the schema bootstrap and Drizzle validation steps without errors.

### 4.3. db:push & Schema Application
**Status:** BLOCKED / PENDING CI RETRY
Previous test execution runs revealed that `test:integration` failed because tables were not created before tests (`relation "workspace.workspaces" does not exist`). The workflow has been updated to include `npm run db:push` after `db:validate` to ensure schema tables are applied correctly before running tests.

### 4.4. test:integration
**Status:** BLOCKED / PENDING CI RETRY
Execution failed previously due to missing relations. A deterministic timeout of 10 minutes has been applied to this step to prevent indefinite hanging, and it awaits the updated schema push fix.

### 4.5. test:e2e
**Status:** PENDING
Execution is dependent on the prior steps completing successfully. A deterministic 10-minute timeout has been applied.

## 5. Known Constraints and Blockers
- The local sandbox does not natively have an active PostgreSQL database out of the box. Attempts to connect resulted in `ECONNREFUSED` connection failures. A minimal `docker-compose.yml` was provided for local instances that do not face sandbox constraints.

## 6. Resolution
**Status:** BLOCKED / IN PROGRESS
Phase 2 environment gating remains blocked. While the infrastructure for provisioning Postgres and Playwright has been established via the CI workflow, the validation cannot be fully accepted until the schema is successfully applied via `db:push` and integration/e2e tests execute conclusively without missing relation errors or hanging.
