import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { ManifestVersionSchema } from "../../../../../src/platform/registry/capabilities/schemas";

describe("Manifest Version Schema", () => {
  test("should accept valid semantic versions", () => {
    const validVersions = [
      "1.0.0",
      "0.1.0",
      "2.3.4",
      "10.20.30"
    ];
    for (const version of validVersions) {
      const result = ManifestVersionSchema.safeParse(version);
      assert.strictEqual(result.success, true);
      if (result.success) {
        assert.strictEqual(result.data, version);
      }
    }
  });

  test("should reject invalid semantic versions", () => {
    const invalidVersions: unknown[] = [
      "1.0",
      "1",
      "v1.0.0",
      "1.0.0-beta",
      "1.0.0+build123",
      "a.b.c",
      "",
      123,
      null,
      undefined,
      {},
      []
    ];
    for (const version of invalidVersions) {
      const result = ManifestVersionSchema.safeParse(version);
      assert.strictEqual(result.success, false);
    }
  });
});
