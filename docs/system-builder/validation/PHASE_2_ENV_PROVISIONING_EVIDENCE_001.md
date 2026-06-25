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

## 4. Execution Evidence

### 4.1. npx playwright install
**Status:** SUCCESS
**Receipt:**
```
Downloading Chrome for Testing 148.0.7778.96
Downloading Chrome Headless Shell 148.0.7778.96
Downloading Firefox 150.0.2
Downloading WebKit 26.4
```

### 4.2. npm run db:bootstrap & db:push
**Status:** BLOCKED (due to lack of test database in sandbox)
**Receipt:**
```
Error creating schemas: AggregateError [ECONNREFUSED]:
    at internalConnectMultiple (node:net:1134:18)
    at afterConnectMultiple (node:net:1715:7) {
  code: 'ECONNREFUSED',
  [errors]: [
    Error: connect ECONNREFUSED ::1:5432
```

### 4.3. npm run test:integration & test:e2e
**Status:** BLOCKED (due to lack of test database in sandbox)
**Receipt:**
```
Error: Failed query: insert into "builder"."process_candidates" ...
[cause]: PostgresError: relation "builder.process_candidates" does not exist
```

## 5. Known Constraints and Blockers
- The sandbox does not natively have an active PostgreSQL database out of the box. Attempts to connect resulted in `ECONNREFUSED` connection failures.
- A new GitHub Actions CI workflow `.github/workflows/main-tests.yml` was created to provide a completely clean, isolated, and working test environment. It will start a postgres service, install playwright, bootstrap schemas, validate db, and run integration + e2e tests.
- A minimal `docker-compose.yml` was provided for local instances that do not face sandbox constraints.

## 6. Resolution
**Status:** BLOCKED / PENDING CI EVIDENCE
Phase 2 environment gating remains blocked locally due to the lack of a fully provisioned database connection (`ECONNREFUSED`). While the workflow and runbook additions establish the required infrastructure for provisioning Postgres and Playwright, full resolution depends on demonstrable CI evidence.
