# Multi-tenant Isolation Failures Report - Wave 02

## Executive Summary

| Classification | Count |
| :--- | :---: |
| **REPRODUCED_ISOLATION_FAILURE** | 0 |
| **STRUCTURAL_ISOLATION_FAILURE** | 6 |
| **EXECUTION_BLOCKED** | 5 |
| **SCENARIOS_APPROVED** | 2 |
| **TOTAL SCENARIOS** | 13 |

**System Status: NEEDS REVIEW**

The multi-tenant isolation audit revealed a critical disconnect between the intended system architecture (Runtime schemas, mandatory `workspace_id`) and the actual database state. Most legacy tables lack the necessary columns for tenant isolation, and the database suffers from a major schema drift where architectural schemas defined in Drizzle (`identity`, `workspace`, `workflow`) do not exist, causing execution blocks for functional tests.

---

## DATABASE_SCHEMA_DRIFT

**Description:** Drizzle ORM expects relations to exist within specific PostgreSQL schemas (`identity`, `workspace`, `workflow`), but the sandbox database exposes all relations in the `public` schema.

**Evidence:**
- `getRuntimeDb().select().from(workspaces)` fails with `relation "workspace.workspaces" does not exist`.
- Information schema audit shows 0 tables in schemas `identity`, `workspace`, and `workflow`.
- Intended architectural tables exist in the `public` schema instead.

**Risk:** CRITICAL. Architectural boundary enforcement is completely bypassed. Functional tests using the Drizzle ORM fail during setup, preventing reproduction of actual data leaks via ORM queries.

---

## 1. Work Intake Module

### Scenario: Listings and Detail Access
- **Module:** Work Intake
- **File/Function:** `src/modules/work-intake/queries.ts` / `getIntakeRequests`, `getIntakeRequestById`
- **Classification:** `SCENARIOS_APPROVED`
- **Workspace A:** `test-ws-wsA-...`
- **Workspace B:** `test-ws-wsB-...`
- **Results:**
    - Listings: Reproduced isolation correctly. WS A listing does not return WS B records.
    - Detail by ID: Correctly blocked. WS B cannot fetch WS A record by ID.
- **Evidence:** `work-intake.log` shows `ok 1` and `ok 2`.
- **Status:** PASS (Isolated via `builder.process_candidates` which HAS `workspace_id`).

### Scenario: History Isolation
- **Module:** Work Intake
- **File/Function:** `src/modules/work-intake/queries.ts` / `getIntakeHistory`
- **Classification:** `EXECUTION_BLOCKED`
- **Error:** `PostgresError: relation "workflow.events" does not exist`
- **Command:** `npx tsx --test tests/multi-tenant/work-intake.isolation.test.ts`
- **Risk:** UNKNOWN. Blocked by schema drift.

---

## 2. Assets Module

### Scenario: Global Access and Aggregates
- **Module:** Assets
- **File/Function:** `src/modules/assets/queries.ts` / `getAssets`, `getAssetById`, `getAssetSummary`
- **Classification:** `STRUCTURAL_ISOLATION_FAILURE`
- **Evidence:** Table `public.assets` is **MISSING** `workspace_id` column.
- **Risk:** CRITICAL. Any user in any workspace can list, view, and count ALL assets in the system.
- **Recommendation:** Add `workspace_id` to `assets` table and update queries to filter by context.

---

## 3. Work Items (Case Management)

### Scenario: Operational Isolation
- **Module:** Case Management
- **File/Function:** `src/modules/work-items/queries.ts` / `getWorkItems`, `getWorkItemById`, `getWorkItemSummary`
- **Classification:** `STRUCTURAL_ISOLATION_FAILURE`
- **Evidence:** Table `public.work_items` is **MISSING** `workspace_id` column.
- **Risk:** CRITICAL. Cross-tenant data leakage is structurally guaranteed.
- **Recommendation:** Mandatory migration to add `workspace_id`.

---

## 4. Approvals Module

### Scenario: Approval Queue Isolation
- **Module:** Approval Workflow
- **File/Function:** `src/modules/approvals/queries.ts` / `getApprovalQueue`, `getApprovalSummary`
- **Classification:** `STRUCTURAL_ISOLATION_FAILURE`
- **Evidence:** Table `public.service_orders` is **MISSING** `workspace_id` column.
- **Risk:** HIGH. Service orders from all tenants appear in a single global approval queue.

---

## 5. Workforce Module

### Scenario: Resource and Team Isolation
- **Module:** Workforce
- **File/Function:** `src/modules/workforce/queries.ts` / `getTeams`, `getTechnicians`, `getWorkforceSummary`
- **Classification:** `STRUCTURAL_ISOLATION_FAILURE`
- **Evidence:** Tables `public.teams` and `public.technician_profiles` are **MISSING** `workspace_id`.
- **Risk:** HIGH. Workforce data is global, allowing cross-tenant visibility of personnel and team structures.

---

## 6. Reporting Module

### Scenario: Data Blocking
- **Module:** Reporting
- **File/Function:** `src/modules/reports/queries.ts` / `getReports`, `getOperationalReportData`
- **Classification:** `SCENARIOS_APPROVED`
- **Results:** Correctly identifies isolation gaps and returns empty data/blocked status.
- **Evidence:** `reports.log` shows `ok 1` and `ok 2`.
- **Status:** PASS (Isolated by intentional blocking in the application layer until schema is fixed).

---

## EXECUTION_BLOCKED Summary

| Module | Test File | Reason | Error obtained |
| :--- | :--- | :--- | :--- |
| **Work Intake** | `work-intake.isolation.test.ts` | Schema Drift | `relation "workflow.events" does not exist` |
| **Assets** | `assets.isolation.test.ts` | Timeout | `Command timed out after 400s` |
| **Work Items** | `work-items.isolation.test.ts` | Timeout | `Command timed out after 400s` |
| **Approvals** | `approvals.isolation.test.ts` | Timeout | `Command timed out after 400s` |
| **Workforce** | `workforce.isolation.test.ts` | Timeout | `Command timed out after 400s` |

---

## Final Recommendation

1. **Schema Correction:** Reconcile the database state with the Drizzle ORM definitions to resolve `DATABASE_SCHEMA_DRIFT`.
2. **Column Migration:** Immediately migrate `assets`, `work_items`, `service_orders`, `teams`, `technician_profiles`, and `reports` to include `workspace_id`.
3. **Query Refactoring:** Once columns exist, update all `queries.ts` in the affected modules to include mandatory `.where(eq(table.workspaceId, context.workspaceId))` clauses.
4. **Tenant Isolation Policy:** Enforce `workspace_id` at the database level with Row Level Security (RLS) if possible, or via strict middleware in the Platform Kernel.
