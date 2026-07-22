# Break-Glass Destructive Maintenance Runbook

## Purpose
This document defines the strict procedure for executing destructive database maintenance or emergency recovery operations. It ensures these actions are controlled, audited, and isolated from normal application runtime paths. Superuser or "break-glass" credentials are strictly limited to these operations.

## Credential Policy
- **App Runtime:** Standard `DATABASE_URL` operates with a least-privilege role (`app_runtime`) and CANNOT perform destructive actions (e.g., DROP TABLE, TRUNCATE, schema changes).
- **Break-Glass/Superuser:** Used *only* for the operations below. Never exposed to app runtime, tests, or demo environments.

## Authorized Scenarios
1. **Controlled Migration:** Schema initialization or irreversible data migrations.
2. **Destructive Maintenance:** Complete database resets or environment tear-downs.
3. **Emergency Recovery:** Restoring from backups or fixing critical data corruption that the `app_runtime` user lacks permissions to address.

## Execution Requirements

### 1. Scoped Target
The operation must have a clearly defined target environment (e.g., `staging`, `preview`). Operations in `production` require secondary approval and backup verification.

### 2. Explicit Maintenance Script
Do not run raw SQL commands directly. All operations must use verified scripts, such as:
- `npm run db:seed:golden-e2e:clean` (with specific env guards)
- Dedicated reset scripts under `src/scripts/`
- `npm run db:break-glass:teardown` (for complete schema wipe, defaults to dry-run)

### 3. Dry-Run Evidence
Before executing any destructive change, a dry-run or verification command must be executed to confirm the target and scope.
- **Example:** Running `npm run db:check` or executing a read-only `SELECT COUNT(*)` on the target tables to record the pre-destruction state.

### 4. Audit Log Entry
Every break-glass execution must be documented in `docs/operations/AUDIT_REPORT.md` (or equivalent incident tracking) including:
- Date & Time
- Executing Operator
- Approver (if applicable)
- Target Environment
- Command Executed
- Dry-Run Evidence (e.g., Row counts before and after)
- Justification

## Example Runbook Execution

**Scenario:** Resetting the Staging Environment Database

1. **Verify Target:** Confirm the `BREAK_GLASS_DATABASE_URL` points specifically to the staging instance.
2. **Dry-Run:** Execute a script that reports current data volume without deleting it.
3. **Execute Script:** Run the targeted wipe script using the break-glass credentials.
4. **Audit:** Record the execution details in the audit log.
5. **Revoke/Rotate:** If temporary credentials were used, revoke them immediately.
