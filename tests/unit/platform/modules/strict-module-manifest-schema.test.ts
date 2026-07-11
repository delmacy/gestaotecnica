import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { StrictModuleManifestSchema } from "../../../../src/platform/modules/module-manifest";
import {
  VALID_STRICT_MANIFEST_FIXTURE,
  INVALID_STRICT_MANIFEST_FIXTURES
} from "../../../fixtures/platform/modules/manifest.fixtures";

describe("Strict Module Manifest Schema", () => {
  test("should parse a valid strict manifest", () => {
    const result = StrictModuleManifestSchema.safeParse(VALID_STRICT_MANIFEST_FIXTURE);
    assert.strictEqual(result.success, true);
  });

  test("should fail if id is missing", () => {
    const result = StrictModuleManifestSchema.safeParse(INVALID_STRICT_MANIFEST_FIXTURES[0]);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.ok(result.error.issues.some(i => i.path.includes("id")));
    }
  });

  test("should fail if version is missing", () => {
    const result = StrictModuleManifestSchema.safeParse(INVALID_STRICT_MANIFEST_FIXTURES[1]);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.ok(result.error.issues.some(i => i.path.includes("version")));
    }
  });

  test("should fail if capabilities is missing", () => {
    const result = StrictModuleManifestSchema.safeParse(INVALID_STRICT_MANIFEST_FIXTURES[2]);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.ok(result.error.issues.some(i => i.path.includes("capabilities")));
    }
  });

  test("should fail if lifecycleMetadata is missing", () => {
    const result = StrictModuleManifestSchema.safeParse(INVALID_STRICT_MANIFEST_FIXTURES[3]);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.ok(result.error.issues.some(i => i.path.includes("lifecycleMetadata")));
    }
  });

  test("should fail if version is invalid format", () => {
    const result = StrictModuleManifestSchema.safeParse(INVALID_STRICT_MANIFEST_FIXTURES[4]);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.ok(result.error.issues.some(i => i.path.includes("version")));
    }
  });

  test("should fail if capability reference is empty", () => {
    const result = StrictModuleManifestSchema.safeParse(INVALID_STRICT_MANIFEST_FIXTURES[5]);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      // The custom message isn't preserved by zod array validation when it fails deep on inner elements in some versions
      // So we just check that capabilities path is in error.
      assert.ok(result.error.issues.some(i => i.path.includes("capabilities")));
    }
  });

  test("should fail if capability reference is malformed", () => {
    const result = StrictModuleManifestSchema.safeParse(INVALID_STRICT_MANIFEST_FIXTURES[6]);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.ok(result.error.issues.some(i => i.path.includes("capabilities")));
    }
  });
});
