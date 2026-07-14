import { describe, it } from 'node:test';
import assert from 'node:assert';
import { BlueprintExportResultEnvelopeSchema } from '../../../../src/platform/blueprints/contracts/blueprint-export-result-envelope';
import {
  VALID_EXPORT_RESULT_ENVELOPE,
  VALID_EXPORT_RESULT_ENVELOPE_WITH_WARNINGS,
  VALID_EXPORT_RESULT_ENVELOPE_WITH_BLOCKERS,
  INVALID_EXPORT_RESULT_ENVELOPE_MISSING_ARTIFACT_METADATA,
  INVALID_EXPORT_RESULT_ENVELOPE_MISSING_WARNINGS,
  INVALID_EXPORT_RESULT_ENVELOPE_MISSING_BLOCKERS,
  INVALID_EXPORT_RESULT_ENVELOPE_EMPTY_WARNING,
  INVALID_EXPORT_RESULT_ENVELOPE_EMPTY_BLOCKER
} from '../../../fixtures/platform/blueprints/blueprint-export-result-envelope.fixtures';

describe('BlueprintExportResultEnvelopeSchema', () => {
  it('should validate a correct export result envelope', () => {
    const result = BlueprintExportResultEnvelopeSchema.safeParse(VALID_EXPORT_RESULT_ENVELOPE);
    assert.strictEqual(result.success, true);
  });

  it('should validate an export result envelope with warnings', () => {
    const result = BlueprintExportResultEnvelopeSchema.safeParse(VALID_EXPORT_RESULT_ENVELOPE_WITH_WARNINGS);
    assert.strictEqual(result.success, true);
  });

  it('should validate an export result envelope with blockers', () => {
    const result = BlueprintExportResultEnvelopeSchema.safeParse(VALID_EXPORT_RESULT_ENVELOPE_WITH_BLOCKERS);
    assert.strictEqual(result.success, true);
  });

  it('should reject missing artifactMetadata', () => {
    const result = BlueprintExportResultEnvelopeSchema.safeParse(INVALID_EXPORT_RESULT_ENVELOPE_MISSING_ARTIFACT_METADATA);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.strictEqual(result.error.issues[0].message, "MISSING_ARTIFACT_METADATA");
    }
  });

  it('should reject missing warnings', () => {
    const result = BlueprintExportResultEnvelopeSchema.safeParse(INVALID_EXPORT_RESULT_ENVELOPE_MISSING_WARNINGS);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.strictEqual(result.error.issues[0].message, "MISSING_WARNINGS");
    }
  });

  it('should reject missing blockers', () => {
    const result = BlueprintExportResultEnvelopeSchema.safeParse(INVALID_EXPORT_RESULT_ENVELOPE_MISSING_BLOCKERS);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.strictEqual(result.error.issues[0].message, "MISSING_BLOCKERS");
    }
  });

  it('should reject empty warning strings', () => {
    const result = BlueprintExportResultEnvelopeSchema.safeParse(INVALID_EXPORT_RESULT_ENVELOPE_EMPTY_WARNING);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.strictEqual(result.error.issues[0].message, "EMPTY_WARNING");
    }
  });

  it('should reject empty blocker strings', () => {
    const result = BlueprintExportResultEnvelopeSchema.safeParse(INVALID_EXPORT_RESULT_ENVELOPE_EMPTY_BLOCKER);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.strictEqual(result.error.issues[0].message, "EMPTY_BLOCKER");
    }
  });
});
