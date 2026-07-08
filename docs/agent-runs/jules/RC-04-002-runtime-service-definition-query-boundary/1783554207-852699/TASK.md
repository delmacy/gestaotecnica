# RC-04-002-runtime-service-definition-query-boundary - RC-04-002 Runtime service definition query boundary

        Objective: remove the `getProcessVersionById(db as any, ...)` cast in `runtime.service.ts` with the narrowest practical query DB boundary. Follow the pattern already used for runtime-step service.

Allowed files:
- src/features/workflow/runtime/runtime.service.ts
- src/features/workflow/definitions/process-definition.queries.ts

Forbidden files:
- src/db/**
- drizzle/**
- migrations/**
- package.json
- package-lock.json
- src/app/**
- src/components/**
- docs/**
- .github/**
- src/features/workflow/runtime/runtime.repository.ts
- src/features/workflow/runtime/runtime-step.service.ts
- src/features/workflow/runtime/events/**

Required validation:
- npm run build

Implementation rules:
- No DB/schema/migration/package-lock changes unless explicitly allowed.
- Only allowed files may be changed.
- Starting branch must be main.
- Do not commit docs/agent-runs context files in the implementation PR.
- Do not broaden runtime behavior, auth, workspace isolation, UI, or workflow semantics.
- If the scope cannot be completed exactly, open a blocker/question instead of editing extra files.
