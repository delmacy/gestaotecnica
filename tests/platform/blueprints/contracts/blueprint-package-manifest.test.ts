import { describe, it } from 'node:test';
import assert from 'node:assert';
import { z } from 'zod';
import { BlueprintPackageManifestSchema } from '../../../../src/platform/blueprints/contracts/blueprint-package-manifest';
import {
  VALID_MANIFEST_FULL,
  VALID_MANIFEST_MINIMAL,
  VALID_MANIFEST_MISSING_SECTION,
  INVALID_MANIFEST_INCOMPATIBLE_VERSION,
  INVALID_MANIFEST_MISSING_ID,
  INVALID_MANIFEST_EMPTY_VERSION,
  INVALID_MANIFEST_MISSING_DEPENDENCY_ID,
  INVALID_MANIFEST_EMPTY_DEPENDENCY_ID,
  INVALID_MANIFEST_MISSING_DEPENDENCY_VERSION,
  INVALID_MANIFEST_EMPTY_DEPENDENCY_VERSION,
  INVALID_MANIFEST_CONTAINS_SECRETS
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

  it('should validate a manifest missing optional sections', () => {
    const result = BlueprintPackageManifestSchema.parse(VALID_MANIFEST_MISSING_SECTION);
    assert.deepStrictEqual(result, VALID_MANIFEST_MISSING_SECTION);
  });

  it('should throw ZodError for incompatible version type', () => {
    assert.throws(
      () => BlueprintPackageManifestSchema.parse(INVALID_MANIFEST_INCOMPATIBLE_VERSION),
      (err) => {
        assert(err instanceof z.ZodError);
        const issues = err.issues;
        assert.strictEqual(issues[0].path[0], 'version');
        return true;
      }
    );
  });

  it('should throw ZodError for missing packageId', () => {
    assert.throws(
      () => BlueprintPackageManifestSchema.parse(INVALID_MANIFEST_MISSING_ID),
      (err) => {
        assert(err instanceof z.ZodError);
        const issues = err.issues;
        assert.strictEqual(issues[0].message, 'MISSING_PACKAGE_ID');
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
        assert.strictEqual(issues[0].message, 'EMPTY_PACKAGE_VERSION');
        assert.strictEqual(issues[0].path[0], 'version');
        return true;
      }
    );
  });

  it('should throw ZodError for missing dependency packageId', () => {
    assert.throws(
      () => BlueprintPackageManifestSchema.parse(INVALID_MANIFEST_MISSING_DEPENDENCY_ID),
      (err) => {
        assert(err instanceof z.ZodError);
        const issues = err.issues;
        assert.strictEqual(issues[0].message, 'MISSING_DEPENDENCY_PACKAGE_ID');
        assert.strictEqual(issues[0].path[0], 'dependencies');
        assert.strictEqual(issues[0].path[1], 0);
        assert.strictEqual(issues[0].path[2], 'packageId');
        return true;
      }
    );
  });

  it('should throw ZodError for empty dependency packageId', () => {
    assert.throws(
      () => BlueprintPackageManifestSchema.parse(INVALID_MANIFEST_EMPTY_DEPENDENCY_ID),
      (err) => {
        assert(err instanceof z.ZodError);
        const issues = err.issues;
        assert.strictEqual(issues[0].message, 'EMPTY_DEPENDENCY_PACKAGE_ID');
        assert.strictEqual(issues[0].path[0], 'dependencies');
        assert.strictEqual(issues[0].path[1], 0);
        assert.strictEqual(issues[0].path[2], 'packageId');
        return true;
      }
    );
  });

  it('should throw ZodError for missing dependency version', () => {
    assert.throws(
      () => BlueprintPackageManifestSchema.parse(INVALID_MANIFEST_MISSING_DEPENDENCY_VERSION),
      (err) => {
        assert(err instanceof z.ZodError);
        const issues = err.issues;
        assert.strictEqual(issues[0].message, 'MISSING_DEPENDENCY_VERSION');
        assert.strictEqual(issues[0].path[0], 'dependencies');
        assert.strictEqual(issues[0].path[1], 0);
        assert.strictEqual(issues[0].path[2], 'version');
        return true;
      }
    );
  });

  it('should throw ZodError for empty dependency version', () => {
    assert.throws(
      () => BlueprintPackageManifestSchema.parse(INVALID_MANIFEST_EMPTY_DEPENDENCY_VERSION),
      (err) => {
        assert(err instanceof z.ZodError);
        const issues = err.issues;
        assert.strictEqual(issues[0].message, 'EMPTY_DEPENDENCY_VERSION');
        assert.strictEqual(issues[0].path[0], 'dependencies');
        assert.strictEqual(issues[0].path[1], 0);
        assert.strictEqual(issues[0].path[2], 'version');
        return true;
      }
    );
  });

  it('should throw ZodError when manifest contains secret-like fields', () => {
    assert.throws(
      () => BlueprintPackageManifestSchema.parse(INVALID_MANIFEST_CONTAINS_SECRETS),
      (err) => {
        assert(err instanceof z.ZodError);
        const issues = err.issues;
        assert.strictEqual(issues[0].message, 'FORBIDDEN_SECRET_FIELD');
        return true;
      }
    );
  });
});
