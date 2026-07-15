import { describe, it } from "node:test";
import * as assert from "node:assert/strict";
import { TimelineItemSchema } from "@/platform/observability/contracts/timeline-item";
import { validTimelineItem, validMinimalTimelineItem } from "../../../../fixtures/platform/observability/timeline-item.fixtures";

describe("TimelineItemSchema", () => {
  it("accepts valid comprehensive item", () => {
    const result = TimelineItemSchema.safeParse(validTimelineItem);
    assert.equal(result.success, true);
  });

  it("accepts valid minimal item", () => {
    const result = TimelineItemSchema.safeParse(validMinimalTimelineItem);
    assert.equal(result.success, true);
  });

  it("rejects item missing required fields", () => {
    const result = TimelineItemSchema.safeParse({
      id: "invalid-id"
      // missing type, title, occurredAt, payload
    });
    assert.equal(result.success, false);
  });

  it("rejects item with extra fields due to strict mode", () => {
    const result = TimelineItemSchema.safeParse({
      ...validMinimalTimelineItem,
      extraField: "not allowed"
    });
    assert.equal(result.success, false);
  });
});
