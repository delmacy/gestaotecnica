import { test } from "node:test";
import * as assert from "node:assert/strict";
import { canTransitionCapabilityStatus, isCapabilityReadyForActivation, canDeactivateCapability } from "../../src/platform/registry/capabilities";
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

test("canDeactivateCapability", async (t) => {
  await t.test("should allow transition to non-deactivation states regardless of dependents", () => {
    const dependents = [{ status: "active" as CapabilityStatus }];
    assert.strictEqual(canDeactivateCapability("active", dependents), true);
    assert.strictEqual(canDeactivateCapability("draft", dependents), true);
  });

  await t.test("should block deprecation or retirement when there is an active dependent", () => {
    const dependents = [{ status: "active" as CapabilityStatus }, { status: "deprecated" as CapabilityStatus }];
    assert.strictEqual(canDeactivateCapability("deprecated", dependents), false);
    assert.strictEqual(canDeactivateCapability("retired", dependents), false);
  });

  await t.test("should block deprecation or retirement when there is a draft dependent", () => {
    const dependents = [{ status: "draft" as CapabilityStatus }, { status: "retired" as CapabilityStatus }];
    assert.strictEqual(canDeactivateCapability("deprecated", dependents), false);
    assert.strictEqual(canDeactivateCapability("retired", dependents), false);
  });

  await t.test("should allow deprecation or retirement when all dependents are deprecated or retired", () => {
    const dependents = [{ status: "deprecated" as CapabilityStatus }, { status: "retired" as CapabilityStatus }];
    assert.strictEqual(canDeactivateCapability("deprecated", dependents), true);
    assert.strictEqual(canDeactivateCapability("retired", dependents), true);
  });

  await t.test("should allow deprecation or retirement when there are no dependents", () => {
    const dependents: { status: CapabilityStatus }[] = [];
    assert.strictEqual(canDeactivateCapability("deprecated", dependents), true);
    assert.strictEqual(canDeactivateCapability("retired", dependents), true);
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
