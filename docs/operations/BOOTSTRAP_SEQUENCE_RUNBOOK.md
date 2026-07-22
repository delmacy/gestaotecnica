# Bootstrapping the System Builder

## Concept
The `bootstrap` command ensures idempotency, safely applying operations necessary to set up a clean or slightly out-of-date environment, while guarding against unauthorized or destructive actions.

## Run the Bootstrap Sequence
1. Set required database credentials (e.g. `DATABASE_URL`).
2. Run the command:
   ```bash
   npm run bootstrap
   ```
3. What happens during this process:
   - **`db:migrate`**: Runs `bootstrap-schemas` (creates schemas, assigns least-privilege roles), `validate-migrations`, and then pushes drizzle schema.
   - **`db:preflight`**: Verifies that the app database credentials run under a least-privilege role, checking for presence of superuser grants or unintended CREATE permissions.
   - **`ensure-platform-admin`**: Verifies that a platform admin account exists or inserts one.

If this succeeds, your environment is bound properly and has the necessary starting points for operation.
