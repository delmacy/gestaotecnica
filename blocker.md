# Blocker Report

## Issue

The integration tests under `tests/integration/agent-work-launch.test.ts` require executing `seedWave01` which contains destructive DDL operations on the database. Specifically, `seedWave01` executes:

```typescript
await db.execute(require("drizzle-orm").sql`DELETE FROM agent_work.agent_review_receipts`);
```

This operation fails because the schema `agent_work` and the corresponding table `agent_review_receipts` do not exist in the database, even after running the normal `db:bootstrap` and `db:push` scripts.

The schema definitions and migrations for the `agent_work` module are missing or not properly executed in the automated testing pipeline using the provided `AGENT_WORK_TEST_DATABASE_URL`. It attempts to connect to local or remote postgres databases and fails or finds them without the proper schemas bootstrapped. The tables cannot be queried or mutated since the correct schema isn't fully bootstrapped on the test database instance, and no test database with superuser privileges is accessible.

## Context

Task RD-02-010-seed-closeout states:
"If a real environment/database is unavailable, fail with exact blocker evidence instead of mocking success."

The test failure is directly caused by a missing/inaccessible DB structure.

## Evidence

The execution of `npm run test:agent-work:launch` yields:
```
# Subtest: Agent Work Launch Integration
    # Subtest: should execute full lifecycle for a package
    not ok 1 - should execute full lifecycle for a package
      ---
      duration_ms: 135.066341
      type: 'test'
      location: '/app/tests/integration/agent-work-launch.test.ts:2:1695'
      failureType: 'testCodeFailure'
      error: |-
        Failed query: DELETE FROM agent_work.agent_review_receipts
        params:
```

Because of this blocker, we cannot fully test and close out the real seed gate successfully.
