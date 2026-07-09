# System Builder - Commercial Delivery Plan

This is the canonical commercial delivery plan for System Builder. It supersedes scattered phase plans as the main planning north star. Older phase, archive, validation, and module documents remain reference material unless this document links them as active inputs.

## Product Definition

System Builder is a platform for turning operational knowledge into governed software systems. The commercial product must let a user:

1. model a real operating context;
2. define capabilities, entities, forms, views, workflows, and governance;
3. publish a controlled version;
4. execute that version safely;
5. observe evidence, audit, errors, and lifecycle events;
6. reuse the result as a blueprint for other clients or domains.

The first commercial vertical is Gestão Técnica. It is the proving ground for the platform.

## Canonical Sources

| Source | Role |
|---|---|
| `docs/product-roadmap/COMMERCIAL_DELIVERY_PLAN.md` | Commercial north star and release path |
| `docs/product-roadmap/PROJECT_BREAKDOWN.md` | Phase, sprint, and task breakdown |
| `docs/product-roadmap/MODULE_MATURITY_ASSESSMENT.md` | Current module maturity and gaps |
| `docs/product-roadmap/TASK_INDEX.md` | Stable task index |
| `docs/product-roadmap/EXECUTION_RULES.md` | Agent execution and review rules |
| Sprint folders under `docs/product-roadmap/` | Executable task contracts |

All other docs are reference inputs unless explicitly promoted here.

## Delivery Gates

### Gate A - Runtime Foundation

Goal: runtime, events, workflow definitions, and validation are reliable enough for real builder publication.

Exit criteria:

- runtime payloads, event rows, and repository boundaries avoid unsafe public `any`;
- workflow definition contracts are validated with behavioral tests;
- event append, transaction, idempotency, and receipt behavior are tested;
- CI build and unit tests are stable.

### Gate B - Builder Publication MVP

Goal: a user can draft, validate, and publish a minimal process definition from Builder surfaces.

Exit criteria:

- Form Builder, View Builder, and Workflow Builder save/load persisted drafts;
- draft validation blocks invalid publication;
- publication is atomic and produces versioned artifacts;
- rollback path is documented and tested.

### Gate C - Gestão Técnica Golden Path

Goal: one real vertical flow works end to end.

Minimum golden path:

1. technical request intake;
2. triage;
3. assignment;
4. execution/work order;
5. approval or closure;
6. timeline/audit;
7. dashboard/report.

Exit criteria:

- domain entities are persisted and tenant-safe;
- workflow execution uses published definitions;
- UI surfaces are connected to real data;
- events and audit trail are visible;
- E2E test covers the happy path and at least one rejection/error path.

### Gate D - Blueprint Reuse

Goal: the Gestão Técnica solution can become a reusable blueprint.

Exit criteria:

- exported blueprint contains capabilities, forms, views, workflows, policies, and seed metadata;
- import/install path is idempotent;
- activation/deactivation lifecycle is tested;
- version compatibility is documented.

### Gate E - Governance and Operations

Goal: the product is safe to operate with multiple users and real customers.

Exit criteria:

- roles, permissions, approvals, and audit receipts are enforced;
- support diagnostics are tenant-aware;
- structured logs redact secrets and sensitive data;
- health/readiness endpoints distinguish live from ready;
- backup/restore and rollback have evidence.

### Gate F - Commercial Release Candidate

Goal: a release candidate can be demonstrated, deployed, operated, and supported.

Exit criteria:

- deployment is reproducible;
- release notes, operator guide, and known limitations are current;
- critical workflows pass E2E;
- security review and LGPD checklist are complete;
- no open blocker affects the demo or first commercial pilot.

## Execution Policy

- Codex owns planning, sprint conversion, exception handling, DevOps supervision, and final gate decisions.
- Jules owns implementation PRs.
- OpenCode owns deterministic review/test feedback when the supervisor invokes it.
- GitHub is the technical source of truth for code, PRs, CI, and review evidence.
- The supervisor state file is runtime state only; it is not a strategic roadmap.

## Immediate Direction

The current active line is Runtime Core hardening. After the current RC sprint finishes, the next sprints should continue in small batches of 10 tasks and converge toward Gate A.

Do not begin broad Builder UI or Gestão Técnica vertical work until Gate A is stable enough to avoid rework.
