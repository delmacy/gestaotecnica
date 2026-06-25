# PHASE 2 ENV PROVISIONING GATE 001

## 1. Context and Objective

This document defines the strict gate required before Phase 2 Persistence can be fully accepted and operationalized. Following the conditional acceptance of Phase 1, the lack of an active database environment and end-to-end (E2E) browser binaries blocked the complete validation of integration and E2E layers.

The objective of this gate is to specify the exact environment variables, service dependencies, and validation commands that the target environment (both local sandbox and CI/CD pipelines) must provision before executing operations that mutate the database or require browser runtimes.

**Task:** TASK-SB-PHASE-2-ENV-PROVISIONING-GATE-001
**GitHub Issue:** not created in this PR; pending Phase 2 entry-package/task tracking.

## 2. Environment Variables Requirements

For the core platform and runtime domains to initialize correctly, the following environment variables must be defined and point to valid, reachable database instances:

*   `DATABASE_URL`: The primary fallback/unified connection string.
*   `PLATFORM_DATABASE_URL`: Connection string dedicated to the "Factory" / System Builder platform domain.
*   `RUNTIME_DATABASE_URL`: Connection string dedicated to the operational/client domain (Gestão Técnica).
*   `NODE_ENV`: Must be explicitly set to `test`, `development`, or `production` depending on the execution context.

*Note: In local development or isolated testing, these may all point to the same local instance (e.g., `postgresql://postgres:postgres@localhost:5432/postgres`), but the variables themselves must exist to satisfy application contracts.*

## 3. Local & CI Service Dependencies

### 3.1 Postgres Setup Expectations
*   **Engine:** PostgreSQL (version 15+ recommended).
*   **Accessibility:** The instance must accept connections on the port specified in the `*_DATABASE_URL` strings (typically 5432).
*   **Initialization:** The database engine must be fully ready to accept queries before any `db:*` or `test:*` scripts are invoked.

### 3.2 Playwright Installation Expectations
*   **Binaries:** Playwright browser binaries must be downloaded and installed in the environment prior to executing E2E tests.
*   **Command:** `npx playwright install` (and potentially `npx playwright install-deps` in bare Linux CI environments) must be part of the provisioning pipeline.

## 4. Reproducible Validation Commands

Once the environment variables and services are provisioned, the following commands must be executed to prove environmental readiness. These commands validate the environment without destructively modifying production state.

1.  **Bootstrap Schemas:**
    ```bash
    npm run db:bootstrap
    ```
    *Expectation:* Successfully creates the necessary Postgres schemas (`identity`, `workspace`, `workflow`, etc.) without `ECONNREFUSED` errors.

2.  **Validate Migrations:**
    ```bash
    npm run db:validate
    ```
    *Expectation:* Completes without errors, verifying that the Drizzle schema state is safe and valid.

3.  **Integration Tests:**
    ```bash
    npm run test:integration
    ```
    *Expectation:* Completes successfully without "relation does not exist" or connection timeout errors.

4.  **End-to-End Tests:**
    ```bash
    npm run test:e2e
    ```
    *Expectation:* Executes browser-based flows successfully without "Executable doesn't exist" errors.

5.  **Build Code:**
    ```bash
    npm run build
    ```
    *Expectation:* The Next.js build process completes successfully.

6.  **Type Check:**
    ```bash
    npx tsc --noEmit
    ```
    *Expectation:* Completes with zero typing errors.

## 5. Workflow Gaps & Proposed Next Tasks

### Gap Analysis
Currently, the standard CI workflows lack complete provisioning for the main application test suite:
*   `.github/workflows/agent-work-integration.yml` successfully provisions a Postgres service (`agent_work_test`) specifically for the agent-work domain tests. However, it does not provide the `*_DATABASE_URL` for the broader application tests, nor does it install Playwright.
*   Other workflows (e.g., `architecture-check.yml`) do not provision databases, which is appropriate for their scope, but a holistic PR/Push workflow covering full `test:integration` and `test:e2e` for the entire platform is missing these required services.

### Proposed Next Tasks
To unblock Phase 2 validation across CI and local sandboxes, the following tasks must be scheduled:
1.  **Create/Update Unified CI Workflow:** Introduce a new GitHub Action workflow (or update an existing main testing workflow) that spins up a Postgres service, sets `DATABASE_URL`, `PLATFORM_DATABASE_URL`, and `RUNTIME_DATABASE_URL`, and executes `npx playwright install` before running the unified `npm run test` command.
2.  **Sandbox Provisioning Runbook:** Provide a definitive runbook or Docker Compose file for local agent/developer sandboxes to reliably spin up the required Postgres instance and run Playwright installation prior to autonomous task execution.
