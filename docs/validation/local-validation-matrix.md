# Local Validation Matrix

This document captures the local/CI validation baseline for the current `main` branch.

## Matrix Summary

| Command | Status | Notes |
|---------|--------|-------|
| `npm run build` | Pass | Next.js build completed successfully. |
| `npx tsc --noEmit` | Pass | Type checking passed. |
| `npm run check:architecture` | Pass | Architecture rules validation passed. |
| `npm run check:no-explicit-any` | Fail | 36 type errors found (mostly explicit `any` usages). |
| `npm run test:unit` | Fail | 1001 tests, 999 pass, 2 fail (infrastructure/git related failures in `agent-work-evidence-recovery.test.ts` and `agent-work-operational-proof.test.ts`). |
| `npm run test:integration` | Fail | Subtests failing due to database/environment (e.g. `agent-gateway-idempotency.integration.test.ts`). |
| `npm run test:e2e` | Fail | 8 failures, mostly due to server not running / connection refused (e.g., `net::ERR_CONNECTION_REFUSED at http://localhost:3000`). |

## Command Logs

### `npm run build`

```
> next build

▲ Next.js 16.2.6 (Turbopack)

  Creating an optimized production build ...
✓ Compiled successfully in 21.7s
  Running TypeScript ...
  Finished TypeScript in 28.6s ...
  Collecting page data using 3 workers ...
  Generating static pages using 3 workers (0/27) ...
✓ Generating static pages using 3 workers (27/27) in 856ms
  Finalizing page optimization ...
```

### `npx tsc --noEmit`
Passed with no output.

### `npm run check:architecture`
```
=== Validação de Arquitetura do System Builder ===

Validando domínios obrigatórios:
✅ [OK] Domínio obrigatório encontrado: src/platform

Validando domínios futuros (geram warnings, não bloqueiam):
⚠️ [AVISO] Domínio futuro pendente: src/core
⚠️ [AVISO] Domínio futuro pendente: src/doc
⚠️ [AVISO] Domínio futuro pendente: src/tasker
⚠️ [AVISO] Domínio futuro pendente: src/governance

==================================================
✅ Validação de arquitetura aprovada!
```

### `npm run check:no-explicit-any`
Failed. Examples of failures:
- `tests/unit/modules/documents/kernel-actions.test.ts,line=16::as any`
- `tests/unit/platform-error-sanitizer.test.ts,line=11::as any`
- `tests/unit/rules-engine.test.ts,line=58::type annotation any`
Total: 36 explicit any violations.

### `npm run test:unit`
Failed.
Summary: 1001 tests, 999 pass, 2 fail.
Failures:
- `tests/unit/agent-work-evidence-recovery.test.ts` (git rev-parse HEAD~1 failing due to shallow clone)
- `tests/unit/agent-work-operational-proof.test.ts` ("Must use test database" error)

### `npm run test:integration`
Failed.
Example failure: `tests/integration/agent-gateway-idempotency.integration.test.ts` (3 subtests failed).

### `npm run test:e2e`
Failed.
Summary: 8 tests failed.
Reason: Playwright tests attempted to navigate to `http://localhost:3000/` without the local server running (`net::ERR_CONNECTION_REFUSED`).

## Blockers / Gaps Identified
1. **Linting (Explicit Any):** Need to resolve 36 `any` usages across the test suite to pass `check:no-explicit-any`.
2. **Unit Tests:** `agent-work-evidence-recovery` test relies on git history that is absent in shallow clones. `agent-work-operational-proof` needs a specific database setup.
3. **Integration Tests:** Rely on local test database which is either unseeded, not running, or incorrectly configured in the environment.
4. **E2E Tests:** Next server must be started (`npm run start` or `npm run dev`) before executing Playwright tests in CI/local, or Playwright configuration needs to handle `webServer` lifecycle.
