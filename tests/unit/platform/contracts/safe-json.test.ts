import { describe, it } from 'node:test';
import * as assert from 'node:assert/strict';
import { checkSafeJsonValue } from '../../../../src/platform/contracts/safe-json';

describe('Safe JSON Operational Boundaries', () => {
  it('should reject Date objects as UNSUPPORTED_BUILTIN', () => {
    const result = checkSafeJsonValue(new Date());
    assert.deepEqual(result, { isSafe: false, reason: 'UNSUPPORTED_BUILTIN' });
  });

  it('should accept undefined', () => {
    const result = checkSafeJsonValue(undefined);
    assert.deepEqual(result, { isSafe: true });
  });

  it('should accept null', () => {
    const result = checkSafeJsonValue(null);
    assert.deepEqual(result, { isSafe: true });
  });

  it('should accept nested records and mixed primitive types', () => {
    const payload = {
      a: { b: 1 },
      c: undefined,
      d: null,
      e: 'string',
      f: true,
      g: [1, 2, { h: 3 }]
    };
    const result = checkSafeJsonValue(payload);
    assert.deepEqual(result, { isSafe: true });
  });

  it('should reject cycles', () => {
    const obj: Record<string, unknown> = { a: 1 };
    obj.b = obj;
    const result = checkSafeJsonValue(obj);
    assert.deepEqual(result, { isSafe: false, reason: 'CYCLE' });
  });

  it('should reject functions', () => {
    const result = checkSafeJsonValue(() => {});
    assert.deepEqual(result, { isSafe: false, reason: 'FUNCTION' });
  });
});
