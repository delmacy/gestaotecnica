import { test, describe } from "node:test";
import assert from "node:assert";
import {
  toNextPlatformErrorResponse,
  toNextUnknownErrorResponse
} from "../../src/platform/errors/next-response-adapter";
import { PlatformErrorEnvelope } from "../../src/platform/errors/schema";
import { PlatformErrorContext } from "../../src/platform/errors/factory";

const baseError: PlatformErrorEnvelope = Object.freeze({
  id: "err_123",
  code: "TEST.ERR.CODE",
  category: "unexpected",
  severity: "error",
  message: "Internal technical message",
  timestamp: "2023-01-01T00:00:00Z",
});

const baseContext: PlatformErrorContext = {
  id: "err_new",
  timestamp: "2023-01-01T00:00:00Z",
};

describe("Platform Error Next.js Adapter", () => {
  describe("toNextPlatformErrorResponse", () => {
    test("should return 400 for validation error", async () => {
      const error = { ...baseError, category: "validation" as const, message: "Invalid input" };
      const response = toNextPlatformErrorResponse(error);

      assert.strictEqual(response.status, 400);
      const body = await response.json();
      assert.strictEqual(body.error.message, "Invalid input");
      assert.strictEqual(response.headers.get("Content-Type"), "application/json");
    });

    test("should return 500 for unexpected error and redact message", async () => {
      const error = { ...baseError, category: "unexpected" as const, message: "Secret DB Error" };
      const response = toNextPlatformErrorResponse(error);

      assert.strictEqual(response.status, 500);
      const body = await response.json();
      assert.strictEqual(body.error.message, "An unexpected error occurred.");
    });

    test("should include X-Correlation-Id header if present", () => {
      const error = { ...baseError, correlationId: "corr_abc" };
      const response = toNextPlatformErrorResponse(error);
      assert.strictEqual(response.headers.get("X-Correlation-Id"), "corr_abc");
    });

    test("should NOT include X-Correlation-Id header if it contains CRLF", () => {
      const error = { ...baseError, correlationId: "corr\r\nabc" };
      const response = toNextPlatformErrorResponse(error);
      assert.strictEqual(response.headers.has("X-Correlation-Id"), false);
    });

    test("should NOT include X-Correlation-Id header if absent", () => {
      const response = toNextPlatformErrorResponse(baseError);
      assert.strictEqual(response.headers.has("X-Correlation-Id"), false);
    });

    test("should preserve retryable in body", async () => {
      const error = { ...baseError, retry: { retryable: true } };
      const response = toNextPlatformErrorResponse(error);
      const body = await response.json();
      assert.strictEqual(body.error.retryable, true);
    });

    test("should NOT include internal details in body", async () => {
      // Use narrow cast to avoid 'any'
      const error = {
        ...baseError,
        details: { internal: "data" },
        metadata: { secret: "true" }
      } as unknown as PlatformErrorEnvelope;

      const response = toNextPlatformErrorResponse(error);
      const body = await response.json();

      // Verification
      assert.strictEqual(Object.hasOwn(body.error, "details"), false);
      assert.strictEqual(Object.hasOwn(body.error, "metadata"), false);
    });
  });

  describe("toNextUnknownErrorResponse", () => {
    test("should handle Error object", async () => {
      const error = new Error("Something went wrong");
      const response = toNextUnknownErrorResponse(error, baseContext);

      assert.strictEqual(response.status, 500);
      const body = await response.json();
      assert.strictEqual(body.error.code, "UNEXPECTED.SERVER.ERROR");
      assert.strictEqual(body.error.message, "An unexpected error occurred.");
      // We don't check the body details here as they are redacted in toPlatformErrorHttpBody
    });

    test("should handle string input", async () => {
      const response = toNextUnknownErrorResponse("Fatal error", baseContext);
      assert.strictEqual(response.status, 500);
      const body = await response.json();
      assert.strictEqual(body.error.message, "An unexpected error occurred.");
    });

    test("should handle null input", async () => {
      const response = toNextUnknownErrorResponse(null, baseContext);
      assert.strictEqual(response.status, 500);
      const body = await response.json();
      assert.strictEqual(body.error.message, "An unexpected error occurred.");
    });

    test("should handle hostile object with getter that throws", async () => {
      const hostile = {
        get message() { throw new Error("hostile"); }
      };
      const response = toNextUnknownErrorResponse(hostile, baseContext);
      assert.strictEqual(response.status, 500);
      const body = await response.json();
      assert.strictEqual(body.error.message, "An unexpected error occurred.");
    });

    test("should handle number input", async () => {
      const response = toNextUnknownErrorResponse(42, baseContext);
      assert.strictEqual(response.status, 500);
      const body = await response.json();
      assert.strictEqual(body.error.message, "An unexpected error occurred.");
    });

    test("should handle revoked proxy", async () => {
      const { proxy, revoke } = Proxy.revocable({}, {});
      revoke();

      const response = toNextUnknownErrorResponse(proxy, baseContext);
      assert.strictEqual(response.status, 500);
      const body = await response.json();
      assert.strictEqual(body.error.message, "An unexpected error occurred.");
    });
  });
});
