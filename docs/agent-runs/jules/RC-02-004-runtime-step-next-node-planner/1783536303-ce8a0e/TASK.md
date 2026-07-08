# RC-02-004-runtime-step-next-node-planner - Runtime step next-node planner helper

        You are Jules working in delmacy/gestaotecnica from GitHub main.

Task id: RC-02-004-runtime-step-next-node-planner
Title: Runtime step next-node planner helper
Sprint: RC-02 Runtime Core Hardening
Front: Gestao Tecnica Runtime
Risk: low

Objective:
Extract the simple linear next-step decision from advanceStep into a pure helper that can be unit-tested without a database. Preserve the current behavior: first outgoing edge only, no outgoing edge completes, explicit end node completes, missing target node returns invalid definition.

Allowed files:
- src/features/workflow/runtime/runtime-step.service.ts
- tests/unit/workflow-runtime-step-next-node.test.ts

Forbidden files:
- src/features/workflow/runtime/runtime.repository.ts
- src/features/workflow/runtime/runtime.service.ts
- src/features/workflow/runtime/runtime.actions.ts
- src/features/workflow/runtime/runtime.types.ts
- src/db/**
- drizzle/**
- migrations/**
- app/**
- components/**
- package.json
- package-lock.json

Acceptance criteria:
- A pure helper covers next-step planning without requiring RuntimeDb.
- Tests cover no outgoing edge, target end node, normal next action node, and missing target node.
- advanceStep still returns the same RuntimeResult shapes for those branches.
- No repository query semantics are changed.

Required validation commands:
- npx tsx --test tests/unit/workflow-runtime-step-next-node.test.ts
- npm run build

Operational rules:
- Keep the PR small and scoped to the allowed files.
- Do not modify database schema, migrations, drizzle config, generated files, package metadata, or UI files.
- Do not run or include drizzle/db migration changes in the PR.
- If a validation command fails because the environment database is missing tables, report that as an environment/setup note and do not change DB schema.
- Open a Pull Request against main when complete.
- Do not introduce branching/parallel path behavior; keep the current linear engine semantics.
