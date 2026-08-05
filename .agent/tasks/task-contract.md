# Compact task contract

Every ready task must contain this YAML header:

```yaml
---
id: GT-EXAMPLE-001
title: Short imperative title
status: ready
priority: 100
model_tier: simple
risk: low
allowed_paths:
  - src/example/**
forbidden_paths:
  - .github/workflows/**
validation:
  - npm run typecheck
  - npm run test:unit -- example
max_files: 4
---
```

The body must include:

1. Objective
2. Current behavior
3. Required change
4. Acceptance criteria
5. Non-goals
6. Evidence expected

Tasks for simple models must be independently executable, avoid architectural choices, name the relevant files or symbols, and use observable acceptance criteria.
