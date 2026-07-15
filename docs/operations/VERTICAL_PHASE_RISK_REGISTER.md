# Vertical Phase Risk Register

## Objective
Establish a real baseline and executable gap map before vertical implementation.

## Risks

### 1. CI
- **Risk:** Build or test failures might block progress during the vertical phase implementation.
- **Mitigation:** Rely on GitHub Actions (`npm run build`, tests) as the primary gating mechanism before merges. Maintain a clean `main` branch.

### 2. Vercel Rate Limits
- **Risk:** Vercel hourly deploy policies might block continuous preview validation.
- **Mitigation:** Use local testing and GitHub Actions checks (`build`) for microtasks. Avoid using Vercel previews as merge blockers.

### 3. PR Review
- **Risk:** Bottlenecks in PR review could stall the implementation pipeline.
- **Mitigation:** Delegate review tasks to the Reviewer agent (e.g., Codex Governor) under the GitHub-first contract.

### 4. Duplicate Sessions
- **Risk:** Multiple agents or sessions modifying the same files concurrently could cause conflicts or overwrite changes.
- **Mitigation:** Maintain strict agent boundaries and domain rules.

### 5. GitHub Verification
- **Risk:** Reliance on missing GitHub capabilities in certain agent environments.
- **Mitigation:** Rely on GitHub REST API using `curl` if `gh` CLI is missing.

### 6. Human-decision Blockers
- **Risk:** Awaiting human validation for complex process candidates before proceeding.
- **Mitigation:** Propose changes and clearly mark decisions requiring manual approval as blocked until addressed.

## Governor and Supervisor Rules Readiness
- **Analysis:** Current governor rules (`docs/operations/CODEX_GOVERNOR_BOOTSTRAP_REPORT.md`) mandate high reasoning models for task-elaboration and restrict agent autonomy for final system publication. Supervisor rules (`docs/governance/PERMISSION_MODEL.md` etc) specify that a Supervisor can validate work orders but cannot validate their own execution.
- **Proposal:** No immediate updates to the actual `.py` or capability schema are required before the vertical implementation begins. However, as the phase progresses, we may need to introduce more explicit fallback checks in case human validation is delayed, and specify how the Governor handles blocked Vercel preview environments.
