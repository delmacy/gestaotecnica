---
id: GT-AGENT-002
title: Remove eager database initialization from module import
status: ready
priority: 20
sprint_id: SPRINT-001
epic_id: EP-DATABASE-RUNTIME
story_points: 2
estimated_minutes: 35
depends_on:
  - GT-AGENT-001
model_tier: simple
risk: low
requires_database: false
context_paths:
  - src/db/index.ts
  - tests/unit/**
allowed_paths:
  - src/db/index.ts
  - src/**/*.ts
  - tests/unit/**
forbidden_paths:
  - .github/workflows/**
  - src/db/**/schema/**
agent_validation:
  - npm run typecheck
ci_validation:
  - npm run typecheck
  - npm run test:unit
  - npm run build
max_files: 4
---

## Objective

Allow modules to be imported during build and tests without creating database clients until a database accessor is called.

## Current behavior

`src/db/index.ts` exports eagerly initialized `platformDb` and `runtimeDb`, which can require database environment variables during module evaluation.

## Required change

Replace eager initialization with a backward-compatible lazy access pattern. Update only the minimum number of direct consumers needed to keep compilation green.

## Acceptance criteria

- Importing `src/db/index.ts` does not initialize a database client.
- `getPlatformDb`, `getRuntimeDb`, and `getDb` preserve their behavior.
- No schema or migration changes.
- Typecheck, unit tests, and build pass.

## Non-goals

- Do not redesign database ownership.
- Do not add fallback production credentials.
- Do not change pooling values unless required for laziness.

## Evidence expected

Identify direct consumers changed and report the validation results.
