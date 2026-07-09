import { test } from "node:test";
import * as assert from "node:assert/strict";
import { canTransitionCapabilityStatus } from "../../src/platform/registry/capabilities/lifecycle";
import { CapabilityStatus } from "../../src/platform/registry/capabilities/schemas";

test("canTransitionCapabilityStatus", async (t) => {
  await t.test("should allow valid transitions", () => {
    assert.strictEqual(canTransitionCapabilityStatus("draft", "active"), true);
    assert.strictEqual(canTransitionCapabilityStatus("draft", "retired"), true);

    assert.strictEqual(canTransitionCapabilityStatus("active", "deprecated"), true);
    assert.strictEqual(canTransitionCapabilityStatus("active", "retired"), true);

    assert.strictEqual(canTransitionCapabilityStatus("deprecated", "retired"), true);
  });

  await t.test("should reject invalid transitions", () => {
    assert.strictEqual(canTransitionCapabilityStatus("draft", "deprecated"), false);

    assert.strictEqual(canTransitionCapabilityStatus("active", "draft"), false);

    assert.strictEqual(canTransitionCapabilityStatus("deprecated", "draft"), false);
    assert.strictEqual(canTransitionCapabilityStatus("deprecated", "active"), false);
  });

  await t.test("should reject self-transitions", () => {
    const statuses: CapabilityStatus[] = ["draft", "active", "deprecated", "retired"];
    for (const status of statuses) {
      assert.strictEqual(canTransitionCapabilityStatus(status, status), false);
    }
  });

  await t.test("should treat retired as terminal", () => {
    assert.strictEqual(canTransitionCapabilityStatus("retired", "draft"), false);
    assert.strictEqual(canTransitionCapabilityStatus("retired", "active"), false);
    assert.strictEqual(canTransitionCapabilityStatus("retired", "deprecated"), false);
  });
});
