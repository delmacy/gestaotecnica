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
