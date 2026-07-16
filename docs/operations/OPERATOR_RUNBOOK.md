# Operator Runbook

## Deploy
*Deploy procedures pending operational evidence.*

## Backup and Restore Proof Plan

This section outlines the backup and restore proof plan for verifying operations without executing destructive actions on production environments.

### Commands

#### Backup Command
To initiate a database backup, run the following command (adjust environment variables as needed):
`pg_dump -U $DB_USER -h $DB_HOST -d $DB_NAME -F c -f /path/to/backup/db_backup_$(date +%Y%m%d).dump`

#### Restore Command
To perform a dry-run or verify the restore on a non-production/isolated database, use:
`pg_restore -U $DB_USER -h $DB_HOST -d $TEST_DB_NAME --clean --if-exists /path/to/backup/db_backup_$(date +%Y%m%d).dump`

### Evidence
To verify that the backup and restore were successful:
1. Ensure the backup file exists and has a non-zero size: `ls -lh /path/to/backup/db_backup_*.dump`
2. After restoring to the test database, run a sample query to verify data integrity:
   `psql -U $DB_USER -h $DB_HOST -d $TEST_DB_NAME -c "SELECT COUNT(*) FROM users;"`
3. Compare the row counts or specific records between the source database and the restored test database.

### Rollback
In the event that a restore fails or corrupts the test environment:
1. Drop the affected test database:
   `dropdb -U $DB_USER -h $DB_HOST $TEST_DB_NAME`
2. Recreate the test database from scratch:
   `createdb -U $DB_USER -h $DB_HOST $TEST_DB_NAME`
3. Re-run initial migrations if applicable to ensure a clean state before attempting another restore.

### Risk
- **Data Loss (Mitigated):** By performing the restore on a dedicated test database (`$TEST_DB_NAME`), there is zero risk of data loss to the production database.
- **Resource Constraints:** The backup and restore process may consume significant CPU, memory, and disk I/O. It should be scheduled during low-traffic periods.
- **Credential Exposure:** Ensure that database credentials used in the commands are handled securely (e.g., via environment variables or secret managers) and not hardcoded in scripts.

## Incident
*Incident response procedures pending operational evidence.*

## Support Lookup
*Support lookup procedures pending operational evidence.*

## Support Ownership and Escalation Path

### Roles
- **L1 Support (Tier 1):** First responders for alerts, user queries, and initial triage. Responsible for verifying the issue and performing basic mitigation.
- **L2 Operations (Tier 2):** Infrastructure and advanced platform support. Responsible for resolving complex operational issues, database interventions, and configuration changes.
- **L3 Engineering (Tier 3):** Core development team. Responsible for code-level bug fixes, architectural escalations, and critical system failures.

### Escalation Path
1. **Initial Report:** Alerts or user reports are routed to L1 Support.
2. **L1 Triage:** L1 investigates. If the issue cannot be resolved within 15 minutes, or if it involves a critical system failure, it is escalated to L2 Operations.
3. **L2 Intervention:** L2 Operations investigates infrastructure and database logs. If the issue requires a code patch or deep system debugging, it is escalated to L3 Engineering.
4. **L3 Resolution:** L3 Engineering provides a hotfix or architectural guidance.

### Launch Roles
- **Release Manager:** Approves the final deployment to production, ensuring all gates (Architecture, Persistence, Operational) are met.
- **Deployment Engineer:** Executes the deployment, monitors Vercel previews, and verifies post-deployment logs.
- **QA Lead:** Validates post-deployment readiness and confirms the system is operational.
