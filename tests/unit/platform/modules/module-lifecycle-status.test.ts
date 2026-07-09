import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { ModuleLifecycleStatusSchema, ModuleManifest } from "../../../../src/platform/modules/module-manifest";

describe("Module Lifecycle Status", () => {
  test("should parse allowed lifecycle statuses", () => {
    const statuses = ["draft", "active", "deprecated", "retired"];
    for (const status of statuses) {
      const result = ModuleLifecycleStatusSchema.safeParse(status);
      assert.strictEqual(result.success, true);
      if (result.success) {
        assert.strictEqual(result.data, status);
      }
    }
  });

  test("should parse unknown lifecycle statuses", () => {
    const unknownStatuses = ["experimental", "sunset", "custom-status"];
    for (const status of unknownStatuses) {
      const result = ModuleLifecycleStatusSchema.safeParse(status);
      assert.strictEqual(result.success, true);
      if (result.success) {
        assert.strictEqual(result.data, status);
      }
    }
  });

  test("should fail on non-string statuses", () => {
    const invalidStatuses = [123, null, undefined, {}, []];
    for (const status of invalidStatuses) {
      const result = ModuleLifecycleStatusSchema.safeParse(status);
      assert.strictEqual(result.success, false);
    }
  });

  test("should preserve backwards compatibility for ModuleManifest without lifecycleStatus", () => {
    const manifest: ModuleManifest = {
      key: "test-module",
      name: "Test Module",
      description: "A module for testing",
      actions: ["action1"],
    };

    assert.strictEqual(manifest.key, "test-module");
    assert.strictEqual(manifest.lifecycleStatus, undefined);
  });

  test("should accept ModuleManifest with lifecycleStatus", () => {
    const manifest: ModuleManifest = {
      key: "test-module",
      name: "Test Module",
      lifecycleStatus: "active",
    };

    assert.strictEqual(manifest.key, "test-module");
    assert.strictEqual(manifest.lifecycleStatus, "active");
  });
});
