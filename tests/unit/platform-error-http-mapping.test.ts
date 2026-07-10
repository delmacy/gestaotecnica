import { test, describe } from "node:test";
import assert from "node:assert";
import {
  mapPlatformErrorToHttpStatus,
  toPlatformErrorHttpBody,
  toPlatformErrorHttpResponse
} from "../../src/platform/errors/http-mapping";
import { PlatformErrorEnvelope } from "../../src/platform/errors/schema";

const baseError: PlatformErrorEnvelope = Object.freeze({
  id: "err_123",
  code: "TEST.ERR.CODE",
  category: "unexpected",
  severity: "error",
  message: "Internal technical message",
  timestamp: "2023-01-01T00:00:00Z",
});

describe("Platform Error HTTP Mapping", () => {
  describe("mapPlatformErrorToHttpStatus", () => {
    const mappings: Array<[PlatformErrorEnvelope["category"], number]> = [
      ["validation", 400],
      ["domain", 400],
      ["authentication", 401],
      ["authorization", 403],
      ["not_found", 404],
      ["conflict", 409],
      ["rate_limit", 429],
      ["integration", 502],
      ["infrastructure", 503],
      ["timeout", 504],
      ["unexpected", 500],
    ];

    for (const [category, expectedStatus] of mappings) {
      test(`should map ${category} to ${expectedStatus}`, () => {
        const error = { ...baseError, category };
        assert.strictEqual(mapPlatformErrorToHttpStatus(error), expectedStatus);
      });
    }

    test("should map null to 500", () => {
      assert.strictEqual(mapPlatformErrorToHttpStatus(null as unknown as PlatformErrorEnvelope), 500);
    });

    test("should map undefined to 500", () => {
      assert.strictEqual(mapPlatformErrorToHttpStatus(undefined as unknown as PlatformErrorEnvelope), 500);
    });

    test("should map unknown category to 500", () => {
      const error = { ...baseError, category: "unknown_category" as unknown as PlatformErrorEnvelope["category"] };
      assert.strictEqual(mapPlatformErrorToHttpStatus(error), 500);
    });

    test("should map empty object error to 500", () => {
      assert.strictEqual(mapPlatformErrorToHttpStatus({} as unknown as PlatformErrorEnvelope), 500);
    });
  });

  describe("toPlatformErrorHttpBody", () => {
    test("should redact message for unexpected error", () => {
      const error = { ...baseError, category: "unexpected" as const, message: "Secret DB Error" };
      const body = toPlatformErrorHttpBody(error);
      assert.strictEqual(body.error.message, "An unexpected error occurred.");
      assert.strictEqual(body.error.code, "TEST.ERR.CODE");
    });

    test("should redact message for authentication error", () => {
      const error = { ...baseError, category: "authentication" as const, message: "Invalid token: expired at X" };
      const body = toPlatformErrorHttpBody(error);
      assert.strictEqual(body.error.message, "Authentication failed.");
    });

    test("should expose message for validation error", () => {
      const error = { ...baseError, category: "validation" as const, message: "Field X is required" };
      const body = toPlatformErrorHttpBody(error);
      assert.strictEqual(body.error.message, "Field X is required");
    });

    test("should prefer userMessage for validation error if present", () => {
      const error = {
        ...baseError,
        category: "validation" as const,
        message: "Technical msg",
        userMessage: "Friendly msg"
      };
      const body = toPlatformErrorHttpBody(error);
      assert.strictEqual(body.error.message, "Friendly msg");
    });

    test("should preserve correlationId", () => {
      const error = { ...baseError, correlationId: "corr_abc" };
      const body = toPlatformErrorHttpBody(error);
      assert.strictEqual(body.error.correlationId, "corr_abc");
    });

    test("should handle missing correlationId", () => {
      const body = toPlatformErrorHttpBody(baseError);
      assert.strictEqual(Object.hasOwn(body.error, "correlationId"), false);
    });

    test("should preserve retryable from retry instruction", () => {
      const error = { ...baseError, retry: { retryable: true } };
      const body = toPlatformErrorHttpBody(error);
      assert.strictEqual(body.error.retryable, true);
      assert.strictEqual(Object.hasOwn(body.error, "retryable"), true);
    });

    test("should omit retryable when retry instruction is absent", () => {
      const body = toPlatformErrorHttpBody(baseError);
      assert.strictEqual(Object.hasOwn(body.error, "retryable"), false);
    });

    test("should preserve false when retryable is false", () => {
      const error = { ...baseError, retry: { retryable: false } };
      const body = toPlatformErrorHttpBody(error);
      assert.strictEqual(body.error.retryable, false);
      assert.strictEqual(Object.hasOwn(body.error, "retryable"), true);
    });

    test("should map null to unexpected fallback body", () => {
      const body = toPlatformErrorHttpBody(null as unknown as PlatformErrorEnvelope);
      assert.strictEqual(body.error.code, "UNEXPECTED_ERROR");
      assert.strictEqual(body.error.category, "unexpected");
      assert.strictEqual(body.error.message, "An unexpected error occurred.");
    });

    test("should map undefined to unexpected fallback body", () => {
      const body = toPlatformErrorHttpBody(undefined as unknown as PlatformErrorEnvelope);
      assert.strictEqual(body.error.code, "UNEXPECTED_ERROR");
      assert.strictEqual(body.error.category, "unexpected");
      assert.strictEqual(body.error.message, "An unexpected error occurred.");
    });

    test("should map empty object error to unexpected fallback body", () => {
      const body = toPlatformErrorHttpBody({} as unknown as PlatformErrorEnvelope);
      assert.strictEqual(body.error.code, "UNEXPECTED_ERROR");
      assert.strictEqual(body.error.category, "unexpected");
      assert.strictEqual(body.error.message, "An unexpected error occurred.");
    });

    test("should not include sensitive fields (details, source, validationIssues)", () => {
      // Use unknown and cast to avoid any
      const errorWithSensitives = {
        ...baseError,
        details: { sql: "SELECT * FROM users" },
        source: { pointer: "/data/id" },
        validationIssues: [{ code: "too_short", message: "too short", path: ["name"] }]
      } as unknown as PlatformErrorEnvelope;

      const body = toPlatformErrorHttpBody(errorWithSensitives);

      const keys = Object.keys(body.error);
      assert.ok(!keys.includes("details"));
      assert.ok(!keys.includes("source"));
      assert.ok(!keys.includes("validationIssues"));
    });
  });

  describe("toPlatformErrorHttpResponse", () => {
    test("should combine status and body", () => {
      const error = { ...baseError, category: "not_found" as const, message: "User not found" };
      const response = toPlatformErrorHttpResponse(error);
      assert.strictEqual(response.status, 404);
      assert.strictEqual(response.body.error.message, "User not found");
      assert.strictEqual(response.body.error.code, "TEST.ERR.CODE");
    });
  });

  describe("Purity and Immutability", () => {
    test("should not mutate the input error", () => {
      const error = JSON.parse(JSON.stringify(baseError));
      Object.freeze(error);
      assert.doesNotThrow(() => toPlatformErrorHttpBody(error));
    });

    test("should be deterministic", () => {
      const body1 = toPlatformErrorHttpBody(baseError);
      const body2 = toPlatformErrorHttpBody(baseError);
      assert.deepStrictEqual(body1, body2);
    });
  });
});
