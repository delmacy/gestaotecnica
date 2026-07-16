import { describe, it } from "node:test";
import assert from "node:assert";
import { TimelineItemSchema } from "@/platform/observability/contracts/timeline-item";
import { validTimelineItem, validTimelineItemWithoutOptionals } from "../../../../fixtures/platform/observability/timeline-item.fixtures";

describe("TimelineItemSchema", () => {
  it("should parse a valid timeline item with all fields", () => {
    const result = TimelineItemSchema.safeParse(validTimelineItem);
    assert.strictEqual(result.success, true);
  });

  it("should parse a valid timeline item missing optional fields", () => {
    const result = TimelineItemSchema.safeParse(validTimelineItemWithoutOptionals);
    assert.strictEqual(result.success, true);
  });

  it("should reject an item missing required fields", () => {
    const invalidItem = {
      id: "item-123",
      type: "audit",
      // title missing
      occurredAt: new Date(),
      payload: {},
    };
    const result = TimelineItemSchema.safeParse(invalidItem);
    assert.strictEqual(result.success, false);
  });

  it("should reject an item with invalid occurredAt type", () => {
    const invalidItem = {
      ...validTimelineItem,
      occurredAt: "2023-10-01T12:00:00Z", // Should be a Date object
    };
    const result = TimelineItemSchema.safeParse(invalidItem);
    assert.strictEqual(result.success, false);
  });

  it("should reject an item with extra fields due to strict mode", () => {
    const invalidItem = {
      ...validTimelineItem,
      extraField: "not allowed",
    };
    const result = TimelineItemSchema.safeParse(invalidItem);
    assert.strictEqual(result.success, false);
  });
});
