import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { StrictModuleManifestSchema } from "../../../../src/platform/modules/module-manifest";

describe("Strict Module Manifest Schema", () => {
  const validManifest = {
    id: "module-id-123",
    key: "test-module",
    name: "Test Module",
    version: "1.0.0",
    capabilities: ["123e4567-e89b-12d3-a456-426614174000", "123e4567-e89b-12d3-a456-426614174001"],
    lifecycleMetadata: { author: "test" }
  };

  test("should parse a valid strict manifest", () => {
    const result = StrictModuleManifestSchema.safeParse(validManifest);
    assert.strictEqual(result.success, true);
  });

  test("should fail if id is missing", () => {
    const { id, ...invalidManifest } = validManifest;
    const result = StrictModuleManifestSchema.safeParse(invalidManifest);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.ok(result.error.issues.some(i => i.path.includes("id")));
    }
  });

  test("should fail if version is missing", () => {
    const { version, ...invalidManifest } = validManifest;
    const result = StrictModuleManifestSchema.safeParse(invalidManifest);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.ok(result.error.issues.some(i => i.path.includes("version")));
    }
  });

  test("should fail if capabilities is missing", () => {
    const { capabilities, ...invalidManifest } = validManifest;
    const result = StrictModuleManifestSchema.safeParse(invalidManifest);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.ok(result.error.issues.some(i => i.path.includes("capabilities")));
    }
  });

  test("should fail if lifecycleMetadata is missing", () => {
    const { lifecycleMetadata, ...invalidManifest } = validManifest;
    const result = StrictModuleManifestSchema.safeParse(invalidManifest);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.ok(result.error.issues.some(i => i.path.includes("lifecycleMetadata")));
    }
  });

  test("should fail if version is invalid format", () => {
    const invalidManifest = { ...validManifest, version: "v1.0" };
    const result = StrictModuleManifestSchema.safeParse(invalidManifest);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.ok(result.error.issues.some(i => i.path.includes("version")));
    }
  });

  test("should fail if capability reference is empty", () => {
    const invalidManifest = { ...validManifest, capabilities: [""] };
    const result = StrictModuleManifestSchema.safeParse(invalidManifest);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.ok(result.error.issues.some(i => i.path.includes("capabilities") && i.message === "MISSING_MANIFEST_CAPABILITIES"));
    }
  });

  test("should fail if capability reference is malformed", () => {
    const invalidManifest = { ...validManifest, capabilities: ["not-a-uuid"] };
    const result = StrictModuleManifestSchema.safeParse(invalidManifest);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.ok(result.error.issues.some(i => i.path.includes("capabilities") && i.message === "MISSING_MANIFEST_CAPABILITIES"));
    }
  });
});
