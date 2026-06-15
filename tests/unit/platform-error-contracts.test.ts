import { test, describe } from "node:test";
import assert from "node:assert";
import {
  createPlatformError,
  isPlatformError,
  serializePlatformError,
  sanitizeUnknownError,
  PlatformErrorContext
} from "../../src/platform/errors";

describe("Platform Error Contracts", () => {
  const validWorkspaceId = "00000000-0000-0000-0000-000000000000";
  const fixedId = "err-123";
  const fixedTimestamp = "2023-01-01T00:00:00Z";
  const defaultContext: PlatformErrorContext = {
    id: fixedId,
    timestamp: fixedTimestamp,
  };

  test("should create a minimal valid platform error with explicit context", () => {
    const error = createPlatformError({
      code: "DOMAIN.RESOURCE.REASON",
      category: "domain",
      severity: "error",
      message: "Test error message",
    }, defaultContext);

    assert.strictEqual(error.id, fixedId);
    assert.strictEqual(error.timestamp, fixedTimestamp);
    assert.strictEqual(error.code, "DOMAIN.RESOURCE.REASON");
  });

  test("should be deterministic", () => {
    const input = {
      code: "DOMAIN.RESOURCE.REASON",
      category: "domain" as const,
      severity: "error" as const,
      message: "test",
    };
    const err1 = createPlatformError(input, defaultContext);
    const err2 = createPlatformError(input, defaultContext);
    assert.deepStrictEqual(err1, err2);
  });

  test("should fail for invalid category", () => {
    assert.throws(() => {
      createPlatformError({
        code: "TEST.TEST.TEST",
        category: "invalid_category" as any,
        severity: "error",
        message: "test",
      }, defaultContext);
    });
  });

  test("should fail for invalid severity", () => {
    assert.throws(() => {
      createPlatformError({
        code: "TEST.TEST.TEST",
        category: "domain",
        severity: "invalid_severity" as any,
        message: "test",
      }, defaultContext);
    });
  });

  test("should fail for invalid timestamp", () => {
    assert.throws(() => {
      createPlatformError({
        code: "TEST.TEST.TEST",
        category: "domain",
        severity: "error",
        message: "test",
      }, { ...defaultContext, timestamp: "invalid-date" });
    });
  });

  test("should fail for malformed code", () => {
    assert.throws(() => {
      createPlatformError({
        code: "INVALID_CODE",
        category: "domain",
        severity: "error",
        message: "test",
      }, defaultContext);
    });
  });

  test("should correctly identify a platform error", () => {
    const error = createPlatformError({
      code: "DOMAIN.RESOURCE.REASON",
      category: "domain",
      severity: "error",
      message: "test",
    }, defaultContext);

    assert.strictEqual(isPlatformError(error), true);
    assert.strictEqual(isPlatformError({}), false);
    assert.strictEqual(isPlatformError(null), false);
  });

  test("should serialize to JSON string after validation", () => {
    const error = createPlatformError({
      code: "DOMAIN.RESOURCE.REASON",
      category: "domain",
      severity: "error",
      message: "test",
    }, defaultContext);

    const serialized = serializePlatformError(error);
    const parsed = JSON.parse(serialized);
    assert.strictEqual(parsed.code, "DOMAIN.RESOURCE.REASON");

    assert.throws(() => serializePlatformError({ ...error, code: "INVALID" }));
  });

  describe("sanitizeUnknownError", () => {
    test("should sanitize Error object and preserve only safe fields", () => {
      const rawError = new Error("Original error");
      (rawError as any).status = 500;
      (rawError as any).secret = "password123";
      (rawError as any).stack = "Error: Original error\n at Object.test (test.ts:1:1)";

      const sanitized = sanitizeUnknownError(rawError, defaultContext);

      assert.strictEqual(sanitized.category, "unexpected");
      assert.strictEqual(sanitized.message, "Original error");
      assert.strictEqual(sanitized.details?.status, 500);
      assert.strictEqual(sanitized.details?.secret, undefined);
      assert.strictEqual((sanitized as any).stack, undefined);
      assert.strictEqual(JSON.stringify(sanitized).includes("STACK_REMOVED"), false);
    });

    test("should handle circular objects", () => {
      const circular: any = { message: "Circular" };
      circular.self = circular;

      const sanitized = sanitizeUnknownError(circular, defaultContext);
      assert.strictEqual(sanitized.message, "Circular");
      assert.strictEqual(sanitized.details?.self, undefined);
    });

    test("should handle BigInt, functions and symbols", () => {
      const input = {
        message: "Special values",
        big: BigInt(123),
        fn: () => {},
        sym: Symbol("test"),
        status: 200
      };
      const sanitized = sanitizeUnknownError(input, defaultContext);
      assert.strictEqual(sanitized.details?.status, 200);
      assert.strictEqual(sanitized.details?.big, undefined);
      assert.strictEqual(sanitized.details?.fn, undefined);
      assert.strictEqual(sanitized.details?.sym, undefined);
    });

    test("should handle throwing getters", () => {
      const input = {
        message: "Throwing getter",
        get status() { throw new Error("Boom"); }
      };
      const sanitized = sanitizeUnknownError(input, defaultContext);
      assert.strictEqual(sanitized.message, "Throwing getter");
      assert.strictEqual(sanitized.details?.status, undefined);
    });

    test("should preserve existing PlatformError identity and enrich context", () => {
      const existing = createPlatformError({
        code: "CUSTOM.ERROR.CODE",
        category: "domain",
        severity: "critical",
        message: "Existing",
      }, { id: "orig-id", timestamp: "2020-01-01T00:00:00Z" });

      const sanitized = sanitizeUnknownError(existing, {
        ...defaultContext,
        workspaceId: validWorkspaceId,
        correlationId: "new-corr"
      });

      assert.strictEqual(sanitized.id, "orig-id");
      assert.strictEqual(sanitized.timestamp, "2020-01-01T00:00:00Z");
      assert.strictEqual(sanitized.code, "CUSTOM.ERROR.CODE");
      assert.strictEqual(sanitized.workspaceId, validWorkspaceId);
      assert.strictEqual(sanitized.correlationId, "new-corr");
    });

    test("should remove secrets like password, token, api_key", () => {
      const input = {
        message: "Leakage test",
        password: "123",
        token: "abc",
        api_key: "xyz",
        authorization: "Bearer ...",
        status: 401,
        code: "INTERNAL"
      };
      const sanitized = sanitizeUnknownError(input, defaultContext);
      assert.strictEqual(sanitized.details?.code, "INTERNAL");
      // assert.strictEqual(sanitized.details?.status, undefined); // Not in SAFE_FIELDS
      assert.strictEqual(sanitized.details?.password, undefined);
      assert.strictEqual(sanitized.details?.token, undefined);

      // status IS in safe fields, but others are not.
      // Re-testing with safe fields that have sensitive keywords
      const input2 = {
        message: "Safe but sensitive",
        type: "password_reset", // 'type' is safe, but contains sensitive keyword?
                                // My implementation: !SENSITIVE_KEYWORDS.some(k => lowerKey.includes(k))
                                // Wait, the keyword check is on the KEY, not the value.
      };
      const sanitized2 = sanitizeUnknownError(input2, defaultContext);
      assert.strictEqual(sanitized2.details?.type, "password_reset");
      // If I had a field called 'authToken' it should be removed even if 'token' is not in SAFE_FIELDS?
      // Actually, my current isSafeKey requires it to be in SAFE_FIELDS AND NOT have sensitive keyword.
    });

    test("should remove stack traces from strings", () => {
      const input = "Error: fail at Object.run (index.js:1:1)";
      const sanitized = sanitizeUnknownError(input, defaultContext);
      assert.strictEqual(sanitized.message.includes("STACK_REMOVED"), true);
    });

    test("should handle null and undefined", () => {
      const sanitizedNull = sanitizeUnknownError(null, defaultContext);
      assert.strictEqual(sanitizedNull.category, "unexpected");

      const sanitizedUndefined = sanitizeUnknownError(undefined, defaultContext);
      assert.strictEqual(sanitizedUndefined.category, "unexpected");
    });

    test("should not mutate input and handle frozen objects", () => {
      const input = Object.freeze({ message: "test", status: 200 });
      assert.doesNotThrow(() => sanitizeUnknownError(input, defaultContext));
    });
  });
});
