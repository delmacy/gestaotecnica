# RC-PILOT-004-runtime-repository-update-types - Runtime repository update typing

        You are Jules working in delmacy/gestaotecnica from GitHub main.

Task id: RC-PILOT-004-runtime-repository-update-types
Title: Runtime repository update typing
Risk: low

Objective:
Replace const updateData: any in updateActionExecutionStatus with an explicit partial update type compatible with the current actionExecutions update shape. Preserve the existing update behavior and where clauses.

Allowed files:
- src/features/workflow/runtime/runtime.repository.ts

Forbidden files:
- src/features/workflow/runtime/runtime.types.ts
- src/features/workflow/runtime/runtime.validation.ts
- src/features/workflow/runtime/runtime.service.ts
- src/features/workflow/runtime/runtime-step.service.ts
- src/features/workflow/runtime/runtime.actions.ts
- src/db/**
- drizzle/**
- migrations/**
- tests/**
- package.json
- package-lock.json

Acceptance criteria:
- No updateData: any remains in runtime.repository.ts.
- updateActionExecutionStatus still conditionally sets outputPayload, error, and finishedAt only when provided.
- No query where clauses are changed.
- No schema/migration files are changed.

Required validation commands:
- npm run build

Operational rules:
- Keep the PR small and scoped to the allowed files.
- Do not modify database schema, migrations, drizzle config, generated files, package metadata, or UI files.
- Do not run or include drizzle/db migration changes in the PR.
- If a validation command fails because the environment database is missing tables, report that as an environment/setup note and do not change DB schema.
- Open a Pull Request against main when complete.
