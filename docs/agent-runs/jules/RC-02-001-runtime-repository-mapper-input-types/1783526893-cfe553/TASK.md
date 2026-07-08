# RC-02-001-runtime-repository-mapper-input-types - Runtime repository mapper input types

        You are Jules working in delmacy/gestaotecnica from GitHub main.

Task id: RC-02-001-runtime-repository-mapper-input-types
Title: Runtime repository mapper input types
Sprint: RC-02 Runtime Core Hardening
Front: Gestao Tecnica Runtime
Risk: low

Objective:
Replace the public mapper parameters row: any in runtime.repository.ts with explicit local row input types or unknown-safe helper types, preserving current mapper behavior and repository query behavior.

Allowed files:
- src/features/workflow/runtime/runtime.repository.ts
- tests/unit/workflow-runtime-repository-mappers.test.ts

Forbidden files:
- src/features/workflow/runtime/runtime.service.ts
- src/features/workflow/runtime/runtime-step.service.ts
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
- mapProcessInstanceRow, mapProcessPayloadRow, and mapActionExecutionRow no longer accept row: any.
- Null row handling remains compatible with existing tests.
- Repository query semantics are unchanged.
- No schema/migration files are changed.

Required validation commands:
- npx tsx --test tests/unit/workflow-runtime-repository-mappers.test.ts
- npm run build

Operational rules:
- Keep the PR small and scoped to the allowed files.
- Do not modify database schema, migrations, drizzle config, generated files, package metadata, or UI files.
- Do not run or include drizzle/db migration changes in the PR.
- If a validation command fails because the environment database is missing tables, report that as an environment/setup note and do not change DB schema.
- Open a Pull Request against main when complete.
- Do not try to fully type RuntimeDb in this task; only mapper input typing is in scope.
