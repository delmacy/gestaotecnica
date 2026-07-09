# System Builder - Autonomous Backlog of 160 Microtasks

This document is the fallback planning artifact for the System Builder delivery line when Codex supervision is scarce.

It is intentionally repository-native and deterministic. A future coordinator can copy one sprint at a time into the Jules/OpenCode supervisor queue without re-planning the product.

## Operating Contract

- Scope: System Builder platform only.
- Excluded: Gestao Tecnica client implementation. Gestao Tecnica remains a future client project and must not be implemented as a platform extension in this backlog.
- Sprint size: 10 Jules microtasks.
- Execution order: keep the interleaved lane sequence unless a corrective sprint is required.
- PR rule: one task, one Jules branch, one PR.
- Review rule: OpenCode reviews and tests; Codex or fallback governor handles exceptions and sprint release.
- Validation baseline: every PR must run `npm run build` unless the task is explicitly docs-only. Focused tests are listed per task.
- Vercel rule: Vercel preview checks are useful but not blocking when free-plan rate limits are the only failure. The PR must still prove local/GitHub build success.
- DB rule: no schema or migration changes unless the task explicitly allows `drizzle/**` or schema files.
- Files outside `Allowed files` are forbidden unless the task stops and asks for a corrective task.

## Status Labels

Use these statuses when materializing tasks:

- `planned_gated`: planned but not executable yet.
- `ready`: executable by Jules.
- `jules_running`: active Jules session.
- `pr_open`: Jules opened a PR; waiting for review/test.
- `approved_waiting_merge`: review passed; waiting merge.
- `merged`: merged to `main`.
- `needs_codex`: exception, unclear question, scope issue, or human decision.
- `cancelled`: intentionally dropped.

## Sprint Sequence

These 16 sprints add 160 tasks beyond the already materialized early line. Start here after the current queue finishes or when the governor needs a new tail sprint.

| Order | Sprint | Lane | Theme |
|---:|---|---|---|
| 1 | MOD-02 | Modules | Module manifest validation |
| 2 | UI-02 | UI | Builder shell navigation hardening |
| 3 | CORE-02 | Core | Draft persistence boundary |
| 4 | OPS-02 | Operations | Audit and approval provenance |
| 5 | INT-02 | Integrations | Connector execution boundary |
| 6 | RT-03 | Runtime | Runtime observability contract |
| 7 | MOD-03 | Modules | Blueprint packaging contracts |
| 8 | UI-03 | UI | View Builder design-only MVP |
| 9 | CORE-03 | Core | Definition compatibility checks |
| 10 | OPS-03 | Operations | Release candidate readiness |
| 11 | INT-03 | Integrations | Import/export blueprint channel |
| 12 | RT-04 | Runtime | Runtime failure semantics |
| 13 | MOD-04 | Modules | Capability dependency graph |
| 14 | UI-04 | UI | Form Builder persistence preparation |
| 15 | CORE-04 | Core | Publication validation pipeline |
| 16 | OPS-04 | Operations | Support diagnostics foundation |

## MOD-02 - Module Manifest Validation

Goal: harden manifest schema, versioning, and compatibility checks without installing real modules yet.

### MOD-02-001 manifest-schema-inventory

- Objective: inventory existing manifest types and tests, then add a short doc section naming the canonical manifest entry points.
- Allowed files: `docs/product-roadmap/`, `src/features/**/capabilit*/**`, `tests/**/capabilit*/**`.
- Forbidden files: `drizzle/**`, migrations, runtime services, UI routes.
- Acceptance: canonical manifest source is documented with no behavior change.
- Validation: `npm run build`.

### MOD-02-002 manifest-version-type

- Objective: add or tighten a public manifest version type that avoids `any` and supports semantic compatibility checks later.
- Allowed files: capability registry type files and focused unit tests.
- Forbidden files: database schema, module install services, UI.
- Acceptance: manifest version is represented by an explicit exported type.
- Validation: focused unit test if present, then `npm run build`.

### MOD-02-003 manifest-required-fields-validation

- Objective: add validation for required manifest fields such as id, name, version, capabilities, and lifecycle metadata.
- Allowed files: manifest validation files and focused tests.
- Forbidden files: install/activate code, migrations, UI.
- Acceptance: missing required fields fail with stable error codes/messages.
- Validation: focused manifest validation test, then `npm run build`.

### MOD-02-004 manifest-compatible-version-test

- Objective: add tests for compatible and incompatible manifest versions without changing install behavior.
- Allowed files: manifest compatibility helper/tests.
- Forbidden files: module installation, DB, UI.
- Acceptance: tests cover equal, patch-compatible, and incompatible major version cases.
- Validation: focused compatibility test, then `npm run build`.

### MOD-02-005 manifest-capability-reference-validation

- Objective: validate that manifest capability references use stable IDs and reject empty or malformed references.
- Allowed files: manifest validation files and tests.
- Forbidden files: lifecycle executor, registry persistence, UI.
- Acceptance: malformed references are rejected deterministically.
- Validation: focused manifest validation test, then `npm run build`.

### MOD-02-006 manifest-error-envelope

- Objective: introduce a small typed validation result envelope for manifest validation.
- Allowed files: manifest validation/type files and tests.
- Forbidden files: service orchestration, DB, UI.
- Acceptance: validation returns typed success/failure with code, message, and path.
- Validation: focused validation test, then `npm run build`.

### MOD-02-007 manifest-fixture-library

- Objective: create minimal valid and invalid manifest fixtures for later module lifecycle sprints.
- Allowed files: `tests/**/fixtures/**`, manifest tests.
- Forbidden files: production DB, UI, runtime.
- Acceptance: fixtures are reused by at least one focused test.
- Validation: focused test, then `npm run build`.

### MOD-02-008 manifest-no-any-sweep

- Objective: remove public `any` usage from manifest validation/type surfaces touched by this sprint.
- Allowed files: manifest type/validation files.
- Forbidden files: broad repo no-any cleanup, unrelated tests.
- Acceptance: touched manifest public APIs do not expose `any`.
- Validation: `npm run build`.

### MOD-02-009 manifest-docs-contract

- Objective: document the manifest contract, required fields, validation envelope, and current non-goals.
- Allowed files: `docs/product-roadmap/`, capability/module docs.
- Forbidden files: code outside docs.
- Acceptance: docs link the manifest contract to Gate D without claiming install readiness.
- Validation: `git diff --check`.

### MOD-02-010 manifest-index-export

- Objective: export the stable manifest validation/type entry points from the appropriate module index.
- Allowed files: capability/module index files and focused tests.
- Forbidden files: DB, UI, runtime.
- Acceptance: downstream code can import manifest types/helpers from a stable index.
- Validation: focused import/build test if available, then `npm run build`.

## UI-02 - Builder Shell Navigation Hardening

Goal: make Builder navigation states, empty states, and active section behavior reliable without backend coupling.

### UI-02-001 builder-shell-route-inventory

- Objective: document current Builder shell routes, navigation components, and known missing states.
- Allowed files: `docs/product-roadmap/`, `src/app/**/builder/**`, `src/components/**/builder/**`.
- Forbidden files: DB, runtime, auth changes.
- Acceptance: route inventory exists and does not claim persistence readiness.
- Validation: `npm run build`.

### UI-02-002 builder-active-section-helper

- Objective: add or tighten a pure helper that maps current pathname to active Builder section.
- Allowed files: Builder navigation helper files and unit tests.
- Forbidden files: route rewrites, persistence, auth.
- Acceptance: helper covers root, known section, unknown section, and nested path.
- Validation: focused helper test, then `npm run build`.

### UI-02-003 builder-empty-state-component

- Objective: add a reusable Builder empty state component for no selection/no draft/no result states.
- Allowed files: Builder shell/components and focused tests if present.
- Forbidden files: backend calls, DB, broad design system changes.
- Acceptance: component is accessible, compact, and does not use marketing hero layout.
- Validation: `npm run build`.

### UI-02-004 builder-nav-aria-current

- Objective: ensure active Builder nav item exposes correct `aria-current` or equivalent accessibility state.
- Allowed files: Builder nav components and focused tests.
- Forbidden files: router architecture changes.
- Acceptance: active item is programmatically distinguishable.
- Validation: focused component test if present, then `npm run build`.

### UI-02-005 builder-unknown-section-fallback

- Objective: add a safe fallback for unknown Builder sections without redirect loops.
- Allowed files: Builder route/page components.
- Forbidden files: middleware, auth, DB.
- Acceptance: unknown section renders stable fallback or not-found behavior.
- Validation: `npm run build`.

### UI-02-006 builder-navigation-fixtures

- Objective: add navigation fixtures for known Builder sections used by tests and docs.
- Allowed files: Builder fixtures/constants/tests.
- Forbidden files: persisted config, DB.
- Acceptance: fixtures list section id, label, href, and status.
- Validation: focused test, then `npm run build`.

### UI-02-007 builder-mobile-nav-smoke

- Objective: add a lightweight smoke test or static assertion for mobile navigation layout data.
- Allowed files: Builder nav tests and fixtures.
- Forbidden files: broad CSS rewrite, E2E infrastructure changes.
- Acceptance: mobile nav data can render without missing labels/hrefs.
- Validation: focused test, then `npm run build`.

### UI-02-008 builder-breadcrumb-contract

- Objective: define a typed breadcrumb contract for Builder pages and apply it to one existing page.
- Allowed files: Builder shell/page components and tests.
- Forbidden files: persistence, runtime, global router changes.
- Acceptance: breadcrumb items are typed and stable.
- Validation: `npm run build`.

### UI-02-009 builder-shell-docs

- Objective: document current Builder shell behavior, non-goals, and next persistence handoff.
- Allowed files: `docs/product-roadmap/`, Builder docs.
- Forbidden files: production code.
- Acceptance: docs clearly separate shell readiness from persisted Builder readiness.
- Validation: `git diff --check`.

### UI-02-010 builder-shell-build-polish

- Objective: fix any type/build issues left by UI-02 and export stable shell helpers.
- Allowed files: Builder shell files touched in UI-02.
- Forbidden files: unrelated UI refactors.
- Acceptance: `npm run build` passes.
- Validation: `npm run build`.

## CORE-02 - Draft Persistence Boundary

Goal: establish save/load draft contracts before real Builder publication.

### CORE-02-001 draft-contract-inventory

- Objective: identify current draft-like types/actions and document the canonical draft boundary.
- Allowed files: workflow/builder draft docs, relevant type files.
- Forbidden files: migrations, production repository changes.
- Acceptance: one canonical draft boundary is named.
- Validation: `npm run build`.

### CORE-02-002 draft-id-type

- Objective: define explicit draft identifiers and ownership fields without changing storage.
- Allowed files: draft type files and tests.
- Forbidden files: DB schema, UI.
- Acceptance: draft id and owner/workspace fields are typed.
- Validation: focused type/unit test if present, then `npm run build`.

### CORE-02-003 draft-save-envelope

- Objective: create a typed save result envelope for draft saves.
- Allowed files: draft action/type/validation files and tests.
- Forbidden files: DB writes, UI.
- Acceptance: envelope supports success, validation failure, and conflict failure.
- Validation: focused test, then `npm run build`.

### CORE-02-004 draft-load-envelope

- Objective: create a typed load result envelope for draft loads.
- Allowed files: draft type/validation files and tests.
- Forbidden files: DB writes, UI.
- Acceptance: envelope supports found, not found, forbidden, and invalid states.
- Validation: focused test, then `npm run build`.

### CORE-02-005 draft-validation-schema

- Objective: add validation for draft metadata and payload using `unknown` rather than `any`.
- Allowed files: draft validation files and tests.
- Forbidden files: broad zod cleanup, migrations.
- Acceptance: invalid payloads fail with stable validation output.
- Validation: focused test, then `npm run build`.

### CORE-02-006 draft-conflict-contract

- Objective: define optimistic conflict metadata such as revision, updatedAt, or version token.
- Allowed files: draft type docs/tests.
- Forbidden files: implementing real conflict persistence.
- Acceptance: conflict metadata is typed and documented.
- Validation: `npm run build`.

### CORE-02-007 draft-delete-rollback-rule

- Objective: define typed delete/rollback intent for drafts without implementing DB delete.
- Allowed files: draft type/docs/tests.
- Forbidden files: DB delete behavior, UI.
- Acceptance: delete/rollback contract is explicit and non-destructive.
- Validation: focused test if present, then `npm run build`.

### CORE-02-008 draft-fixtures

- Objective: add valid and invalid draft fixtures for publication and UI tests.
- Allowed files: `tests/**/fixtures/**`, draft tests.
- Forbidden files: production data, migrations.
- Acceptance: fixtures cover minimal and invalid draft payload.
- Validation: focused test, then `npm run build`.

### CORE-02-009 draft-docs-boundary

- Objective: document save/load/conflict/delete draft boundaries and what remains unimplemented.
- Allowed files: `docs/product-roadmap/`, draft docs.
- Forbidden files: code.
- Acceptance: docs do not claim persisted draft support until repository tasks exist.
- Validation: `git diff --check`.

### CORE-02-010 draft-index-export

- Objective: export stable draft boundary types/helpers from the workflow/builder index.
- Allowed files: index/type files and focused import test.
- Forbidden files: DB, UI.
- Acceptance: import path is stable for later UI and persistence sprints.
- Validation: `npm run build`.

## OPS-02 - Audit and Approval Provenance

Goal: make approval and audit receipts enforceable and testable as contracts.

### OPS-02-001 audit-provenance-inventory

- Objective: inventory audit/approval concepts and choose the canonical provenance contract.
- Allowed files: audit/governance docs and type files.
- Forbidden files: auth rewrite, DB migrations.
- Acceptance: canonical fields are listed.
- Validation: `npm run build`.

### OPS-02-002 approval-actor-type

- Objective: add explicit actor type for approval provenance.
- Allowed files: governance/audit type files and tests.
- Forbidden files: user auth implementation, DB.
- Acceptance: actor supports user, agent, system, and external source when applicable.
- Validation: focused test, then `npm run build`.

### OPS-02-003 approval-decision-envelope

- Objective: add typed approval decision envelope with approve, reject, request_changes, and cancel.
- Allowed files: governance approval type/validation files.
- Forbidden files: workflow execution changes.
- Acceptance: envelope includes decision, actor, timestamp, target, reason.
- Validation: focused test, then `npm run build`.

### OPS-02-004 audit-receipt-type

- Objective: define audit receipt type with event id, correlation id, actor, target, and redaction class.
- Allowed files: audit type files and tests.
- Forbidden files: event store implementation.
- Acceptance: receipt is append-only by contract and typed.
- Validation: focused test, then `npm run build`.

### OPS-02-005 audit-redaction-class-validation

- Objective: validate allowed redaction classes for audit receipt payloads.
- Allowed files: audit validation/tests.
- Forbidden files: logging runtime changes.
- Acceptance: unknown redaction classes fail deterministically.
- Validation: focused test, then `npm run build`.

### OPS-02-006 approval-provenance-fixtures

- Objective: create valid and invalid approval provenance fixtures.
- Allowed files: governance/audit fixtures and tests.
- Forbidden files: production data.
- Acceptance: fixtures are used by focused tests.
- Validation: focused test, then `npm run build`.

### OPS-02-007 audit-no-secret-static-test

- Objective: add a static test that audit docs/fixtures do not include obvious secret placeholders.
- Allowed files: audit tests/docs.
- Forbidden files: global secret scanner changes.
- Acceptance: test rejects common secret keys in audit fixtures.
- Validation: focused test, then `npm run build`.

### OPS-02-008 approval-state-transition-test

- Objective: test allowed approval state transitions without implementing a full policy engine.
- Allowed files: approval helper/tests.
- Forbidden files: workflow execution, DB.
- Acceptance: invalid transition fails with stable code.
- Validation: focused test, then `npm run build`.

### OPS-02-009 audit-approval-docs

- Objective: document audit and approval provenance contracts and non-goals.
- Allowed files: `docs/product-roadmap/`, governance docs.
- Forbidden files: code.
- Acceptance: docs link contracts to Gate E readiness.
- Validation: `git diff --check`.

### OPS-02-010 audit-approval-index-export

- Objective: export stable audit/approval contract types from an appropriate index.
- Allowed files: governance/audit index files.
- Forbidden files: DB, auth, UI.
- Acceptance: stable imports work in build.
- Validation: `npm run build`.

## INT-02 - Connector Execution Boundary

Goal: add retry/error/result contracts for external connector calls without implementing real connectors.

### INT-02-001 connector-boundary-inventory

- Objective: inventory integration/connector docs and existing code to identify the canonical connector boundary.
- Allowed files: integration docs/type files.
- Forbidden files: external network behavior, secrets, DB.
- Acceptance: one boundary is named and linked to Gate E.
- Validation: `npm run build`.

### INT-02-002 connector-request-type

- Objective: define connector request type with destination, method/action, idempotency key, payload, and timeout.
- Allowed files: connector type/tests.
- Forbidden files: real HTTP client implementation.
- Acceptance: request payload uses `unknown` at public boundary.
- Validation: focused test, then `npm run build`.

### INT-02-003 connector-result-envelope

- Objective: define connector result envelope with success, retryable failure, permanent failure, and cancelled.
- Allowed files: connector type/validation/tests.
- Forbidden files: real connector execution.
- Acceptance: result envelope has stable status and error code fields.
- Validation: focused test, then `npm run build`.

### INT-02-004 connector-retry-policy-type

- Objective: define retry policy type with max attempts, backoff, and retryable error classes.
- Allowed files: connector type/tests.
- Forbidden files: scheduler/runtime changes.
- Acceptance: invalid retry policy fails validation.
- Validation: focused test, then `npm run build`.

### INT-02-005 connector-timeout-validation

- Objective: validate connector timeout range and default behavior.
- Allowed files: connector validation/tests.
- Forbidden files: runtime execution.
- Acceptance: timeout has deterministic min/max validation.
- Validation: focused test, then `npm run build`.

### INT-02-006 connector-redaction-contract

- Objective: add redaction metadata for connector requests/results.
- Allowed files: connector type/validation/tests.
- Forbidden files: logging implementation.
- Acceptance: sensitive fields can be marked without leaking payload.
- Validation: focused test, then `npm run build`.

### INT-02-007 connector-fixtures

- Objective: add valid and invalid connector execution fixtures.
- Allowed files: connector fixtures/tests.
- Forbidden files: external API calls.
- Acceptance: fixtures cover success, retryable, and permanent failure.
- Validation: focused test, then `npm run build`.

### INT-02-008 connector-idempotency-test

- Objective: test connector request idempotency key validation.
- Allowed files: connector validation/tests.
- Forbidden files: event store or DB idempotency implementation.
- Acceptance: missing or malformed keys fail where required.
- Validation: focused test, then `npm run build`.

### INT-02-009 connector-docs-contract

- Objective: document connector execution boundary, retry semantics, redaction, and non-goals.
- Allowed files: `docs/product-roadmap/`, integration docs.
- Forbidden files: code.
- Acceptance: docs state no real connector is implemented yet.
- Validation: `git diff --check`.

### INT-02-010 connector-index-export

- Objective: export stable connector boundary types/helpers.
- Allowed files: integration index/type files.
- Forbidden files: runtime execution, DB, UI.
- Acceptance: imports build.
- Validation: `npm run build`.

## RT-03 - Runtime Observability Contract

Goal: add support diagnostics, error surfaces, and evidence tests.

### RT-03-001 runtime-observability-inventory

- Objective: inventory runtime error/log/event surfaces and choose canonical observability contract.
- Allowed files: runtime docs/type files.
- Forbidden files: DB schema, logging infra rewrite.
- Acceptance: contract entry points are documented.
- Validation: `npm run build`.

### RT-03-002 runtime-error-code-type

- Objective: define stable runtime error codes for process start, step execution, action execution, and event append.
- Allowed files: runtime type/tests.
- Forbidden files: service behavior changes.
- Acceptance: codes are exported and tested.
- Validation: focused test, then `npm run build`.

### RT-03-003 runtime-diagnostic-envelope

- Objective: define support-safe diagnostic envelope with correlation id, process id, action id, and redaction class.
- Allowed files: runtime type/validation/tests.
- Forbidden files: DB/log transport.
- Acceptance: envelope excludes raw sensitive payload by default.
- Validation: focused test, then `npm run build`.

### RT-03-004 runtime-correlation-id-validation

- Objective: validate runtime correlation id shape and fallback behavior.
- Allowed files: runtime validation/tests.
- Forbidden files: request middleware.
- Acceptance: invalid correlation id produces stable validation failure.
- Validation: focused test, then `npm run build`.

### RT-03-005 runtime-error-mapper

- Objective: create pure mapper from internal runtime errors to public diagnostic envelope.
- Allowed files: runtime mapper/tests.
- Forbidden files: DB/service query changes.
- Acceptance: mapper covers known and unknown errors.
- Validation: focused test, then `npm run build`.

### RT-03-006 runtime-observability-fixtures

- Objective: add runtime diagnostic fixtures for success and failure cases.
- Allowed files: runtime fixtures/tests.
- Forbidden files: production event writes.
- Acceptance: fixtures are reused by tests.
- Validation: focused test, then `npm run build`.

### RT-03-007 runtime-no-payload-leak-test

- Objective: add test that diagnostic output does not expose raw payload fields by default.
- Allowed files: runtime tests/mapper.
- Forbidden files: unrelated redaction changes.
- Acceptance: sensitive fixture payload does not appear in diagnostic output.
- Validation: focused test, then `npm run build`.

### RT-03-008 runtime-support-lookup-contract

- Objective: define typed support lookup query contract for runtime diagnostics without implementing endpoint.
- Allowed files: runtime type/docs/tests.
- Forbidden files: API routes, DB queries.
- Acceptance: query includes tenant/workspace boundary fields.
- Validation: focused test, then `npm run build`.

### RT-03-009 runtime-observability-docs

- Objective: document runtime diagnostic contract and support non-goals.
- Allowed files: runtime docs and product roadmap docs.
- Forbidden files: code.
- Acceptance: docs link RT-03 to Gate A/E.
- Validation: `git diff --check`.

### RT-03-010 runtime-observability-index-export

- Objective: export stable runtime diagnostic/error types and helpers.
- Allowed files: runtime index files.
- Forbidden files: DB, UI.
- Acceptance: imports build.
- Validation: `npm run build`.

## MOD-03 - Blueprint Packaging Contracts

Goal: prepare reusable module packages for export/import without building full import execution.

### MOD-03-001 blueprint-package-inventory

- Objective: inventory current blueprint/module package concepts and document canonical package boundary.
- Allowed files: blueprint/module docs/type files.
- Forbidden files: real import/export execution.
- Acceptance: one package boundary is named.
- Validation: `npm run build`.

### MOD-03-002 blueprint-package-manifest-type

- Objective: define package manifest type with package id, version, capabilities, forms, views, workflows, policies, and seed metadata.
- Allowed files: blueprint/module type/tests.
- Forbidden files: DB, UI.
- Acceptance: package manifest uses explicit typed sections.
- Validation: focused test, then `npm run build`.

### MOD-03-003 blueprint-package-validation

- Objective: validate required package manifest sections.
- Allowed files: blueprint validation/tests.
- Forbidden files: real import/export behavior.
- Acceptance: missing required section fails with stable code.
- Validation: focused test, then `npm run build`.

### MOD-03-004 blueprint-package-dependency-list

- Objective: define dependency list type for packages and validate malformed dependencies.
- Allowed files: blueprint type/validation/tests.
- Forbidden files: dependency resolver implementation.
- Acceptance: dependency references are typed and validated.
- Validation: focused test, then `npm run build`.

### MOD-03-005 blueprint-package-fixtures

- Objective: add minimal valid and invalid package fixtures.
- Allowed files: blueprint fixtures/tests.
- Forbidden files: production seed data.
- Acceptance: fixtures cover valid, missing section, incompatible version.
- Validation: focused test, then `npm run build`.

### MOD-03-006 blueprint-package-redaction-rule

- Objective: add contract stating exported packages must not include secrets or runtime customer data.
- Allowed files: blueprint validation/docs/tests.
- Forbidden files: global secret scanning infra.
- Acceptance: fixture/test catches obvious secret-like fields.
- Validation: focused test, then `npm run build`.

### MOD-03-007 blueprint-package-compatibility-envelope

- Objective: define compatibility check result envelope for package install preflight.
- Allowed files: blueprint type/tests.
- Forbidden files: real install behavior.
- Acceptance: envelope includes compatible, warnings, blockers.
- Validation: focused test, then `npm run build`.

### MOD-03-008 blueprint-package-docs

- Objective: document blueprint package contents, compatibility, redaction, and non-goals.
- Allowed files: product roadmap/module docs.
- Forbidden files: code.
- Acceptance: docs make clear import execution is future work.
- Validation: `git diff --check`.

### MOD-03-009 blueprint-package-index-export

- Objective: export package manifest and compatibility types from stable index.
- Allowed files: module/blueprint index files.
- Forbidden files: DB, UI.
- Acceptance: imports build.
- Validation: `npm run build`.

### MOD-03-010 blueprint-package-build-polish

- Objective: fix build/type issues from MOD-03 without broad refactor.
- Allowed files: files touched by MOD-03.
- Forbidden files: unrelated modules.
- Acceptance: `npm run build` passes.
- Validation: `npm run build`.

## UI-03 - View Builder Design-Only MVP

Goal: implement a safe mock/static View Builder surface without backend coupling.

### UI-03-001 view-builder-route-inventory

- Objective: inventory View Builder routes/components and document MVP surface.
- Allowed files: View Builder docs/components/routes.
- Forbidden files: DB, runtime, real persistence.
- Acceptance: MVP route/surface is identified.
- Validation: `npm run build`.

### UI-03-002 view-builder-static-model-type

- Objective: define static view model type for design-only preview.
- Allowed files: View Builder type/tests.
- Forbidden files: data binding, DB.
- Acceptance: model includes fields, layout, sample rows, and display metadata.
- Validation: focused test, then `npm run build`.

### UI-03-003 view-builder-sample-fixtures

- Objective: add safe sample fixtures for list/detail/table preview.
- Allowed files: View Builder fixtures/tests.
- Forbidden files: production data or customer data.
- Acceptance: fixtures use synthetic data only.
- Validation: focused test, then `npm run build`.

### UI-03-004 view-builder-preview-component

- Objective: add a compact read-only preview component for one view type.
- Allowed files: View Builder components/tests.
- Forbidden files: backend calls, broad design system changes.
- Acceptance: component renders from static model and handles empty rows.
- Validation: `npm run build`.

### UI-03-005 view-builder-field-label-guard

- Objective: add guard/helper to prevent missing field labels in preview.
- Allowed files: View Builder helper/tests.
- Forbidden files: form builder changes.
- Acceptance: missing labels fall back deterministically.
- Validation: focused test, then `npm run build`.

### UI-03-006 view-builder-invalid-model-state

- Objective: render a safe invalid-model state rather than crashing.
- Allowed files: View Builder components/helpers/tests.
- Forbidden files: error boundary architecture changes.
- Acceptance: invalid model produces readable fallback.
- Validation: focused test if present, then `npm run build`.

### UI-03-007 view-builder-a11y-static-test

- Objective: add focused accessibility/static test for headings, labels, and empty state text.
- Allowed files: View Builder tests/components.
- Forbidden files: E2E infra.
- Acceptance: core preview markup exposes accessible labels.
- Validation: focused test, then `npm run build`.

### UI-03-008 view-builder-docs

- Objective: document design-only scope and future persistence handoff.
- Allowed files: docs/product-roadmap and View Builder docs.
- Forbidden files: code.
- Acceptance: docs do not claim real data binding or publication.
- Validation: `git diff --check`.

### UI-03-009 view-builder-index-export

- Objective: export stable static model and preview helpers.
- Allowed files: View Builder index/type files.
- Forbidden files: DB, runtime.
- Acceptance: imports build.
- Validation: `npm run build`.

### UI-03-010 view-builder-build-polish

- Objective: fix build/type issues from UI-03 only.
- Allowed files: files touched by UI-03.
- Forbidden files: unrelated UI.
- Acceptance: `npm run build` passes.
- Validation: `npm run build`.

## CORE-03 - Definition Compatibility Checks

Goal: validate version compatibility and runtime execution readiness.

### CORE-03-001 definition-compatibility-inventory

- Objective: inventory workflow definition version fields and compatibility checks.
- Allowed files: workflow definition docs/type/tests.
- Forbidden files: runtime execution behavior, DB.
- Acceptance: canonical compatibility inputs are documented.
- Validation: `npm run build`.

### CORE-03-002 definition-version-type

- Objective: define explicit workflow definition version type.
- Allowed files: workflow definition type/tests.
- Forbidden files: persistence schema.
- Acceptance: type supports major/minor/patch or equivalent stable version representation.
- Validation: focused test, then `npm run build`.

### CORE-03-003 definition-compatibility-result

- Objective: define compatibility result envelope with compatible, warnings, blockers.
- Allowed files: workflow definition type/tests.
- Forbidden files: publication service behavior.
- Acceptance: result is typed and documented in tests.
- Validation: focused test, then `npm run build`.

### CORE-03-004 definition-breaking-change-fixtures

- Objective: add fixtures for compatible and breaking workflow definition changes.
- Allowed files: workflow definition fixtures/tests.
- Forbidden files: production definitions.
- Acceptance: fixtures cover removed node, changed action, changed payload.
- Validation: focused test, then `npm run build`.

### CORE-03-005 definition-compatibility-helper

- Objective: implement pure helper for basic compatibility comparison.
- Allowed files: workflow definition helper/tests.
- Forbidden files: DB, runtime execution.
- Acceptance: helper returns blocker for known breaking fixtures.
- Validation: focused test, then `npm run build`.

### CORE-03-006 definition-runtime-readiness-contract

- Objective: define runtime readiness contract for a published workflow definition.
- Allowed files: workflow definition type/docs/tests.
- Forbidden files: runtime service changes.
- Acceptance: readiness result includes missing actions, invalid nodes, and version blockers.
- Validation: focused test, then `npm run build`.

### CORE-03-007 definition-compatibility-docs

- Objective: document compatibility policy and non-goals.
- Allowed files: docs/product-roadmap and workflow docs.
- Forbidden files: code.
- Acceptance: docs explain when a new version is breaking.
- Validation: `git diff --check`.

### CORE-03-008 definition-compatibility-index-export

- Objective: export compatibility types/helpers from stable workflow index.
- Allowed files: workflow index/type files.
- Forbidden files: UI, DB.
- Acceptance: imports build.
- Validation: `npm run build`.

### CORE-03-009 definition-compatibility-static-sweep

- Objective: add a focused static test ensuring compatibility fixtures stay under approved folder.
- Allowed files: workflow definition tests/fixtures.
- Forbidden files: broad repo static analysis.
- Acceptance: fixture path expectations are tested.
- Validation: focused test, then `npm run build`.

### CORE-03-010 definition-compatibility-build-polish

- Objective: fix build/type issues from CORE-03 only.
- Allowed files: files touched by CORE-03.
- Forbidden files: unrelated refactors.
- Acceptance: `npm run build` passes.
- Validation: `npm run build`.

## OPS-03 - Release Candidate Readiness

Goal: add backup/restore proof, runbooks, release checklist, and known limitations.

### OPS-03-001 release-readiness-inventory

- Objective: inventory current deploy, CI, operations, and release docs.
- Allowed files: docs/operations, docs/product-roadmap, `.github/**`.
- Forbidden files: runtime code, DB migrations.
- Acceptance: release readiness gaps are listed.
- Validation: `git diff --check`.

### OPS-03-002 known-limitations-template

- Objective: add known limitations template for commercial RC.
- Allowed files: docs/operations or product roadmap docs.
- Forbidden files: code.
- Acceptance: template includes blocker, severity, workaround, owner, and exit condition.
- Validation: `git diff --check`.

### OPS-03-003 operator-runbook-skeleton

- Objective: add operator runbook skeleton for deploy, rollback, incident, and support lookup.
- Allowed files: docs/operations.
- Forbidden files: code.
- Acceptance: runbook has actionable headings and placeholders only where evidence is not available.
- Validation: `git diff --check`.

### OPS-03-004 backup-restore-proof-plan

- Objective: document backup/restore proof plan without executing destructive operations.
- Allowed files: docs/operations.
- Forbidden files: scripts that alter DB.
- Acceptance: plan names commands, evidence, rollback, and risk.
- Validation: `git diff --check`.

### OPS-03-005 release-checklist-doc

- Objective: add release checklist tied to Gates A-F.
- Allowed files: docs/product-roadmap, docs/operations.
- Forbidden files: code.
- Acceptance: checklist distinguishes required, optional, and non-blocking Vercel preview items.
- Validation: `git diff --check`.

### OPS-03-006 ci-required-checks-doc

- Objective: document required GitHub checks for PR merge independent of Vercel preview limits.
- Allowed files: docs/operations, `.github/**` docs only.
- Forbidden files: changing branch protection through code.
- Acceptance: `npm run build` is listed as mandatory evidence.
- Validation: `git diff --check`.

### OPS-03-007 incident-classification-contract

- Objective: define incident severity and response states as docs/types if a local type file exists.
- Allowed files: operations docs/type files and tests if applicable.
- Forbidden files: alerting implementation.
- Acceptance: severity levels and response states are explicit.
- Validation: `npm run build` if code touched, otherwise `git diff --check`.

### OPS-03-008 support-evidence-template

- Objective: add support evidence template for PRs, incidents, and customer reports.
- Allowed files: docs/operations, docs/reviews.
- Forbidden files: code.
- Acceptance: template includes source, command, result, timestamp, and limitation.
- Validation: `git diff --check`.

### OPS-03-009 rc-readiness-doc-index

- Objective: update docs index to link release readiness docs.
- Allowed files: docs index/readme files.
- Forbidden files: code.
- Acceptance: operator can find release checklist from product roadmap.
- Validation: `git diff --check`.

### OPS-03-010 ops-build-polish

- Objective: run final docs lint/diff check and fix broken markdown links introduced by OPS-03.
- Allowed files: docs touched by OPS-03.
- Forbidden files: code.
- Acceptance: docs are internally linked and no conflict markers exist.
- Validation: `git diff --check`.

## INT-03 - Import/Export Blueprint Channel

Goal: prepare secure import/export flow for reusable blueprints without full execution.

### INT-03-001 blueprint-channel-inventory

- Objective: inventory existing import/export ideas and choose canonical channel boundary.
- Allowed files: integration/blueprint docs/type files.
- Forbidden files: real external storage or network calls.
- Acceptance: channel boundary is documented.
- Validation: `npm run build`.

### INT-03-002 blueprint-export-request-type

- Objective: define export request type with package id, version, requested sections, and redaction options.
- Allowed files: blueprint/integration type/tests.
- Forbidden files: actual export implementation.
- Acceptance: request is typed and validated.
- Validation: focused test, then `npm run build`.

### INT-03-003 blueprint-export-result-envelope

- Objective: define export result envelope with artifact metadata, warnings, and blockers.
- Allowed files: blueprint/integration type/tests.
- Forbidden files: file upload/download implementation.
- Acceptance: result avoids embedding raw artifact bytes.
- Validation: focused test, then `npm run build`.

### INT-03-004 blueprint-import-request-type

- Objective: define import request type with source metadata, checksum, dry-run flag, and target workspace.
- Allowed files: blueprint/integration type/tests.
- Forbidden files: DB import behavior.
- Acceptance: dry-run is explicit and defaults safe.
- Validation: focused test, then `npm run build`.

### INT-03-005 blueprint-import-preflight-result

- Objective: define preflight result envelope with compatible, warnings, blockers, and required approvals.
- Allowed files: blueprint/integration type/tests.
- Forbidden files: install execution.
- Acceptance: blockers are typed and stable.
- Validation: focused test, then `npm run build`.

### INT-03-006 blueprint-channel-checksum-validation

- Objective: validate checksum metadata shape for import/export artifacts.
- Allowed files: blueprint/integration validation/tests.
- Forbidden files: crypto implementation beyond simple validation.
- Acceptance: invalid checksum shape fails deterministically.
- Validation: focused test, then `npm run build`.

### INT-03-007 blueprint-channel-fixtures

- Objective: add fixtures for export success, export warning, import dry-run blocker.
- Allowed files: blueprint/integration fixtures/tests.
- Forbidden files: production artifacts.
- Acceptance: fixtures are synthetic and test-used.
- Validation: focused test, then `npm run build`.

### INT-03-008 blueprint-channel-docs

- Objective: document secure import/export channel, dry-run, redaction, checksum, and non-goals.
- Allowed files: docs/product-roadmap, integration docs.
- Forbidden files: code.
- Acceptance: docs state execution is future work.
- Validation: `git diff --check`.

### INT-03-009 blueprint-channel-index-export

- Objective: export import/export request/result types from stable index.
- Allowed files: integration/blueprint index files.
- Forbidden files: DB, UI.
- Acceptance: imports build.
- Validation: `npm run build`.

### INT-03-010 blueprint-channel-build-polish

- Objective: fix build/type issues from INT-03 only.
- Allowed files: files touched by INT-03.
- Forbidden files: unrelated integrations.
- Acceptance: `npm run build` passes.
- Validation: `npm run build`.

## RT-04 - Runtime Failure Semantics

Goal: make runtime failure states explicit and testable.

### RT-04-001 runtime-failure-state-inventory

- Objective: inventory current runtime status/failure fields and define canonical failure states.
- Allowed files: runtime docs/type/tests.
- Forbidden files: DB migrations.
- Acceptance: failure states are documented and mapped to existing statuses.
- Validation: `npm run build`.

### RT-04-002 runtime-failure-type

- Objective: define typed runtime failure object with code, phase, retryable, diagnostic id.
- Allowed files: runtime type/tests.
- Forbidden files: service behavior.
- Acceptance: failure type is exported.
- Validation: focused test, then `npm run build`.

### RT-04-003 runtime-retryable-classification

- Objective: implement pure helper classifying runtime errors as retryable or permanent.
- Allowed files: runtime helper/tests.
- Forbidden files: retry executor behavior.
- Acceptance: known codes map deterministically.
- Validation: focused test, then `npm run build`.

### RT-04-004 runtime-failure-transition-test

- Objective: test allowed status transitions after runtime failure.
- Allowed files: runtime tests/helpers.
- Forbidden files: DB state machine rewrite.
- Acceptance: invalid transitions fail.
- Validation: focused test, then `npm run build`.

### RT-04-005 runtime-action-failure-envelope

- Objective: define action failure envelope preserving support-safe details.
- Allowed files: runtime action type/tests.
- Forbidden files: connector execution changes.
- Acceptance: envelope excludes raw payload by default.
- Validation: focused test, then `npm run build`.

### RT-04-006 runtime-failure-fixtures

- Objective: add fixtures for validation failure, action failure, event append failure, unknown failure.
- Allowed files: runtime fixtures/tests.
- Forbidden files: production data.
- Acceptance: fixtures are used by failure tests.
- Validation: focused test, then `npm run build`.

### RT-04-007 runtime-failure-docs

- Objective: document runtime failure states and operational response.
- Allowed files: runtime docs/product roadmap.
- Forbidden files: code.
- Acceptance: docs separate retryable from permanent failures.
- Validation: `git diff --check`.

### RT-04-008 runtime-failure-index-export

- Objective: export failure types/helpers from runtime index.
- Allowed files: runtime index/type files.
- Forbidden files: DB, UI.
- Acceptance: imports build.
- Validation: `npm run build`.

### RT-04-009 runtime-failure-no-any-sweep

- Objective: remove public `any` from failure surfaces touched in RT-04.
- Allowed files: runtime failure files touched in RT-04.
- Forbidden files: repo-wide cleanup.
- Acceptance: touched public APIs avoid `any`.
- Validation: `npm run build`.

### RT-04-010 runtime-failure-build-polish

- Objective: fix build/type issues from RT-04 only.
- Allowed files: files touched by RT-04.
- Forbidden files: unrelated runtime refactors.
- Acceptance: `npm run build` passes.
- Validation: `npm run build`.

## MOD-04 - Capability Dependency Graph

Goal: model capability dependencies before install ordering is implemented.

### MOD-04-001 capability-dependency-inventory

- Objective: inventory capability dependency references and document canonical graph inputs.
- Allowed files: capability docs/type/tests.
- Forbidden files: install execution, DB.
- Acceptance: graph inputs are documented.
- Validation: `npm run build`.

### MOD-04-002 capability-dependency-type

- Objective: define dependency edge type with source, target, kind, optional version constraint.
- Allowed files: capability type/tests.
- Forbidden files: resolver implementation.
- Acceptance: dependency edge is exported and typed.
- Validation: focused test, then `npm run build`.

### MOD-04-003 capability-graph-validation

- Objective: validate malformed dependency edges.
- Allowed files: capability validation/tests.
- Forbidden files: DB, install service.
- Acceptance: empty target/source fails.
- Validation: focused test, then `npm run build`.

### MOD-04-004 capability-cycle-detection-helper

- Objective: implement pure helper detecting dependency cycles.
- Allowed files: capability graph helper/tests.
- Forbidden files: install ordering.
- Acceptance: simple and nested cycles are detected.
- Validation: focused test, then `npm run build`.

### MOD-04-005 capability-topological-sort-helper

- Objective: implement pure topological sort helper for dependency graph.
- Allowed files: capability graph helper/tests.
- Forbidden files: module install behavior.
- Acceptance: deterministic order for acyclic graph.
- Validation: focused test, then `npm run build`.

### MOD-04-006 capability-dependency-fixtures

- Objective: add fixtures for acyclic graph, simple cycle, missing dependency, version mismatch.
- Allowed files: capability fixtures/tests.
- Forbidden files: production module data.
- Acceptance: fixtures are used by tests.
- Validation: focused test, then `npm run build`.

### MOD-04-007 capability-version-constraint-test

- Objective: test basic version constraint validation without full semver resolver if not present.
- Allowed files: capability validation/tests.
- Forbidden files: install behavior.
- Acceptance: invalid constraints fail.
- Validation: focused test, then `npm run build`.

### MOD-04-008 capability-dependency-docs

- Objective: document dependency graph contract, cycle detection, and non-goals.
- Allowed files: product roadmap/module docs.
- Forbidden files: code.
- Acceptance: docs state install ordering is future work.
- Validation: `git diff --check`.

### MOD-04-009 capability-dependency-index-export

- Objective: export graph types/helpers from stable capability index.
- Allowed files: capability index/type files.
- Forbidden files: DB, UI.
- Acceptance: imports build.
- Validation: `npm run build`.

### MOD-04-010 capability-dependency-build-polish

- Objective: fix build/type issues from MOD-04 only.
- Allowed files: files touched by MOD-04.
- Forbidden files: unrelated modules.
- Acceptance: `npm run build` passes.
- Validation: `npm run build`.

## UI-04 - Form Builder Persistence Preparation

Goal: prepare Form Builder for real save/load by tightening UI contracts without writing DB code.

### UI-04-001 form-builder-persistence-inventory

- Objective: inventory Form Builder state, save/load mocks, and persistence gaps.
- Allowed files: Form Builder docs/components/type files.
- Forbidden files: DB, real server actions.
- Acceptance: canonical persistence handoff points are documented.
- Validation: `npm run build`.

### UI-04-002 form-draft-view-model-type

- Objective: define UI view model type for form draft editing.
- Allowed files: Form Builder type/tests.
- Forbidden files: DB, server actions.
- Acceptance: model includes fields, layout, validation summary, revision metadata.
- Validation: focused test, then `npm run build`.

### UI-04-003 form-draft-save-intent

- Objective: define client-side save intent type used by future server action.
- Allowed files: Form Builder type/tests.
- Forbidden files: actual persistence behavior.
- Acceptance: intent includes draft id, revision token, and payload.
- Validation: focused test, then `npm run build`.

### UI-04-004 form-builder-unsaved-state-helper

- Objective: implement pure helper determining dirty/clean/conflict UI state.
- Allowed files: Form Builder helper/tests.
- Forbidden files: backend calls.
- Acceptance: helper covers clean, dirty, saving, conflict, failed.
- Validation: focused test, then `npm run build`.

### UI-04-005 form-builder-validation-summary

- Objective: add compact validation summary component from existing validation data.
- Allowed files: Form Builder components/tests.
- Forbidden files: validation engine rewrite.
- Acceptance: component handles no errors, warnings, and blockers.
- Validation: `npm run build`.

### UI-04-006 form-builder-save-disabled-guard

- Objective: ensure save command can be disabled for invalid/conflict states.
- Allowed files: Form Builder components/helpers/tests.
- Forbidden files: server action implementation.
- Acceptance: disabled reason is deterministic.
- Validation: focused test, then `npm run build`.

### UI-04-007 form-builder-fixtures

- Objective: add fixtures for empty draft, valid draft, invalid draft, conflict draft.
- Allowed files: Form Builder fixtures/tests.
- Forbidden files: production data.
- Acceptance: fixtures are used by focused tests.
- Validation: focused test, then `npm run build`.

### UI-04-008 form-builder-persistence-docs

- Objective: document Form Builder persistence preparation and next server-side tasks.
- Allowed files: docs/product-roadmap and Form Builder docs.
- Forbidden files: code.
- Acceptance: docs do not claim real save/load yet.
- Validation: `git diff --check`.

### UI-04-009 form-builder-index-export

- Objective: export stable view model/save intent helpers.
- Allowed files: Form Builder index/type files.
- Forbidden files: DB.
- Acceptance: imports build.
- Validation: `npm run build`.

### UI-04-010 form-builder-build-polish

- Objective: fix build/type issues from UI-04 only.
- Allowed files: files touched by UI-04.
- Forbidden files: unrelated UI.
- Acceptance: `npm run build` passes.
- Validation: `npm run build`.

## CORE-04 - Publication Validation Pipeline

Goal: prepare a deterministic validation pipeline before publication becomes executable.

### CORE-04-001 publication-pipeline-inventory

- Objective: inventory publication validation helpers and docs.
- Allowed files: workflow publication docs/type/tests.
- Forbidden files: DB, real publication writes.
- Acceptance: pipeline stages are listed.
- Validation: `npm run build`.

### CORE-04-002 publication-stage-type

- Objective: define typed validation stage names and stage result.
- Allowed files: publication type/tests.
- Forbidden files: service behavior.
- Acceptance: stages are exported and stable.
- Validation: focused test, then `npm run build`.

### CORE-04-003 publication-validation-context

- Objective: define validation context with workspace, actor, draft, target version, and policy flags.
- Allowed files: publication type/tests.
- Forbidden files: auth/DB.
- Acceptance: context avoids raw `any` payload.
- Validation: focused test, then `npm run build`.

### CORE-04-004 publication-validation-result

- Objective: define aggregate validation result with blockers, warnings, evidence.
- Allowed files: publication type/tests.
- Forbidden files: publication writes.
- Acceptance: result can represent pass, warning-only, blocked.
- Validation: focused test, then `npm run build`.

### CORE-04-005 publication-stage-runner-helper

- Objective: implement pure helper that runs an ordered list of validation stage functions.
- Allowed files: publication helper/tests.
- Forbidden files: runtime execution, DB.
- Acceptance: runner stops or continues according to explicit stage policy.
- Validation: focused test, then `npm run build`.

### CORE-04-006 publication-validation-fixtures

- Objective: add fixtures for passing pipeline, warning pipeline, blocked pipeline.
- Allowed files: publication fixtures/tests.
- Forbidden files: production data.
- Acceptance: fixtures are used by runner tests.
- Validation: focused test, then `npm run build`.

### CORE-04-007 publication-evidence-contract

- Objective: define evidence item type for publication validation output.
- Allowed files: publication type/tests/docs.
- Forbidden files: audit/event implementation.
- Acceptance: evidence includes source, command/check, result, timestamp.
- Validation: focused test, then `npm run build`.

### CORE-04-008 publication-pipeline-docs

- Objective: document validation pipeline stages and non-goals.
- Allowed files: docs/product-roadmap and workflow docs.
- Forbidden files: code.
- Acceptance: docs state publication write path is future work.
- Validation: `git diff --check`.

### CORE-04-009 publication-pipeline-index-export

- Objective: export publication validation types/helpers.
- Allowed files: workflow publication index/type files.
- Forbidden files: DB, UI.
- Acceptance: imports build.
- Validation: `npm run build`.

### CORE-04-010 publication-pipeline-build-polish

- Objective: fix build/type issues from CORE-04 only.
- Allowed files: files touched by CORE-04.
- Forbidden files: unrelated workflow refactors.
- Acceptance: `npm run build` passes.
- Validation: `npm run build`.

## OPS-04 - Support Diagnostics Foundation

Goal: create support-safe diagnostic contracts across runtime, Builder, modules, and integrations.

### OPS-04-001 support-diagnostics-inventory

- Objective: inventory support-facing diagnostics across lanes and choose canonical diagnostic envelope.
- Allowed files: docs/operations, product roadmap, type files if present.
- Forbidden files: logging transport, DB.
- Acceptance: diagnostic sources are listed.
- Validation: `npm run build` if code touched, otherwise `git diff --check`.

### OPS-04-002 support-diagnostic-envelope

- Objective: define support diagnostic envelope with source, severity, correlation, tenant boundary, and redaction class.
- Allowed files: support/operations type/tests.
- Forbidden files: runtime logging implementation.
- Acceptance: envelope is typed and avoids raw secret payload.
- Validation: focused test, then `npm run build`.

### OPS-04-003 support-diagnostic-source-type

- Objective: define allowed diagnostic sources for runtime, builder, modules, integrations, operations.
- Allowed files: support/operations type/tests.
- Forbidden files: broad module changes.
- Acceptance: unknown source fails validation.
- Validation: focused test, then `npm run build`.

### OPS-04-004 support-severity-helper

- Objective: implement pure helper mapping error classes to support severity.
- Allowed files: support helper/tests.
- Forbidden files: alerting.
- Acceptance: helper maps info, warning, error, critical.
- Validation: focused test, then `npm run build`.

### OPS-04-005 support-redaction-test

- Objective: test diagnostic redaction with synthetic sensitive payload.
- Allowed files: support tests/helpers.
- Forbidden files: global redaction rewrite.
- Acceptance: sensitive values are not emitted.
- Validation: focused test, then `npm run build`.

### OPS-04-006 support-diagnostic-fixtures

- Objective: add diagnostics fixtures for each lane source.
- Allowed files: support fixtures/tests.
- Forbidden files: production logs.
- Acceptance: fixtures are synthetic and test-used.
- Validation: focused test, then `npm run build`.

### OPS-04-007 support-runbook-linkage

- Objective: link support diagnostics contract to operator runbook and release checklist.
- Allowed files: docs/operations, docs/product-roadmap.
- Forbidden files: code.
- Acceptance: operator can find diagnostic interpretation docs.
- Validation: `git diff --check`.

### OPS-04-008 support-diagnostics-index-export

- Objective: export support diagnostic types/helpers.
- Allowed files: support/operations index/type files.
- Forbidden files: DB, UI.
- Acceptance: imports build.
- Validation: `npm run build`.

### OPS-04-009 support-diagnostics-docs

- Objective: document support diagnostics foundation and non-goals.
- Allowed files: docs/operations, docs/product-roadmap.
- Forbidden files: code.
- Acceptance: docs avoid claiming live observability dashboards.
- Validation: `git diff --check`.

### OPS-04-010 support-diagnostics-build-polish

- Objective: fix build/type issues from OPS-04 only.
- Allowed files: files touched by OPS-04.
- Forbidden files: unrelated operations.
- Acceptance: `npm run build` passes.
- Validation: `npm run build`.

## Materialization Rule For Future Coordinators

When creating runtime queue items from this document:

1. Select the next sprint whose predecessor is terminal and clean.
2. Copy all 10 tasks with their exact IDs.
3. Set each task to `planned_gated` first.
4. Promote to `ready` only after the prior sprint closeout is clean.
5. Keep task order stable.
6. Do not merge two tasks into one Jules prompt.
7. Do not broaden allowed files to make Jules comfortable.
8. If a task cannot be executed within its allowed files, mark it `needs_codex` and create a corrective task.

## Corrective Sprint Template

Use only when the prior sprint closed with defects or review risk.

| Task | Objective |
|---|---|
| FIX-XX-001 | Reproduce the failing evidence from the prior sprint. |
| FIX-XX-002 | Identify the smallest file scope needed for repair. |
| FIX-XX-003 | Repair the failing type/build/test issue. |
| FIX-XX-004 | Add or tighten a regression test. |
| FIX-XX-005 | Update docs only if the behavior contract changed. |

Corrective sprints should be 5 tasks unless the defect spans multiple lanes.
