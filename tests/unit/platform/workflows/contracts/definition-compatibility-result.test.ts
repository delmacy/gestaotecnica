import { describe, it } from 'node:test';
import assert from 'node:assert';
import { z } from 'zod';
import { DefinitionCompatibilityResultSchema } from '../../../../../src/platform/workflows/contracts/definition-compatibility-result';
import {
  VALID_DEFINITION_COMPATIBILITY_RESULT,
  VALID_DEFINITION_COMPATIBILITY_RESULT_WITH_WARNINGS,
  VALID_DEFINITION_COMPATIBILITY_RESULT_WITH_BLOCKERS,
  INVALID_DEFINITION_COMPATIBILITY_RESULT_MISSING_COMPATIBLE,
  INVALID_DEFINITION_COMPATIBILITY_RESULT_MISSING_WARNINGS,
  INVALID_DEFINITION_COMPATIBILITY_RESULT_MISSING_BLOCKERS,
  INVALID_DEFINITION_COMPATIBILITY_RESULT_EMPTY_WARNING,
  INVALID_DEFINITION_COMPATIBILITY_RESULT_EMPTY_BLOCKER
} from '../../../../fixtures/platform/workflows/definition-compatibility-result.fixtures';

describe('DefinitionCompatibilityResultSchema', () => {
  it('should parse valid compatibility check result envelope', () => {
    assert.doesNotThrow(() => DefinitionCompatibilityResultSchema.parse(VALID_DEFINITION_COMPATIBILITY_RESULT));
  });

  it('should parse valid envelope with warnings', () => {
    assert.doesNotThrow(() => DefinitionCompatibilityResultSchema.parse(VALID_DEFINITION_COMPATIBILITY_RESULT_WITH_WARNINGS));
  });

  it('should parse valid envelope with blockers', () => {
    assert.doesNotThrow(() => DefinitionCompatibilityResultSchema.parse(VALID_DEFINITION_COMPATIBILITY_RESULT_WITH_BLOCKERS));
  });

  it('should throw on missing compatible flag', () => {
    assert.throws(() => DefinitionCompatibilityResultSchema.parse(INVALID_DEFINITION_COMPATIBILITY_RESULT_MISSING_COMPATIBLE), (err: unknown) => {
      assert(err instanceof z.ZodError);
      return err.issues.some(i => i.message === 'MISSING_COMPATIBLE_FLAG' || i.message === 'Required' || i.message === 'INVALID_COMPATIBLE_FLAG_TYPE' || i.code === 'invalid_type');
    });
  });

  it('should throw on missing warnings flag', () => {
    assert.throws(() => DefinitionCompatibilityResultSchema.parse(INVALID_DEFINITION_COMPATIBILITY_RESULT_MISSING_WARNINGS), (err: unknown) => {
      assert(err instanceof z.ZodError);
      return err.issues.some(i => i.message === 'MISSING_WARNINGS' || i.message === 'Required' || i.message === 'INVALID_WARNINGS_TYPE' || i.code === 'invalid_type');
    });
  });

  it('should throw on missing blockers flag', () => {
    assert.throws(() => DefinitionCompatibilityResultSchema.parse(INVALID_DEFINITION_COMPATIBILITY_RESULT_MISSING_BLOCKERS), (err: unknown) => {
      assert(err instanceof z.ZodError);
      return err.issues.some(i => i.message === 'MISSING_BLOCKERS' || i.message === 'Required' || i.message === 'INVALID_BLOCKERS_TYPE' || i.code === 'invalid_type');
    });
  });

  it('should throw on empty warning string', () => {
    assert.throws(() => DefinitionCompatibilityResultSchema.parse(INVALID_DEFINITION_COMPATIBILITY_RESULT_EMPTY_WARNING), (err: unknown) => {
      assert(err instanceof z.ZodError);
      return err.issues.some(i => i.message === 'EMPTY_WARNING');
    });
  });

  it('should throw on empty blocker string', () => {
    assert.throws(() => DefinitionCompatibilityResultSchema.parse(INVALID_DEFINITION_COMPATIBILITY_RESULT_EMPTY_BLOCKER), (err: unknown) => {
      assert(err instanceof z.ZodError);
      return err.issues.some(i => i.message === 'EMPTY_BLOCKER');
    });
  });
});
