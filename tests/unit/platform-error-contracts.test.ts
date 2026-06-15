import { test, describe } from "node:test";
import assert from "node:assert";
import {
  createPlatformError,
  isPlatformError,
  serializePlatformError,
  sanitizeUnknownError,
  PlatformErrorEnvelope
} from "../../src/platform/errors";

describe("Platform Error Contracts", () => {
  const validWorkspaceId = "00000000-0000-0000-0000-000000000000";

  test("should create a minimal valid platform error", () => {
    const error = createPlatformError({
      code: "DOMAIN.RESOURCE.REASON",
      category: "domain",
      severity: "error",
      message: "Test error message",
    });

    assert.ok(error.id);
    assert.strictEqual(error.code, "DOMAIN.RESOURCE.REASON");
    assert.strictEqual(error.category, "domain");
    assert.strictEqual(error.severity, "error");
    assert.strictEqual(error.message, "Test error message");
    assert.ok(error.timestamp);
  });

  test("should create a complete valid platform error", () => {
    const error = createPlatformError({
      id: "err-123",
      code: "VALIDATION.FORM.INVALID_FIELD",
      category: "validation",
      severity: "warning",
      message: "Invalid field",
      userMessage: "Por favor, verifique o campo.",
      timestamp: "2023-01-01T00:00:00Z",
      workspaceId: validWorkspaceId,
      correlationId: "corr-123",
      causationId: "caus-123",
      source: { pointer: "/data/name", component: "Form" },
      details: { field: "name" },
      validationIssues: [{ path: ["name"], code: "required", message: "Name is required" }],
      retry: { retryable: false },
      metadata: { env: "test" },
    });

    assert.strictEqual(error.id, "err-123");
    assert.strictEqual(error.code, "VALIDATION.FORM.INVALID_FIELD");
    assert.deepStrictEqual(error.validationIssues, [{ path: ["name"], code: "required", message: "Name is required" }]);
  });

  test("should fail for invalid category", () => {
    assert.throws(() => {
      createPlatformError({
        code: "TEST.TEST.TEST",
        category: "invalid_category" as any,
        severity: "error",
        message: "test",
      });
    });
  });

  test("should fail for invalid severity", () => {
    assert.throws(() => {
      createPlatformError({
        code: "TEST.TEST.TEST",
        category: "domain",
        severity: "invalid_severity" as any,
        message: "test",
      });
    });
  });

  test("should fail for invalid timestamp", () => {
    assert.throws(() => {
      createPlatformError({
        code: "TEST.TEST.TEST",
        category: "domain",
        severity: "error",
        message: "test",
        timestamp: "invalid-date",
      });
    });
  });

  test("should fail for malformed code", () => {
    assert.throws(() => {
      createPlatformError({
        code: "INVALID_CODE",
        category: "domain",
        severity: "error",
        message: "test",
      });
    });
  });

  test("should correctly identify a platform error", () => {
    const error = createPlatformError({
      code: "DOMAIN.RESOURCE.REASON",
      category: "domain",
      severity: "error",
      message: "test",
    });

    assert.strictEqual(isPlatformError(error), true);
    assert.strictEqual(isPlatformError({}), false);
    assert.strictEqual(isPlatformError(null), false);
  });

  test("should serialize to JSON string", () => {
    const error = createPlatformError({
      code: "DOMAIN.RESOURCE.REASON",
      category: "domain",
      severity: "error",
      message: "test",
    });

    const serialized = serializePlatformError(error);
    const parsed = JSON.parse(serialized);
    assert.strictEqual(parsed.code, "DOMAIN.RESOURCE.REASON");
  });

  describe("sanitizeUnknownError", () => {
    test("should sanitize Error object without leaking stack", () => {
      const rawError = new Error("Original error");
      const sanitized = sanitizeUnknownError(rawError);

      assert.strictEqual(sanitized.category, "unexpected");
      assert.strictEqual(sanitized.message, "Original error");
      assert.strictEqual((sanitized as any).stack, undefined);
    });

    test("should sanitize string", () => {
      const sanitized = sanitizeUnknownError("Some string error");
      assert.strictEqual(sanitized.message, "Some string error");
    });

    test("should sanitize unknown object", () => {
      const sanitized = sanitizeUnknownError({ some: "data", message: "Object error" });
      assert.strictEqual(sanitized.message, "Object error");
      assert.deepStrictEqual(sanitized.details?.raw, { some: "data", message: "Object error" });
    });

    test("should handle null and undefined", () => {
      const sanitizedNull = sanitizeUnknownError(null);
      assert.strictEqual(sanitizedNull.category, "unexpected");

      const sanitizedUndefined = sanitizeUnknownError(undefined);
      assert.strictEqual(sanitizedUndefined.category, "unexpected");
    });

    test("should preserve workspaceId and correlationId", () => {
      const context = { workspaceId: validWorkspaceId, correlationId: "corr-456" };
      const sanitized = sanitizeUnknownError("error", context);

      assert.strictEqual(sanitized.workspaceId, validWorkspaceId);
      assert.strictEqual(sanitized.correlationId, "corr-456");
    });

    test("should be deterministic and not mutate input", () => {
      const input = { message: "test" };
      const inputCopy = JSON.parse(JSON.stringify(input));

      sanitizeUnknownError(input);

      assert.deepStrictEqual(input, inputCopy);
    });
  });
});
