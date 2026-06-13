# PREFLIGHT: AGENT-FACTORY-CORE-COMPLETION-001

## Requirement 1: Database Isolated Connection
- **Requirement:** Agent Work module uses a completely isolated database connection, configuration, and migrations from the rest of the application.
- **Current State:** Contains fallbacks to `tec_db`, `PLATFORM_DATABASE_URL`, `RUNTIME_DATABASE_URL` in config and some places. `db.ts` exposes singleton `agentWorkDb`.
- **Evidence:** `drizzle.agent-work.config.ts`, `src/agent-work/db.ts`
- **Classification:** partial
- **Repair:** Remove fallbacks. Expose `createAgentWorkDb`, `getAgentWorkDb`, `closeAgentWorkDb`, `withAgentWorkDb`. Fix imports.
- **Verification Command:** `grep -r "agentWorkDb" src/agent-work/`

## Requirement 2: Strict Migration Commands
- **Requirement:** Agent Work module has its own `db:generate`, `db:migrate`, `db:check`, `db:seed`, `db:reset:test` commands.
- **Current State:** Missing proper strict check and reset. `db:check` must validate actual schema, journal, tables, not just `SELECT 1`.
- **Evidence:** `package.json`
- **Classification:** missing
- **Repair:** Implement these commands in `src/agent-work/cli/index.ts` or related files.
- **Verification Command:** `npm run agent-work:db:check`

## Requirement 3: Canonical Package Statuses
- **Requirement:** Shared canonical statuses across `domain/types.ts`, `validation/schemas.ts`, services, CLI, tests. Proper transition function.
- **Current State:** Ad-hoc statuses, missing atomic transitions.
- **Evidence:** `src/agent-work/domain/types.ts`, `src/agent-work/validation/schemas.ts`
- **Classification:** missing
- **Repair:** Define canonical list. Implement `transitionPackageStatus`.
- **Verification Command:** `grep -r "planned_blocked" src/agent-work/`

## Requirement 4: Claims, Leases, and Collisions
- **Requirement:** Robust collision matrix and claims system using transactions and FOR UPDATE. Secure claim tokens. Hearbeat, renew, release.
- **Current State:** Basic or missing implementation.
- **Evidence:** `src/agent-work/services/`
- **Classification:** partial
- **Repair:** Implement real collision logic, secure claim token, heartbeat, stale reap.
- **Verification Command:** `npm run agent-work:db:check`

## Requirement 5: Canonical Seed for Wave 01
- **Requirement:** A unified canonical seed for Wave 01 using `--base-sha`, creating real roles, workers, and packages with strict rules.
- **Current State:** Multiple divergent seed files.
- **Evidence:** `src/agent-work/seeds/`
- **Classification:** broken
- **Repair:** Create `src/agent-work/seeds/wave-01.ts` and ensure it runs via CLI.
- **Verification Command:** `npm run agent-work -- seed:wave-01 --base-sha $(git rev-parse origin/main)`

## Requirement 6: Minimal Functional CLI
- **Requirement:** CLI implements standard operational commands (db:check, seed, worker/wave/package management, claim, etc.) and returns correct exit codes.
- **Current State:** CLI has missing commands or placeholders, might not return non-zero on error.
- **Evidence:** `src/agent-work/cli/index.ts`
- **Classification:** partial
- **Repair:** Implement commands, add `--format` and `--dry-run` where applicable, ensure non-zero exit on error.
- **Verification Command:** `npm run agent-work -- core:verify --wave WAVE-01-FOUNDATION`

## Requirement 7: Task Kit
- **Requirement:** Operational Task Kit generation relying strictly on the active database claim and accurate worker assignment.
- **Current State:** Unclear or missing `agent-work:task-kit` logic aligned with isolated db.
- **Evidence:** `src/agent-work/services/task-kit.ts`
- **Classification:** partial
- **Repair:** Update `src/agent-work/services/task-kit.ts` to query db properly, format correctly.
- **Verification Command:** `npm run agent-work -- task-kit --preview`

## Requirement 8: Tests and CI
- **Requirement:** Unit tests for logic. Integration tests using `AGENT_WORK_TEST_DATABASE_URL` testing db operations, real concurrency (`Promise.all`), CI execution.
- **Current State:** Some tests might use wrong db or lack real concurrency. CI doesn't strictly verify core evidence.
- **Evidence:** `tests/integration/agent-work-*.test.ts`, `.github/workflows/`
- **Classification:** partial
- **Repair:** Write comprehensive unit and integration tests. Update CI.
- **Verification Command:** `npm run test:agent-work`
