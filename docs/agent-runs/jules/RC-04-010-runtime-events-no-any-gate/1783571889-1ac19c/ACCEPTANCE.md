# Acceptance Criteria

- The no-any sweep still forbids `Record<string, any>`, `z.any()`, and `as any`.
- Failure messages identify the relative file and pattern.
- `npx tsx --test tests/unit/workflow-runtime-no-any-sweep.test.ts` passes.
