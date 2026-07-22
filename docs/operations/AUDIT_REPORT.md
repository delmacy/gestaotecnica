# Audit Report

This file serves as the audit log for break-glass database operations, specifically destructive tear-downs and emergency procedures executed under the superuser role.

## Example Entry (Do not remove this section, but copy to add new entries)

**Date & Time**: YYYY-MM-DD HH:MM:SS
**Executing Operator**: Operator Name / System
**Approver**: Approver Name (if required)
**Target Environment**: e.g., Staging / Production
**Command Executed**: `npm run db:break-glass:teardown -- --audit-file docs/operations/AUDIT_REPORT.md`
**Dry-Run Evidence**:
```
Mode: DRY RUN (No changes will be made)
Schema 'identity' has 1 tables.
Schema 'workspace' has 2 tables.
...
```
**Justification**: Complete database wipe for environment reset prior to CL-02 launch load tests.

---
