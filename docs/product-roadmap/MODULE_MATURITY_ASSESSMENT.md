# System Builder - Module Maturity Assessment

This document is the initial commercial-readiness assessment for System Builder modules. It reconciles the current repository shape with the product roadmap and should be updated at every sprint close.

## Assessment Method

Percentages below measure commercial completion, not file count. A module scores higher only when it has:

- documented contract and boundaries;
- implemented code connected to the application;
- behavioral tests or E2E coverage;
- tenant/security posture where applicable;
- persistence/runtime integration where the product requires it;
- operational evidence through PRs, CI, and review.

Mock-only UI, synthetic data, and documentation-heavy modules are useful but do not count as production-complete by themselves.

## Current Module Completion

| Module | Completion | Confidence | Evidence | Main Gap |
|---|---:|---|---|---|
| Product roadmap and task governance | 55% | Medium | `docs/product-roadmap`, task index, execution rules, sprint structure | Needs one canonical commercial delivery plan and recurring sprint close updates |
| Platform foundation, admin, auth | 45% | Medium | auth tests, platform routes, admin recovery history | Needs hardening around commercial onboarding, support operations, and release evidence |
| Runtime core and event execution | 42% | Medium | `src/features/workflow/runtime`, runtime tests, recent RC pilot PRs, event docs | Needs full event receipt semantics, idempotency, transaction proof, and runtime-service boundary completion |
| Workflow definitions and validation | 40% | Medium | process schema, node/edge validation tests, workflow docs | Needs integrated draft -> publish -> execute path and UI/runtime parity |
| Capability registry and manifests | 35% | Medium | capability catalog docs, registry tests, universal capability library | Needs install/activate/deactivate lifecycle and runtime-backed manifests |
| Builder shell and navigation | 35% | Medium | `/builder/*` routes, shell components, E2E builder route | Needs real state, permissions, and production navigation flows |
| Form Builder | 32% | Medium | form-builder components, contracts, persistence adapter tests | Still design/studio-oriented; needs real save/load, versioning, validation, and publication |
| View Builder | 28% | Low-Medium | view-builder UI contracts and components | Mostly mock/static; needs persistence, data binding, preview data, and governance |
| Workflow Builder UI | 28% | Low-Medium | workflow-builder surfaces and docs | Mostly design-only; needs integration with process definitions and runtime validation |
| Process Mirroring / As-Is intake | 25% | Medium | docs, mock surfaces, synthetic source modeling | Needs real source ingestion, evidence provenance, and conversion into capabilities/workflows |
| Governance, audit, approvals | 25% | Medium | governance docs/UI mock, approval tests, audit concepts | Needs enforceable policy engine, approvals provenance, and audit receipts |
| Gestão Técnica vertical | 18% | Low | module docs and technical-project paths exist | Needs selected golden path, real domain persistence, workflows, dashboards, and E2E proof |
| Integrations and webhooks | 10% | Low | integration future plan docs | Needs connector contracts, webhook security, retries, and operational tests |
| Observability, operations, deploy | 20% | Low-Medium | CI/build checks, operations docs, some validation workflows | Needs health/readiness, structured logs, backup/restore, incident runbooks, and release gates |
| Commercial readiness | 12% | Low | roadmap exists and product direction is clear | Needs beta flow, billing/tenant packaging if applicable, support model, release candidate, and operator documentation |

## Interpretation

The project is strongest in conceptual architecture, documented contracts, and prototype UI breadth. It is weaker in end-to-end commercial closure: persistence, tenant-safe runtime behavior, real publication, real vertical usage, and operational readiness.

The recommended next operating posture is:

1. Keep Runtime Core hardening moving through small Jules PRs.
2. Turn the roadmap into commercial phases with stable gates.
3. Pick one vertical path for Gestão Técnica and make it real before expanding.
4. Promote mock Builder surfaces only when they are connected to persisted contracts and runtime validation.

## Update Rule

At the end of each sprint, update:

- changed module percentages;
- new evidence links;
- newly discovered gaps;
- next sprint recommendation.

Do not increase a percentage based only on an opened PR, a Jules success message, or synthetic UI additions. Increase it only after merge plus independent review evidence.
