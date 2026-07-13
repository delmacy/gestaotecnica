import { describe, it } from 'node:test';
import assert from 'node:assert';
import { z } from 'zod';
import { BlueprintPackageManifestSchema } from '../../../../src/platform/blueprints/contracts/blueprint-package-manifest';
import {
  VALID_MANIFEST_FULL,
  VALID_MANIFEST_MINIMAL,
  INVALID_MANIFEST_MISSING_ID,
  INVALID_MANIFEST_EMPTY_VERSION
} from '../../../fixtures/platform/blueprints/blueprint-package-manifest.fixtures';

describe('BlueprintPackageManifestSchema', () => {
  it('should validate a full valid manifest', () => {
    const result = BlueprintPackageManifestSchema.parse(VALID_MANIFEST_FULL);
    assert.deepStrictEqual(result, VALID_MANIFEST_FULL);
  });

  it('should validate a minimal valid manifest', () => {
    const result = BlueprintPackageManifestSchema.parse(VALID_MANIFEST_MINIMAL);
    assert.deepStrictEqual(result, VALID_MANIFEST_MINIMAL);
  });

  it('should throw ZodError for missing packageId', () => {
    assert.throws(
      () => BlueprintPackageManifestSchema.parse(INVALID_MANIFEST_MISSING_ID),
      (err) => {
        assert(err instanceof z.ZodError);
        const issues = err.issues;
        assert.strictEqual(issues[0].code, 'invalid_type');
        assert.strictEqual(issues[0].path[0], 'packageId');
        return true;
      }
    );
  });

  it('should throw ZodError for empty version string', () => {
    assert.throws(
      () => BlueprintPackageManifestSchema.parse(INVALID_MANIFEST_EMPTY_VERSION),
      (err) => {
        assert(err instanceof z.ZodError);
        const issues = err.issues;
        assert.strictEqual(issues[0].code, 'too_small');
        assert.strictEqual(issues[0].path[0], 'version');
        return true;
      }
    );
  });
});
