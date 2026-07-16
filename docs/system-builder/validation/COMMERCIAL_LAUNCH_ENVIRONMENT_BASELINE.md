# Commercial Launch Alpha: Environment Baseline

This document audits the environments, variables, URLs, and deployment ownership required for the first Commercial Launch Alpha.

**WARNING: NEVER RECORD SECRET VALUES IN THIS DOCUMENT.**

## Environments Inventory

### Local Development

- **Required Variables:**
  - `DATABASE_URL`
  - `PLATFORM_DATABASE_URL` (optional, defaults to DATABASE_URL)
  - `RUNTIME_DATABASE_URL` (optional, defaults to DATABASE_URL)
  - `AGENT_GATEWAY_KEY` (optional for local API bypass)
- **Owner Role:** Developer
- **Source of Truth:** `.env.example`
- **Validation Command:** `npm run dev` and `npm run test`
- **Risk if Missing:** Local environment fails to boot or cannot connect to database.

### Preview Deployments (Vercel)

- **Required Variables:**
  - `DATABASE_URL`
- **Owner Role:** Build Pipeline / CI
- **Source of Truth:** Vercel Environment Configuration
- **Validation Command:** GitHub Actions (`npm run build`)
- **Risk if Missing:** PR deployments fail; QA validation blocked.

### Staging (Not currently present for Alpha)

- **Required Variables:** N/A
- **Owner Role:** N/A
- **Source of Truth:** N/A
- **Validation Command:** N/A
- **Risk if Missing:** None (using production pilot for Alpha validation).

### Production / Demo / Customer-Pilot (Vercel)

- **Required Variables:**
  - `DATABASE_URL`
  - `PLATFORM_DATABASE_URL` (blocked - currently unified)
  - `RUNTIME_DATABASE_URL` (blocked - currently unified)
  - `GESTAOTECNICA_API_KEY` (unknown - required for integration)
  - `AGENT_GATEWAY_KEY` (required for Jules access)
  - `PLATFORM_ADMIN_NAME`
  - `PLATFORM_ADMIN_EMAIL`
  - `PLATFORM_ADMIN_PASSWORD`
- **Owner Role:** Launch Operator
- **Source of Truth:** Vercel Production Environment
- **Validation Command:** `curl` to health endpoint or deployment success checks
- **Risk if Missing:** Production downtime, lack of platform admin access, or agent inability to complete workflows.

## Deployment Ownership & Vercel Limits

- **Deployment Ownership:** Vercel is configured for automatic preview deployments on PRs and production deployments on `main` merge. The Launch Operator holds ultimate responsibility for production stability and rollback decisions.
- **Vercel Rate Limit Risk:**
  - **Risk:** High volume of PRs or automated updates may trigger Vercel hourly deploy rate limits.
  - **Mitigation:** Rely on GitHub Actions CI checks (`npm run build`, `npm run test`) as the primary gate for microtasks. Avoid unnecessary PR churn. If rate limits are hit, pause non-critical merges until limits reset.

## Safety & Secrets

- **Policy:** Never hardcode, commit, or log secret values (passwords, keys, tokens).
- **Enforcement:** Use named variables only (e.g., `DATABASE_URL`) in documentation and code logic. Rely on secure secret managers or provider configuration UIs to inject values at runtime.
