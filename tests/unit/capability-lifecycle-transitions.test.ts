import { test } from "node:test";
import * as assert from "node:assert/strict";
import { canTransitionCapabilityStatus, isCapabilityReadyForActivation } from "../../src/platform/registry/capabilities/lifecycle";
import { Capability } from "../../src/platform/registry/capabilities/schemas";
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


test("isCapabilityReadyForActivation", async (t) => {
  const baseCapability = {
    id: "00000000-0000-0000-0000-000000000000",
    key: "test-capability",
    name: "Test Capability",
    description: "A test capability",
    domain: "work-management",
    group: "execution",
    version: "1.0.0",
    status: "draft" as const,
    businessObjects: [{ key: "obj1", name: "Object 1" }],
    businessActions: [{ key: "act1", name: "Action 1" }],
    businessEvents: [],
    businessRules: [],
    roles: [],
    inputs: [],
    outputs: [],
    dependencies: [],
    relatedCapabilities: [],
    applicableSectors: [],
    metadata: {}
  };

  await t.test("should return true for valid draft capabilities", () => {
    assert.strictEqual(isCapabilityReadyForActivation(baseCapability as Capability), true);
  });

  await t.test("should return false for non-draft capabilities", () => {
    const active = { ...baseCapability, status: "active" as const };
    assert.strictEqual(isCapabilityReadyForActivation(active as Capability), false);

    const retired = { ...baseCapability, status: "retired" as const };
    assert.strictEqual(isCapabilityReadyForActivation(retired as Capability), false);
  });

  await t.test("should return false when missing business objects", () => {
    const noObjects = { ...baseCapability, businessObjects: [] };
    assert.strictEqual(isCapabilityReadyForActivation(noObjects as Capability), false);
  });

  await t.test("should return false when missing business actions", () => {
    const noActions = { ...baseCapability, businessActions: [] };
    assert.strictEqual(isCapabilityReadyForActivation(noActions as Capability), false);
  });
});
