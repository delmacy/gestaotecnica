# RC-04-010-runtime-events-no-any-gate - RC-04-010 Runtime events no-any gate

        Objective: extend the existing no-any sweep test with a small allowlist/report improvement if needed so runtime/events and runtime.service regressions are clearly reported. Do not weaken the forbidden checks.

Allowed files:
- tests/unit/workflow-runtime-no-any-sweep.test.ts

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
- src/features/workflow/runtime/**

Required validation:
- npx tsx --test tests/unit/workflow-runtime-no-any-sweep.test.ts
- npm run build

Implementation rules:
- No DB/schema/migration/package-lock changes unless explicitly allowed.
- Only allowed files may be changed.
- Starting branch must be main.
- Do not commit docs/agent-runs context files in the implementation PR.
- Do not broaden runtime behavior, auth, workspace isolation, UI, or workflow semantics.
- If the scope cannot be completed exactly, open a blocker/question instead of editing extra files.
