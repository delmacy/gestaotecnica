import { test } from "node:test";
import * as assert from "node:assert/strict";
import { CapabilityLifecycleTransitionSchema } from "../../src/platform/registry/capabilities/schemas";

test("CapabilityLifecycleTransitionSchema", async (t) => {
  await t.test("should accept valid transitions", () => {
    const validTransition = {
      from: "draft",
      to: "active"
    };

    const result = CapabilityLifecycleTransitionSchema.safeParse(validTransition);
    assert.strictEqual(result.success, true);
    if (result.success) {
      assert.strictEqual(result.data.from, "draft");
      assert.strictEqual(result.data.to, "active");
    }
  });

  await t.test("should accept transitions to same state", () => {
    const validTransition = {
      from: "active",
      to: "active"
    };

    const result = CapabilityLifecycleTransitionSchema.safeParse(validTransition);
    assert.strictEqual(result.success, true);
  });

  await t.test("should reject unknown statuses", () => {
    const invalidTransition = {
      from: "unknown_status",
      to: "active"
    };

    const result = CapabilityLifecycleTransitionSchema.safeParse(invalidTransition);
    assert.strictEqual(result.success, false);
  });

  await t.test("should reject if 'from' is missing", () => {
    const invalidTransition = {
      to: "active"
    };

    const result = CapabilityLifecycleTransitionSchema.safeParse(invalidTransition);
    assert.strictEqual(result.success, false);
  });

  await t.test("should reject if 'to' is missing", () => {
    const invalidTransition = {
      from: "draft"
    };

    const result = CapabilityLifecycleTransitionSchema.safeParse(invalidTransition);
    assert.strictEqual(result.success, false);
  });

  await t.test("should reject non-object payloads", () => {
    const result1 = CapabilityLifecycleTransitionSchema.safeParse("draft to active");
    assert.strictEqual(result1.success, false);

    const result2 = CapabilityLifecycleTransitionSchema.safeParse(null);
    assert.strictEqual(result2.success, false);
  });
});
