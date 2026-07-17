# PHASE 1 STATE DIAGNOSTIC 001

## Repository State

- **Current main SHA (Base):** `7ed64a15f1d63e0a06c5087d19cb415245fbd8a6`
- **Full Branch Name:** `task-sb-phase-1-state-diagnostic-001-4436330484616443861`

## Issue and PR Status

### Open Issues

- `#291` - current task (Final Clean Retry).
- `#297` - in progress/retry.
- `#298` - final integrator pending.
- `#296` - resolved by merged `#303`.

### Pull Requests

- **Merged:**
  - `#299` - Action Registry smoke validation
  - `#301` - Phase 1 Actions/env/doc/hygiene
  - `#302` - plan master
  - `#303` - build/test gate
- **Closed:**
  - `#300` - duplicate
  - `#304` - contaminated/retry

## GitHub Actions Workflows

Present workflows (`.github/workflows/`):

- `agent-work-governance.yml`
- `agent-work-integration.yml`
- `architecture-check.yml`

## Package Scripts Overview

Key scripts defined in `package.json`:

- **Agent Work:** `agent-work`, `agent-work:dry-run`, `agent-work:db:check`
- **Build/Run:** `dev`, `build`, `start`
- **Code Quality:** `lint`, `check:architecture`
- **Testing:**
  - `test` (runs unit, integration, e2e)
  - `test:unit`, `test:integration`, `test:e2e`
  - `test:agent-work`, `test:agent-work:unit`, `test:agent-work:integration`, `test:agent-work:launch`
  - `test:golden-e2e`
- **Database (`drizzle-kit` and custom scripts):**
  - `db:bootstrap`, `db:validate`, `db:migrate`, `db:generate`, `db:push`, `db:studio`
  - `db:setup:unified-test`, `db:seed:golden-e2e`, `db:seed:golden-e2e:clean`

## Documents Read

- `AGENTS.md`
- `docs/00-current/PLANO_MESTRE_PROXIMAS_FASES.md`
- `docs/00-current/WORK_BOARD.md`
- `docs/GLOBAL_WORK_BOARD.md`
- `.github/workflows/*`
- `package.json`
- `docs/system-builder/validation/*.md`

## Next Reproducible Commands

To properly fetch, validate, and build the environment, run:

```bash
git fetch origin
git status
gh pr list
gh issue list

npm ci
npm run lint
npx tsc --noEmit
npm run check:architecture
npm run build

# Note on Testing Caveats:
# E2E tests require 'npx playwright install'
# Certain Integration/DB tests require DATABASE_URL to be set, e.g.:
# DATABASE_URL="postgres://dummy" npm run test:integration
npm run test:unit
npm run test:integration
npm run test:e2e
```
