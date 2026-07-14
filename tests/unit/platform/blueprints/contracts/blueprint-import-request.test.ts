import { describe, it } from 'node:test';
import assert from 'node:assert';
import { BlueprintImportRequestSchema } from '../../../../../src/platform/blueprints/contracts/blueprint-import-request';
import {
  validBlueprintImportRequest,
  executionBlueprintImportRequest,
  invalidBlueprintImportRequestEmptyChecksum,
  invalidBlueprintImportRequestInvalidChecksumShape,
  invalidBlueprintImportRequestEmptyWorkspace
} from '../../../../fixtures/platform/blueprints/blueprint-import-request.fixtures';

describe('BlueprintImportRequest Contract', () => {
  it('should successfully parse a valid request (dryRun=true)', () => {
    const result = BlueprintImportRequestSchema.safeParse(validBlueprintImportRequest);
    assert.strictEqual(result.success, true);
    if (result.success) {
        assert.strictEqual(result.data.dryRun, true);
    }
  });

  it('should successfully parse a valid request (dryRun=false)', () => {
    const result = BlueprintImportRequestSchema.safeParse(executionBlueprintImportRequest);
    assert.strictEqual(result.success, true);
    if (result.success) {
        assert.strictEqual(result.data.dryRun, false);
    }
  });

  it('should apply safe default for dryRun if missing', () => {
     const reqWithoutDryRun = {
        sourceMetadata: {},
        checksum: 'sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        targetWorkspace: 'workspace-a'
     };
     const result = BlueprintImportRequestSchema.safeParse(reqWithoutDryRun);
     assert.strictEqual(result.success, true);
     if (result.success) {
         assert.strictEqual(result.data.dryRun, true, 'dryRun should default to true');
     }
  });

  it('should reject a request with an empty checksum', () => {
    const result = BlueprintImportRequestSchema.safeParse(invalidBlueprintImportRequestEmptyChecksum);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.strictEqual(result.error.issues[0].message, 'EMPTY_CHECKSUM');
    }
  });

  it('should reject a request with an invalid checksum shape', () => {
    const result = BlueprintImportRequestSchema.safeParse(invalidBlueprintImportRequestInvalidChecksumShape);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.strictEqual(result.error.issues[0].message, 'INVALID_CHECKSUM_SHAPE');
    }
  });

  it('should reject a request with an empty targetWorkspace', () => {
    const result = BlueprintImportRequestSchema.safeParse(invalidBlueprintImportRequestEmptyWorkspace);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.strictEqual(result.error.issues[0].message, 'EMPTY_TARGET_WORKSPACE');
    }
  });
});
