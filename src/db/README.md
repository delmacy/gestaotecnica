# Database Access Model

This document outlines the database access roles and their intended purposes to enforce a least-privilege security model.

## Roles and Privileges

1.  **`owner_migration`**:
    *   **Purpose**: Handling DDL operations, schema migrations, and full table control.
    *   **Privileges**: `ALL PRIVILEGES` on all tables and sequences across application schemas.
    *   **Usage**: Used only during deployment or by automation tools responsible for migrating the database schema (e.g., `npm run db:migrate`). Must not be used by the application runtime.

2.  **`app_runtime`**:
    *   **Purpose**: General application runtime operations (reads and writes).
    *   **Privileges**: `SELECT, INSERT, UPDATE, DELETE` on tables; `USAGE, SELECT, UPDATE` on sequences. Specifically **does not** have `CREATE` or superuser privileges.
    *   **Usage**: Bound to the `RUNTIME_DATABASE_URL` environment variable. This is the credential the Next.js application uses during normal operation to query and mutate data securely.

3.  **`app_readonly`**:
    *   **Purpose**: Reporting, analytics, or read-only application functions.
    *   **Privileges**: `SELECT` on all tables and sequences.
    *   **Usage**: Used by components or external tools that require data visibility without mutation capabilities.

4.  **`seed_maintenance`**:
    *   **Purpose**: Running data seeding scripts, bootstrap tasks, or routine data maintenance.
    *   **Privileges**: `SELECT, INSERT, UPDATE, DELETE` on tables; `USAGE, SELECT, UPDATE` on sequences. Can bypass certain application-level constraints for administrative tasks but lacks DDL permissions.
    *   **Usage**: Used by scripts like `ensure-platform-admin.ts` via `SEED_MAINTENANCE_DATABASE_URL` or `MAINTENANCE_DATABASE_URL` to configure initial required data safely.

5.  **`break_glass`**:
    *   **Purpose**: Emergency manual interventions and destructive maintenance.
    *   **Privileges**: `ALL PRIVILEGES` on all tables and sequences.
    *   **Usage**: Must only be used via `BREAK_GLASS_DATABASE_URL` under strict control for incident recovery. Requires documented dry-runs and audit logs.

## Security Constraints

-   The application runtime (`RUNTIME_DATABASE_URL`) **must never** use a PostgreSQL superuser role.
-   Schema creation and destructive operations are strictly segregated from the application runtime path.
