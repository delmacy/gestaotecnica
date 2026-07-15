import test from "node:test";
import assert from "node:assert";
import { TimelineItemSchema } from "@/platform/observability/contracts/timeline-item";
import { validTimelineItem, invalidTimelineItem } from "../../../fixtures/platform/observability/timeline-item.fixtures";

test("TimelineItemSchema should validate correct item", () => {
  const result = TimelineItemSchema.safeParse(validTimelineItem);
  assert.strictEqual(result.success, true);
});

test("TimelineItemSchema should reject invalid item", () => {
  const result = TimelineItemSchema.safeParse(invalidTimelineItem);
  assert.strictEqual(result.success, false);
});
