# RC-02-005-runtime-actions-db-boundary-casts - Runtime actions DB boundary casts

        You are Jules working in delmacy/gestaotecnica from GitHub main.

Task id: RC-02-005-runtime-actions-db-boundary-casts
Title: Runtime actions DB boundary casts
Sprint: RC-02 Runtime Core Hardening
Front: Gestao Tecnica Runtime
Risk: low

Objective:
Replace db as any casts in runtime.actions.ts with a RuntimeDb boundary cast/import, preserving the mocked workspace/user constants and public server action behavior.

Allowed files:
- src/features/workflow/runtime/runtime.actions.ts

Forbidden files:
- src/features/workflow/runtime/runtime.repository.ts
- src/features/workflow/runtime/runtime.service.ts
- src/features/workflow/runtime/runtime-step.service.ts
- src/features/workflow/runtime/runtime.types.ts
- tests/**
- src/db/**
- drizzle/**
- migrations/**
- app/**
- components/**
- package.json
- package-lock.json

Acceptance criteria:
- runtime.actions.ts has no db as any casts.
- RuntimeDb is used as the explicit boundary type for getRuntimeDb output.
- Mock workspaceId and userId constants remain unchanged.
- No auth, workspace isolation, DB schema, or UI behavior is introduced.

Required validation commands:
- npm run build

Operational rules:
- Keep the PR small and scoped to the allowed files.
- Do not modify database schema, migrations, drizzle config, generated files, package metadata, or UI files.
- Do not run or include drizzle/db migration changes in the PR.
- If a validation command fails because the environment database is missing tables, report that as an environment/setup note and do not change DB schema.
- Open a Pull Request against main when complete.
- Do not create runtime.server.ts in this task.
