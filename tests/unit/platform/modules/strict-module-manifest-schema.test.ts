import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { validateStrictModuleManifest } from "../../../../src/platform/modules/module-manifest";

describe("Strict Module Manifest Schema", () => {
  test("should accept a valid strict manifest", () => {
    const validManifest = {
      id: "module-test-1",
      key: "test-module",
      name: "Test Module",
      version: "1.0.0",
      capabilities: ["cap1"],
      lifecycleStatus: "active"
    };
    const result = validateStrictModuleManifest(validManifest);
    assert.strictEqual(result.success, true);
  });

  test("should reject when id is missing with correct error", () => {
    const invalidManifest = {
      key: "test-module",
      name: "Test Module",
      version: "1.0.0",
      capabilities: ["cap1"],
      lifecycleStatus: "active"
    };
    const result = validateStrictModuleManifest(invalidManifest);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.strictEqual(result.error.issues[0].message, "MANIFEST_MISSING_ID");
    }
  });

  test("should reject when key is missing with correct error", () => {
    const invalidManifest = {
      id: "module-test-1",
      name: "Test Module",
      version: "1.0.0",
      capabilities: ["cap1"],
      lifecycleStatus: "active"
    };
    const result = validateStrictModuleManifest(invalidManifest);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.strictEqual(result.error.issues[0].message, "MANIFEST_MISSING_KEY");
    }
  });

  test("should reject when name is missing with correct error", () => {
    const invalidManifest = {
      id: "module-test-1",
      key: "test-module",
      version: "1.0.0",
      capabilities: ["cap1"],
      lifecycleStatus: "active"
    };
    const result = validateStrictModuleManifest(invalidManifest);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.strictEqual(result.error.issues[0].message, "MANIFEST_MISSING_NAME");
    }
  });

  test("should reject when version is missing with correct error", () => {
    const invalidManifest = {
      id: "module-test-1",
      key: "test-module",
      name: "Test Module",
      capabilities: ["cap1"],
      lifecycleStatus: "active"
    };
    const result = validateStrictModuleManifest(invalidManifest);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.strictEqual(result.error.issues[0].message, "MANIFEST_MISSING_VERSION");
    }
  });

  test("should reject when version has invalid format", () => {
    const invalidManifest = {
      id: "module-test-1",
      key: "test-module",
      name: "Test Module",
      version: "1.0",
      capabilities: ["cap1"],
      lifecycleStatus: "active"
    };
    const result = validateStrictModuleManifest(invalidManifest);
    assert.strictEqual(result.success, false);
  });

  test("should reject when capabilities is missing with correct error", () => {
    const invalidManifest = {
      id: "module-test-1",
      key: "test-module",
      name: "Test Module",
      version: "1.0.0",
      lifecycleStatus: "active"
    };
    const result = validateStrictModuleManifest(invalidManifest);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.strictEqual(result.error.issues[0].message, "MANIFEST_MISSING_CAPABILITIES");
    }
  });

  test("should reject when lifecycleStatus is missing with correct error", () => {
    const invalidManifest = {
      id: "module-test-1",
      key: "test-module",
      name: "Test Module",
      version: "1.0.0",
      capabilities: ["cap1"]
    };
    const result = validateStrictModuleManifest(invalidManifest);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.strictEqual(result.error.issues[0].message, "MANIFEST_MISSING_LIFECYCLE");
    }
  });
});
