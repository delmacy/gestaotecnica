import { describe, it } from 'node:test';
import assert from 'node:assert';
import { z } from 'zod';
import { BlueprintCompatibilityCheckResultEnvelopeSchema } from '../../../../src/platform/blueprints/contracts/blueprint-compatibility-check-result-envelope';
import {
  VALID_COMPATIBILITY_CHECK_RESULT_ENVELOPE,
  VALID_COMPATIBILITY_CHECK_RESULT_ENVELOPE_WITH_WARNINGS,
  VALID_COMPATIBILITY_CHECK_RESULT_ENVELOPE_WITH_BLOCKERS,
  INVALID_COMPATIBILITY_CHECK_RESULT_ENVELOPE_MISSING_COMPATIBLE,
  INVALID_COMPATIBILITY_CHECK_RESULT_ENVELOPE_MISSING_WARNINGS,
  INVALID_COMPATIBILITY_CHECK_RESULT_ENVELOPE_MISSING_BLOCKERS,
  INVALID_COMPATIBILITY_CHECK_RESULT_ENVELOPE_EMPTY_WARNING,
  INVALID_COMPATIBILITY_CHECK_RESULT_ENVELOPE_EMPTY_BLOCKER
} from '../../../fixtures/platform/blueprints/blueprint-compatibility-check-result-envelope.fixtures';

describe('BlueprintCompatibilityCheckResultEnvelopeSchema', () => {
  it('should parse valid compatibility check result envelope', () => {
    assert.doesNotThrow(() => BlueprintCompatibilityCheckResultEnvelopeSchema.parse(VALID_COMPATIBILITY_CHECK_RESULT_ENVELOPE));
  });

  it('should parse valid envelope with warnings', () => {
    assert.doesNotThrow(() => BlueprintCompatibilityCheckResultEnvelopeSchema.parse(VALID_COMPATIBILITY_CHECK_RESULT_ENVELOPE_WITH_WARNINGS));
  });

  it('should parse valid envelope with blockers', () => {
    assert.doesNotThrow(() => BlueprintCompatibilityCheckResultEnvelopeSchema.parse(VALID_COMPATIBILITY_CHECK_RESULT_ENVELOPE_WITH_BLOCKERS));
  });

  it('should throw on missing compatible flag', () => {
    assert.throws(() => BlueprintCompatibilityCheckResultEnvelopeSchema.parse(INVALID_COMPATIBILITY_CHECK_RESULT_ENVELOPE_MISSING_COMPATIBLE), (err: unknown) => {
      assert(err instanceof z.ZodError);
      return err.issues.some(i => i.message === 'MISSING_COMPATIBLE_FLAG' || i.message === 'Required' || i.message === 'INVALID_COMPATIBLE_FLAG_TYPE' || i.code === 'invalid_type');
    });
  });

  it('should throw on missing warnings flag', () => {
    assert.throws(() => BlueprintCompatibilityCheckResultEnvelopeSchema.parse(INVALID_COMPATIBILITY_CHECK_RESULT_ENVELOPE_MISSING_WARNINGS), (err: unknown) => {
      assert(err instanceof z.ZodError);
      return err.issues.some(i => i.message === 'MISSING_WARNINGS' || i.message === 'Required' || i.message === 'INVALID_WARNINGS_TYPE' || i.code === 'invalid_type');
    });
  });

  it('should throw on missing blockers flag', () => {
    assert.throws(() => BlueprintCompatibilityCheckResultEnvelopeSchema.parse(INVALID_COMPATIBILITY_CHECK_RESULT_ENVELOPE_MISSING_BLOCKERS), (err: unknown) => {
      assert(err instanceof z.ZodError);
      return err.issues.some(i => i.message === 'MISSING_BLOCKERS' || i.message === 'Required' || i.message === 'INVALID_BLOCKERS_TYPE' || i.code === 'invalid_type');
    });
  });

  it('should throw on empty warning string', () => {
    assert.throws(() => BlueprintCompatibilityCheckResultEnvelopeSchema.parse(INVALID_COMPATIBILITY_CHECK_RESULT_ENVELOPE_EMPTY_WARNING), (err: unknown) => {
      assert(err instanceof z.ZodError);
      return err.issues.some(i => i.message === 'EMPTY_WARNING');
    });
  });

  it('should throw on empty blocker string', () => {
    assert.throws(() => BlueprintCompatibilityCheckResultEnvelopeSchema.parse(INVALID_COMPATIBILITY_CHECK_RESULT_ENVELOPE_EMPTY_BLOCKER), (err: unknown) => {
      assert(err instanceof z.ZodError);
      return err.issues.some(i => i.message === 'EMPTY_BLOCKER');
    });
  });
});
