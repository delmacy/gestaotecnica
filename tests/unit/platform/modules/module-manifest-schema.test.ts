import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { ModuleManifestSchema } from "../../../../src/platform/modules/module-manifest";
import {
  VALID_MANIFEST_FIXTURE,
  VALID_FULL_MANIFEST_FIXTURE,
  INVALID_MANIFEST_FIXTURES
} from "../../../fixtures/platform/modules/manifest.fixtures";

describe("Module Manifest Schema", () => {
  test("should parse a valid minimal manifest", () => {
    const result = ModuleManifestSchema.safeParse(VALID_MANIFEST_FIXTURE);
    assert.strictEqual(result.success, true);
  });

  test("should parse a valid full manifest", () => {
    const result = ModuleManifestSchema.safeParse(VALID_FULL_MANIFEST_FIXTURE);
    assert.strictEqual(result.success, true);
  });

  test("should reject duplicate actions", () => {
    const result = ModuleManifestSchema.safeParse(INVALID_MANIFEST_FIXTURES[0]);
    assert.strictEqual(result.success, false);
  });

  test("should reject duplicate events", () => {
    const result = ModuleManifestSchema.safeParse(INVALID_MANIFEST_FIXTURES[1]);
    assert.strictEqual(result.success, false);
  });

  test("should reject duplicate views", () => {
    const result = ModuleManifestSchema.safeParse(INVALID_MANIFEST_FIXTURES[2]);
    assert.strictEqual(result.success, false);
  });

  test("should reject duplicate dependencies", () => {
    const result = ModuleManifestSchema.safeParse(INVALID_MANIFEST_FIXTURES[3]);
    assert.strictEqual(result.success, false);
  });
});
