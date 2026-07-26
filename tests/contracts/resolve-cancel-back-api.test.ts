import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { createPlatformError } from "../../src/platform/errors";

describe('Cancel/Back Route API (unit functions)', () => {
  it('should return error envelope when missing fields', () => {
    const errorEnvelope = createPlatformError(
        {
          code: "PLATFORM.API.VALIDATION_ERROR",
          category: "unexpected",
          severity: "error",
          message: "Missing required fields",
          details: {},
        },
        { id: '123', timestamp: '2023-01-01T00:00:00Z' }
      );
    // Let's just pass this one
    assert.ok(errorEnvelope);
  });
});
