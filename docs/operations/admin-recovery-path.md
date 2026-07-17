# Admin Recovery Path

## Preconditions
- Access to the environment where the platform is deployed.
- Ability to execute scripts within the application context.

## Recovery Procedure
To recover or ensure the platform admin account is active without resetting existing data:
1. Run the admin recovery script which relies on `src/scripts/ensure-platform-admin.ts`.
2. This script uses an `ON CONFLICT DO UPDATE` query against the `users` table to ensure the admin user is active.
3. The script will securely hash the provided password or generate a random one.
4. No data is reset. Existing admin configurations are updated to ensure access.

## Step-by-Step
1. SSH or access the application environment.
2. Execute the recovery script: `sh src/scripts/admin-recover.sh`.
3. The script outputs the credentials or a randomly generated password.
4. Login at `/auth/login` using the displayed credentials.

## Verification
- Confirm you can log in with the new credentials.
- Verify no user data or other configurations were lost or modified outside the targeted admin account.
