# RC-PILOT-002-runtime-validators - Runtime payload validators

        You are Jules working in delmacy/gestaotecnica from GitHub main.

Task id: RC-PILOT-002-runtime-validators
Title: Runtime payload validators
Risk: low

Objective:
Replace z.any() with z.unknown() for runtime payload schemas and add focused unit tests for arbitrary object payloads and invalid UUID rejection.

Allowed files:
- src/features/workflow/runtime/runtime.validation.ts
- tests/unit/workflow-runtime-validation.test.ts

Forbidden files:
- src/features/workflow/runtime/runtime.types.ts
- src/features/workflow/runtime/runtime.repository.ts
- src/features/workflow/runtime/runtime.service.ts
- src/features/workflow/runtime/runtime-step.service.ts
- src/features/workflow/runtime/runtime.actions.ts
- src/db/**
- drizzle/**
- migrations/**
- package.json
- package-lock.json

Acceptance criteria:
- No z.any() remains in runtime.validation.ts.
- New unit test covers valid arbitrary payload object parsing.
- New unit test covers invalid UUID rejection for a runtime input.
- No database/schema files are changed.

Required validation commands:
- npx tsx --test tests/unit/workflow-runtime-validation.test.ts
- npm run build

Operational rules:
- Keep the PR small and scoped to the allowed files.
- Do not modify database schema, migrations, drizzle config, generated files, package metadata, or UI files.
- Do not run or include drizzle/db migration changes in the PR.
- If a validation command fails because the environment database is missing tables, report that as an environment/setup note and do not change DB schema.
- Open a Pull Request against main when complete.
