import { describe, it } from 'node:test';
import assert from 'node:assert';
import { BlueprintImportPreflightResultEnvelopeSchema } from '../../../../../src/platform/blueprints/contracts/blueprint-import-preflight-result-envelope';
import {
  validCompatibleResult,
  validIncompatibleResult,
  invalidMissingFields,
  invalidEmptyStringInArrays
} from '../../../../fixtures/platform/blueprints/blueprint-import-preflight-result-envelope.fixtures';

describe('BlueprintImportPreflightResultEnvelope Contract', () => {
  it('should successfully parse a valid compatible result', () => {
    const result = BlueprintImportPreflightResultEnvelopeSchema.safeParse(validCompatibleResult);
    assert.strictEqual(result.success, true);
    if (result.success) {
      assert.strictEqual(result.data.compatible, true);
      assert.strictEqual(result.data.warnings.length, 0);
      assert.strictEqual(result.data.blockers.length, 0);
      assert.strictEqual(result.data.requiredApprovals.length, 0);
    }
  });

  it('should successfully parse a valid incompatible result with blockers and approvals', () => {
    const result = BlueprintImportPreflightResultEnvelopeSchema.safeParse(validIncompatibleResult);
    assert.strictEqual(result.success, true);
    if (result.success) {
      assert.strictEqual(result.data.compatible, false);
      assert.strictEqual(result.data.warnings.length, 1);
      assert.strictEqual(result.data.blockers.length, 1);
      assert.strictEqual(result.data.requiredApprovals.length, 2);
      assert.strictEqual(result.data.requiredApprovals[0], 'SECURITY_TEAM');
    }
  });

  it('should fail to parse if arrays are missing', () => {
    const result = BlueprintImportPreflightResultEnvelopeSchema.safeParse(invalidMissingFields);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      const warningError = result.error.issues.find(i => i.message === 'MISSING_WARNINGS');
      const blockerError = result.error.issues.find(i => i.message === 'MISSING_BLOCKERS');
      const approvalError = result.error.issues.find(i => i.message === 'MISSING_REQUIRED_APPROVALS');
      assert.ok(warningError);
      assert.ok(blockerError);
      assert.ok(approvalError);
    }
  });

  it('should fail to parse if arrays contain empty strings', () => {
    const result = BlueprintImportPreflightResultEnvelopeSchema.safeParse(invalidEmptyStringInArrays);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      const warningError = result.error.issues.find(i => i.message === 'EMPTY_WARNING');
      const blockerError = result.error.issues.find(i => i.message === 'EMPTY_BLOCKER');
      const approvalError = result.error.issues.find(i => i.message === 'EMPTY_REQUIRED_APPROVAL');
      assert.ok(warningError);
      assert.ok(blockerError);
      assert.ok(approvalError);
    }
  });
});
