import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { isManifestVersionCompatible } from "../../../../src/platform/modules/manifest-compatibility";

describe("Manifest Version Compatibility", () => {
  test("Equal versions should be compatible", () => {
    assert.strictEqual(isManifestVersionCompatible("1.0.0", "1.0.0"), true);
    assert.strictEqual(isManifestVersionCompatible("1.0.1", "1.0.1"), true);
  });

  test("Patch or minor bumped available version should be compatible", () => {
    assert.strictEqual(isManifestVersionCompatible("1.0.0", "1.1.5"), true);
    assert.strictEqual(isManifestVersionCompatible("1.2.0", "1.3.0"), true);
  });

  test("Major bump available should be incompatible", () => {
    assert.strictEqual(isManifestVersionCompatible("1.0.0", "2.0.0"), false);
    assert.strictEqual(isManifestVersionCompatible("1.5.0", "3.1.2"), false);
  });

  test("Major bump requested should be incompatible", () => {
    assert.strictEqual(isManifestVersionCompatible("2.0.0", "1.0.0"), false);
    assert.strictEqual(isManifestVersionCompatible("3.0.0", "2.5.0"), false);
  });
});
