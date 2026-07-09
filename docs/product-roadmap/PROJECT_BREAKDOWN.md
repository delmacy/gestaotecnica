# System Builder - Project Breakdown

This document converts the commercial delivery plan into phases, sprint themes, and task-generation rules.

## Phase Model

| Phase | Commercial Goal | Primary Gate | Current Estimate | Execution Mode |
|---|---|---|---:|---|
| P0 - Canonical planning and evidence | One source of truth for roadmap, maturity, and task conversion | Planning baseline | 55% | Codex docs and review |
| P1 - Runtime foundation | Safe execution, events, workflow definitions, and tests | Gate A | 42% | Jules microtasks, OpenCode review |
| P2 - Builder publication MVP | Draft, validate, publish, rollback | Gate B | 30% | Sequential, small PRs |
| P3 - Gestão Técnica golden path | First real commercial vertical | Gate C | 18% | Sequential with selected domain slice |
| P4 - Blueprint reuse | Reusable packaged system model | Gate D | 15% | After vertical proof |
| P5 - Governance and operations | Safe multi-user operation | Gate E | 20% | Cross-cutting, gated |
| P6 - Commercial release candidate | Deployable and demonstrable product | Gate F | 12% | Final hardening |

Percentages are copied from `MODULE_MATURITY_ASSESSMENT.md` and should be updated there first.

## Sprint Conversion Rules

Every sprint must contain exactly 5 or 10 executable tasks unless explicitly approved otherwise.

Each task must include:

- stable ID;
- phase;
- objective;
- allowed files;
- forbidden files;
- dependencies;
- acceptance criteria;
- required validation commands;
- rollback or blocker rule.

The supervisor queue may contain the current sprint, but the repository docs must contain the strategic plan.

## Current Sprint Lane

### RC Lane - Runtime Core Hardening

Purpose: finish Gate A prerequisites without broad product changes.

Completed or active:

- RC-PILOT: strict runtime payload and mapper cleanup;
- RC-02: runtime repository and validation refinements;
- RC-03: runtime step and DB boundary hardening;
- RC-04: runtime service and events boundary hardening.

Next recommended RC sprints:

| Sprint | Theme | Purpose |
|---|---|---|
| RC-05 | Event receipts and idempotency | Align runtime events with commercial audit requirements |
| RC-06 | Workflow definition publication boundary | Connect definitions to validated publishable versions |
| RC-07 | Runtime error and observability contract | Prepare supportability before Builder publication |
| RC-08 | Integration test stabilization | Establish Gate A final evidence |

## Commercial Sprint Map

### Sprint C01 - Runtime/Event Commercial Contract

Goal: make runtime event behavior commercially auditable.

Candidate tasks:

1. define event receipt public type and mapper;
2. add append-only event invariant tests;
3. add idempotency key validation for runtime event writes;
4. add transaction boundary test around process start event;
5. add redaction-safe event payload serialization;
6. document runtime event error codes;
7. add support-facing event lookup contract;
8. add no-cross-tenant event query test;
9. add CI command for runtime event unit tests;
10. update maturity evidence after merge.

### Sprint C02 - Workflow Publication Contract

Goal: make process definitions publishable with validation evidence.

Candidate tasks:

1. inventory current process definition schema and code;
2. define draft-to-published version contract;
3. add graph validation edge-case tests;
4. add invalid node/action contract tests;
5. create publication result envelope;
6. add rollback metadata type;
7. add definition compatibility test;
8. connect workflow docs to runtime contract;
9. add publish preflight checklist;
10. update task index and maturity evidence.

### Sprint C03 - Builder Draft Persistence

Goal: move Builder surfaces from mock-only toward persisted draft behavior.

Candidate tasks:

1. select one Builder surface as first persisted path;
2. define draft save/load contract;
3. add repository boundary for drafts;
4. add server action validation envelope;
5. add form draft save test;
6. add form draft load test;
7. add UI adapter boundary test;
8. add local mock-to-real state flag;
9. add rollback/delete draft rule;
10. update Builder docs and maturity evidence.

### Sprint C04 - Gestão Técnica Minimal Domain

Goal: select and implement the smallest vertical slice.

Candidate tasks:

1. define technical request entity contract;
2. define triage status state machine;
3. define assignment/work-order relationship;
4. implement persistence for technical request draft;
5. add tenant-aware query tests;
6. add intake form binding to technical request;
7. add workflow trigger contract;
8. add timeline event mapping;
9. add dashboard read model sketch;
10. update golden path evidence.

### Sprint C05 - Governance and Release Operations

Goal: make the product safe enough for beta usage.

Candidate tasks:

1. define support role boundaries;
2. add audit receipt envelope test;
3. add structured logging contract;
4. add health/readiness endpoint contract;
5. add backup/restore proof plan;
6. add permission matrix for Builder publish;
7. add approval provenance test;
8. add incident runbook skeleton;
9. add release readiness checklist;
10. update commercial release blockers.

## What Not To Do Yet

- Do not run broad UI redesign before Builder persistence is chosen.
- Do not start multiple verticals before Gestão Técnica golden path works.
- Do not add integrations before event receipts, idempotency, and support diagnostics exist.
- Do not treat mock UI as commercial readiness.
- Do not let `state/state.json` become the roadmap.

## Task Manager Rule

When Codex creates a sprint for Jules, it should:

1. read this document and `COMMERCIAL_DELIVERY_PLAN.md`;
2. choose the next sprint theme;
3. generate 10 narrow tasks;
4. enqueue only when no active Jules session blocks the lane;
5. record the sprint ID in supervisor state;
6. update this document only after the sprint is complete or intentionally superseded.
