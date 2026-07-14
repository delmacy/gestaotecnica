
# Release Readiness Inventory

This document serves as an inventory of current deploy, CI, operations, and release readiness gaps.

## Deployment & Operations (Docs missing/incomplete)
- Deployment procedures (other than Vercel hourly deploy policy)
- Operations runbooks/incident response
- Monitoring/Observability guidelines
- Rollback strategies
- SLA/SLO definitions

## CI
- Test coverage guidelines
- CI gating rules (beyond current basic gates like architecture-check and schema-ci-gate)

## Release
- Release cadence
- Versioning strategy
- Post-deployment verification procedures

## Release Checklist

This checklist is tied to readiness Gates A-F, ensuring deployments meet structural, operational, and semantic requirements.

### Required Gates (Blocking)

- [ ] **Gate A (Architecture & Frontend Parity):**
  - Verify that diagnostic boundaries correctly map internal faults without leaking sensitive data.
  - Confirm UI contracts and static boundaries match current architecture.
- [ ] **Gate D (Persistence & Validation):**
  - Verify all manifest schemas pass static validations without requiring runtime operational state.
  - Ensure boundaries are respected before initiating persistence flows.
- [ ] **Gate E (Operational Traceability & Readiness):**
  - Ensure canonical provenance schemas are fully defined to track decision trails.
  - Verify observability structures are ready to track logs and faults without immediate Drizzle schema migrations.

### Optional Items (Non-Blocking)

- [ ] **Gate B:** Verify internal runtime contracts and event boundaries.
- [ ] **Gate C:** Verify that execution schemas correctly match expected operational states.
- [ ] **Gate F:** Ensure webhooks or governance approvals align with Integration Contracts.

### Vercel Preview & Post-Deployment (Non-Blocking)

- [ ] **Vercel Previews:** Deploy and verify functional UI state in isolated Vercel previews. Previews are non-blocking for core platform validations unless specific UI gates fail.
- [ ] **Post-Deployment:** Monitor log output and verify that diagnostic pipelines map correctly as per Gate A definitions.
