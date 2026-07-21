# Database Access and Roles Model

The database enforces a least-privilege access model using explicit PostgreSQL roles. All database interactions must use the appropriate role according to their purpose.

## Defined Roles

*   **`owner_migration`**: Used for schema bootstrapping, running `drizzle-kit push`, and performing structural database migrations. It possesses `ALL PRIVILEGES` on all tables and sequences across application schemas.
*   **`app_runtime`**: The primary operational role used by the running application. It holds `SELECT`, `INSERT`, `UPDATE`, and `DELETE` privileges, but cannot alter table structures, truncate tables, or grant privileges. The application's `DATABASE_URL` (or `PLATFORM_DATABASE_URL` / `RUNTIME_DATABASE_URL`) should authenticate as this role in production.
*   **`app_readonly` (Reporting)**: Designed for read-only analytical, reporting, or export processes. It possesses only `SELECT` privileges on all tables and sequences.
*   **`seed_maintenance`**: Used by automated seed scripts or maintenance processes. It possesses `SELECT`, `INSERT`, `UPDATE`, and `DELETE` capabilities. While structurally similar to `app_runtime`, it allows logical separation between operational application runtime connections and deployment/maintenance connections.
*   **`break_glass`**: A high-privilege emergency role possessing `ALL PRIVILEGES` across all schemas. It is strictly reserved for destructive maintenance, incident recovery, and break-glass procedures.

## Security Constraints

*   Application runtime configurations (`DATABASE_URL`, `PLATFORM_DATABASE_URL`, `RUNTIME_DATABASE_URL`) **must not** use PostgreSQL superuser (`postgres`) or `owner_migration` roles. They must use the `app_runtime` role.
*   Tests and demo paths must not execute using break-glass or superuser credentials.
*   Hardcoded credentials are strictly forbidden. Credentials must be injected via secure environment variables.

## Break-Glass and Destructive Maintenance Path

Destructive database operations (e.g., mass deletions, data wipes, structural alterations outside of tracked migrations) must follow strict operational procedures:

1.  **Maintenance Script/Runbook**: All destructive operations must be codified in a specific maintenance script or documented runbook, never executed ad-hoc via interactive SQL prompts on production data.
2.  **Dry-Run Evidence**: The maintenance script must support or be preceded by a dry-run execution. The results of the dry-run (e.g., number of rows affected, constraints validated) must be documented.
3.  **Audit Log Entry**: A formal audit log entry (or change control ticket) must be created containing the dry-run evidence, the exact scoped target, and the business justification.
4.  **Role Usage**: Break-glass procedures must exclusively use the `break_glass` credentials.

**To invoke a break-glass scenario:**
*   Ensure the change control/audit log is approved.
*   Inject the `break_glass` role credentials into the execution environment.
*   Execute the prepared maintenance script.
*   Revoke or expire the injected credentials immediately upon completion.

### Revocation and Rollback Commands

If an emergency role or access needs to be immediately revoked, or if privileges need to be stripped from a compromised role, use the following documented commands (executed as a superuser):

```sql
-- Revoke all privileges from the break_glass role across all schemas:
REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public, identity, workspace, workflow, registry, documents, storage, blueprints, builder FROM break_glass;
REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public, identity, workspace, workflow, registry, documents, storage, blueprints, builder FROM break_glass;
REVOKE USAGE ON SCHEMA public, identity, workspace, workflow, registry, documents, storage, blueprints, builder FROM break_glass;

-- Terminate active connections for a specific role (e.g., break_glass):
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE usename = 'break_glass'
  AND pid <> pg_backend_pid();

-- Drop a compromised role entirely (ensure no objects are owned by it first):
DROP ROLE IF EXISTS break_glass;
```
