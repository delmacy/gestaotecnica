1. **Create the TimelineItem schema**
   - Create a file `src/platform/observability/contracts/timeline-item.ts` using `write_file` with the following content:
```typescript
import { z } from "zod";

export const TimelineItemSchema = z.object({
  id: z.string(),
  type: z.string(),
  title: z.string(),
  description: z.string().optional(),
  occurredAt: z.date(),
  actorId: z.string().optional(),
  payload: z.record(z.string(), z.unknown()),
});

export type TimelineItem = Readonly<z.infer<typeof TimelineItemSchema>>;
```
2. **Verify TimelineItem schema creation**
   - Run `cat src/platform/observability/contracts/timeline-item.ts` in bash to verify the file was created successfully.
3. **Update the service to use the new contract**
   - In `src/platform/observability/application/timeline.service.ts`, apply a replace diff to import `TimelineItem` from `@/platform/observability/contracts/timeline-item` and delete the local interface.
4. **Verify timeline.service.ts update**
   - Run `cat src/platform/observability/application/timeline.service.ts` in bash to verify the change.
5. **Expose the contract in the platform boundary**
   - In `src/platform/index.ts`, apply a replace diff to add:
```typescript
export * from "./observability/contracts/timeline-item";
```
6. **Verify src/platform/index.ts update**
   - Run `cat src/platform/index.ts` to verify the export was added correctly.
7. **Create fixtures for tests**
   - Create `tests/fixtures/platform/observability/timeline-item.fixtures.ts` using `write_file` with the following content:
```typescript
import { TimelineItem } from "@/platform/observability/contracts/timeline-item";

export const validTimelineItem: TimelineItem = {
  id: "test-id",
  type: "system",
  title: "Test Event",
  description: "Optional description",
  occurredAt: new Date("2024-01-01T00:00:00Z"),
  actorId: "user-123",
  payload: { key: "value" }
};

export const minimalTimelineItem: TimelineItem = {
  id: "minimal-id",
  type: "audit",
  title: "Minimal Event",
  occurredAt: new Date("2024-01-01T00:00:00Z"),
  payload: {}
};

export const invalidTimelineItem = {
  id: 123, // should be string
  type: "audit",
  title: "Minimal Event",
  occurredAt: "2024-01-01T00:00:00Z", // should be date
  payload: {}
};
```
8. **Verify test fixtures creation**
   - Run `cat tests/fixtures/platform/observability/timeline-item.fixtures.ts` in bash.
9. **Update existing tests**
   - Update `tests/unit/platform/observability/application/timeline.service.test.ts` to import `TimelineItem` from the new boundary using `replace_with_git_merge_diff`.
10. **Verify existing tests update**
    - Run `cat tests/unit/platform/observability/application/timeline.service.test.ts` to verify the change.
11. **Add new contract tests**
    - Create `tests/unit/platform/observability/contracts/timeline-item.test.ts` using `write_file` with the following content:
```typescript
import { describe, it } from "node:test";
import * as assert from "node:assert/strict";
import { TimelineItemSchema } from "@/platform/observability/contracts/timeline-item";
import { validTimelineItem, minimalTimelineItem, invalidTimelineItem } from "../../../../fixtures/platform/observability/timeline-item.fixtures";

describe("TimelineItemSchema", () => {
  it("should validate a complete timeline item", () => {
    const result = TimelineItemSchema.safeParse(validTimelineItem);
    assert.equal(result.success, true);
  });

  it("should validate a minimal timeline item", () => {
    const result = TimelineItemSchema.safeParse(minimalTimelineItem);
    assert.equal(result.success, true);
  });

  it("should reject an invalid timeline item", () => {
    const result = TimelineItemSchema.safeParse(invalidTimelineItem);
    assert.equal(result.success, false);
  });
});
```
12. **Verify contract tests creation**
    - Run `cat tests/unit/platform/observability/contracts/timeline-item.test.ts` to verify.
13. **Project-wide checks**
    - Run `npm run check:architecture`, `npm run check:no-explicit-any`, `npm run build`, and `npm run test` in a dedicated bash session.
14. **Complete pre-commit steps**
    - Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.
15. **Submit PR**
    - Run `git add .` and `git commit -m "refactor: extract TimelineItem contract to zod schema"` using `run_in_bash_session`, then use the `submit` tool to conclude the task.
