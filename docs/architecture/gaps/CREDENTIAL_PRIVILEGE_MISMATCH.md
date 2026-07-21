# Credential Privilege Mismatch & DB Inventory

This document tracks the current discrepancy between database access expectations, actual code behavior, and target least-privilege architecture.

## Overview

Presently, the application does not segregate database roles for varying tasks. The environment variables `DATABASE_URL`, `PLATFORM_DATABASE_URL`, and `RUNTIME_DATABASE_URL` generally point to the same connection string and do not enforce principle of least-privilege.

## Target Access Model

To build a credible path to real operational data, database access must be classified by credential purpose and least-privilege role. Superuser credentials must not be used by application runtime, tests, or demo paths.

We are separating roles into the following categories:

- **`owner/migration`:** Manages schema changes, creations, and structure. Usually reserved for CI/CD runners (`npm run db:migrate`) or controlled schema maintenance.
- **`app_runtime`:** Used by the application in normal operations (e.g., standard `DATABASE_URL`). Must have read/write/update access to runtime tables but strictly NO schema modification permissions (cannot DROP, ALTER, or CREATE tables).
- **`app_readonly/reporting`:** Restricted to `SELECT` statements only. Used for analytics and external reporting.
- **`seed/maintenance`:** Used during provisioning or periodic cleaning (e.g., deleting synthetic demo data). Must be restricted to specific tables.
- **`break_glass`:** Superuser access for emergencies and destructive maintenance. Requires audit trails, explicit runbooks, and must be rotated after use.

## Exact Mismatch and Superuser Usage

### Current Code Behavior
1. **Superuser Usage:** Often `postgres` or `root` is implicitly used in connection strings (e.g., `postgres://root:password@localhost:5432/tec_db`), granting full overarching permissions to the application.
2. **Unified Connection Mismatch:** `src/db/index.ts` instantiates `platformDb` and `runtimeDb` using the same `DATABASE_URL` fallback. Neither instance restricts actions to their respective domains or enforces least-privilege.
3. **Implicit Test Grants:** Automated tests occasionally use `AGENT_WORK_TEST_DATABASE_URL` which historically inherits superuser roles from the local docker-compose or CI setup without restriction.
4. **Synthetic/Demo Behavior vs Real-Data:** Real-data operations are currently indistinguishable from demo/synthetic data operations at the database credential level, as both run under the same open connection pool.

### The Problem
If the runtime path operates with superuser access, a compromised runtime connection could drop tables or alter schemas. Furthermore, using a unified credential prevents us from cleanly separating demo workflows from operational production workflows.

## Target Least-Privilege Migration Path

To migrate from the current unified superuser approach to the target access model:

1. **Role Provisioning:**
   - Create distinct Postgres roles: `rl_owner`, `rl_runtime`, `rl_readonly`, and `rl_breakglass`.
2. **Revoke Public Defaults:**
   - Run `REVOKE ALL ON SCHEMA public FROM public;` to prevent implicit access.
3. **Grant Least-Privilege:**
   - Grant `SELECT, INSERT, UPDATE, DELETE` on operational tables to `rl_runtime`.
   - Grant `SELECT` to `rl_readonly`.
   - Assign `rl_owner` to migration pipelines.
4. **Credential Rotation:**
   - Update `.env.example` to reflect the segregated URLs.
   - Inject specific, restricted credentials into the application deployment environment.
5. **Runtime Validation:**
   - Implement application-level checks to explicitly reject startup if connected as a superuser.
6. **Break-Glass Auditing:**
   - Establish a documented dry-run/audit process for break-glass operations, requiring runbook adherence for destructive actions.
