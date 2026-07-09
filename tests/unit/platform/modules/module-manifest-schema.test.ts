import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { ModuleManifestSchema } from "../../../../src/platform/modules/module-manifest";

describe("Module Manifest Schema", () => {
  test("should parse a valid minimal manifest", () => {
    const validManifest = {
      key: "test-module",
      name: "Test Module"
    };
    const result = ModuleManifestSchema.safeParse(validManifest);
    assert.strictEqual(result.success, true);
  });

  test("should parse a valid full manifest", () => {
    const validManifest = {
      key: "test-module",
      name: "Test Module",
      description: "A test module",
      actions: ["action1", "action2"],
      events: ["event1", "event2"],
      views: ["view1", "view2"],
      dependencies: ["dep1", "dep2"],
      lifecycleStatus: "active"
    };
    const result = ModuleManifestSchema.safeParse(validManifest);
    assert.strictEqual(result.success, true);
  });

  test("should reject duplicate actions", () => {
    const invalidManifest = {
      key: "test-module",
      name: "Test Module",
      actions: ["action1", "action1"]
    };
    const result = ModuleManifestSchema.safeParse(invalidManifest);
    assert.strictEqual(result.success, false);
  });

  test("should reject duplicate events", () => {
    const invalidManifest = {
      key: "test-module",
      name: "Test Module",
      events: ["event1", "event1"]
    };
    const result = ModuleManifestSchema.safeParse(invalidManifest);
    assert.strictEqual(result.success, false);
  });

  test("should reject duplicate views", () => {
    const invalidManifest = {
      key: "test-module",
      name: "Test Module",
      views: ["view1", "view1"]
    };
    const result = ModuleManifestSchema.safeParse(invalidManifest);
    assert.strictEqual(result.success, false);
  });

  test("should reject duplicate dependencies", () => {
    const invalidManifest = {
      key: "test-module",
      name: "Test Module",
      dependencies: ["dep1", "dep1"]
    };
    const result = ModuleManifestSchema.safeParse(invalidManifest);
    assert.strictEqual(result.success, false);
  });
});
