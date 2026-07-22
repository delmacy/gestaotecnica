# Real Environment and DB Access Readiness Report

## What is Real
- **Database Schema Validation**: Core schemas (`identity`, `workspace`, `workflow`, `registry`, `documents`, `storage`, `blueprints`, `builder`) are strictly validated for presence before runtime binds to the database.
- **Role Segregation**: A strict least-privilege model is in place for different operational contexts.
- **Runtime Protections**: The application runtime is expressly barred from executing as a PostgreSQL superuser. Preflight binding checks explicitly query `pg_roles` for `rolsuper` and schema-level `CREATE` privileges.
- **Audit Logging for Maintenance**: Destructive operations (like full schema teardowns) mandate explicit audit logs to proceed (e.g., pointing to `docs/operations/AUDIT_REPORT.md`).

## What is Blocked / Synthetic
- **Capability Explorers & UI Views**: Some sections of the UI, such as the capabilities explorer (`src/components/builder/capabilities/*`) and view builders, still explicitly rely on "synthetic" data modes. Actions like "Request Install" only simulate state locally and do not interact with the persistent database or workspace records.
- **Privilege Blocking**:
  - Application runtime environments attempting to boot with a `RUNTIME_DATABASE_URL` that maps to a superuser account will fail immediately with a `BLOCKER` error.
  - The runtime role is blocked from holding `CREATE` privileges on operational schemas.
- **Destructive Commands**: Break-glass teardown operations are blocked natively unless an audit trail file is explicitly provided, preventing accidental `CASCADE DROP` events.

## Current Credential Classes
The operational database environment separates credentials into five strictly scoped roles:

| Role Class | Purpose & Privileges |
| :--- | :--- |
| **`owner_migration`** | ALL PRIVILEGES. Used for schema DDL operations and automated migrations. |
| **`app_runtime`** | SELECT, INSERT, UPDATE, DELETE. Least-privilege role used by the active application to process live data. Explicitly denied CREATE access. |
| **`app_readonly`** | SELECT only. Used for reporting, BI, and safe read-only queries. |
| **`seed_maintenance`** | SELECT, INSERT, UPDATE, DELETE. Used for safe database seeding and non-DDL maintenance tasks. |
| **`break_glass`** | ALL PRIVILEGES. Reserved for emergency manual interventions, recovery, or destructive resets. |

## Exact Admin Access Commands

**Role Provisioning:**
```bash
# Requires DATABASE_URL (superuser access) to establish baseline roles
npm run db:setup-roles
```

**Break-Glass Maintenance (Dry Run):**
```bash
# Requires BREAK_GLASS_DATABASE_URL
npm run db:break-glass:teardown -- --dry-run
```

**Break-Glass Maintenance (Destructive):**
```bash
# Requires BREAK_GLASS_DATABASE_URL and an explicit audit file evidence
npm run db:break-glass:teardown -- --audit-file docs/operations/AUDIT_REPORT.md
```

## Is Runtime Still Using Superuser?
**No.** The real application path no longer runs as a superuser.

This is enforced by `src/scripts/db/preflight-env-binding.ts`, which runs on database initialization. The preflight check executes `SELECT rolsuper FROM pg_roles WHERE rolname = current_user` and fails fast if the user is a superuser, additionally ensuring the runtime role lacks `CREATE` schema privileges. Synthetic/demo environments bypass these strict least-privilege validations purely for ephemeral testing without real data exposure risk.
