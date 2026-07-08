# RC-PILOT-001-runtime-payload-types - Runtime payload public types

        You are Jules working in delmacy/gestaotecnica from GitHub main.

Task id: RC-PILOT-001-runtime-payload-types
Title: Runtime payload public types
Risk: low

Objective:
Create/export RuntimePayload = Record<string, unknown> in runtime.types.ts and replace public runtime payload fields that currently use Record<string, any>. Preserve runtime behavior.

Allowed files:
- src/features/workflow/runtime/runtime.types.ts

Forbidden files:
- src/features/workflow/runtime/runtime.validation.ts
- src/features/workflow/runtime/runtime.repository.ts
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
- RuntimePayload is exported from runtime.types.ts.
- No Record<string, any> remains in runtime.types.ts.
- Existing public type names remain exported.
- No files outside allowed scope are changed.

Required validation commands:
- npm run build

Operational rules:
- Keep the PR small and scoped to the allowed files.
- Do not modify database schema, migrations, drizzle config, generated files, package metadata, or UI files.
- Do not run or include drizzle/db migration changes in the PR.
- If a validation command fails because the environment database is missing tables, report that as an environment/setup note and do not change DB schema.
- Open a Pull Request against main when complete.
