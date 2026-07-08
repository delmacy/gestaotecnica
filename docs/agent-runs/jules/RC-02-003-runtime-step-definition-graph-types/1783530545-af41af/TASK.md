# RC-02-003-runtime-step-definition-graph-types - Runtime step definition graph types

        You are Jules working in delmacy/gestaotecnica from GitHub main.

Task id: RC-02-003-runtime-step-definition-graph-types
Title: Runtime step definition graph types
Sprint: RC-02 Runtime Core Hardening
Front: Gestao Tecnica Runtime
Risk: low

Objective:
Introduce local runtime definition graph types and make extractNodesAndEdges accept unknown instead of any. Remove explicit any usage from definition extraction and simple path-finding callbacks while preserving behavior.

Allowed files:
- src/features/workflow/runtime/runtime-step.service.ts
- tests/unit/workflow-runtime-step-definition.test.ts

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
- extractNodesAndEdges no longer accepts definitionJson: any.
- No edges.filter((e: any) => ...) or nodes.find((n: any) => ...) remains in runtime-step.service.ts.
- New tests cover root-level nodes/edges, draft.nodes/draft.edges, and missing graph fallback to empty arrays.
- advanceStep public behavior is preserved.

Required validation commands:
- npx tsx --test tests/unit/workflow-runtime-step-definition.test.ts
- npm run build

Operational rules:
- Keep the PR small and scoped to the allowed files.
- Do not modify database schema, migrations, drizzle config, generated files, package metadata, or UI files.
- Do not run or include drizzle/db migration changes in the PR.
- If a validation command fails because the environment database is missing tables, report that as an environment/setup note and do not change DB schema.
- Open a Pull Request against main when complete.
- It is acceptable to export a pure helper only if the test needs to import it.
