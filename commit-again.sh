#!/bin/bash
git checkout main
git branch -D task-sb-phase-2-schema-ci-002 || true
git checkout -b task-sb-phase-2-schema-ci-002

git add src/db/index.ts package.json src/agent-work/db.ts src/scripts/db/validate-migrations.ts src/scripts/db/check-table-exists.ts docs/system-builder/validation/PHASE_2_SCHEMA_CI_002_REPORT.md tests/integration/agent-work-launch.test.ts tests/integration/agent-work-operational-proof.test.ts tests/unit/agent-work-operational-proof.test.ts

git commit -m "fix(db): ensure correct exports and DB leak fixes for schema checks and integration testing" -m "This fixes the missing exports causing 'builder.agent_gateway_submissions' to be ignored by Drizzle, verifies tables post-migration explicitly, and correctly terminates postgres.Sql handles to fix integration tests leaking sessions. TASK-SB-PHASE-2-SCHEMA-CI-002"
