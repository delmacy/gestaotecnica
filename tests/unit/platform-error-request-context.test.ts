import { test } from "node:test";
import assert from "node:assert";
import { createPlatformErrorContextFromRequest } from "../../src/platform/errors/request-context";
import { PlatformErrorContext } from "../../src/platform/errors/factory";
import { ZodError } from "zod";

test("PlatformErrorRequestContext - request without correlationId", () => {
  const request = new Request("http://localhost/api");
  const context = createPlatformErrorContextFromRequest(request, {
    createId: () => "test-id",
    now: () => "2024-01-01T00:00:00.000Z",
  });

  assert.strictEqual(context.id, "test-id");
  assert.strictEqual(context.timestamp, "2024-01-01T00:00:00.000Z");
  assert.strictEqual(context.correlationId, undefined);
});

test("PlatformErrorRequestContext - valid correlationId", () => {
  const request = new Request("http://localhost/api", {
    headers: { "x-correlation-id": "corr-123" },
  });
  const context = createPlatformErrorContextFromRequest(request);

  assert.strictEqual(context.correlationId, "corr-123");
});

test("PlatformErrorRequestContext - correlationId with CRLF is rejected", () => {
  const mockRequest = {
    headers: {
      get: (name: string) => name === "x-correlation-id" ? "corr-123\r\nInjected: value" : null
    }
  } as unknown as Request;

  const context = createPlatformErrorContextFromRequest(mockRequest);

  assert.strictEqual(context.correlationId, undefined);
});

test("PlatformErrorRequestContext - correlationId too long is rejected", () => {
  const longId = "a".repeat(256);
  const request = new Request("http://localhost/api", {
    headers: { "x-correlation-id": longId },
  });
  const context = createPlatformErrorContextFromRequest(request);

  assert.strictEqual(context.correlationId, undefined);
});

test("PlatformErrorRequestContext - correlationId trimmed and valid", () => {
  const request = new Request("http://localhost/api", {
    headers: { "x-correlation-id": "  corr-123  " },
  });
  const context = createPlatformErrorContextFromRequest(request);

  assert.strictEqual(context.correlationId, "corr-123");
});

test("PlatformErrorRequestContext - deterministic with injected dependencies", () => {
  const request = new Request("http://localhost/api");
  const deps = {
    createId: () => "static-id",
    now: () => "2024-01-01T00:00:00.000Z",
  };

  const context1 = createPlatformErrorContextFromRequest(request, deps);
  const context2 = createPlatformErrorContextFromRequest(request, deps);

  assert.deepStrictEqual(context1, context2);
  assert.strictEqual(context1.id, "static-id");
  assert.strictEqual(context1.timestamp, "2024-01-01T00:00:00.000Z");
});

test("PlatformErrorRequestContext - sensitive headers are not copied", () => {
  const request = new Request("http://localhost/api", {
    headers: {
      "x-correlation-id": "corr-123",
      "Authorization": "Bearer secret",
      "Cookie": "session=123",
    },
  });
  const context = createPlatformErrorContextFromRequest(request);

  assert.strictEqual(context.correlationId, "corr-123");

  // Verify context only contains expected keys
  const keys = Object.keys(context);
  assert.ok(keys.includes("id"));
  assert.ok(keys.includes("timestamp"));
  assert.ok(keys.includes("correlationId"));
  assert.ok(!keys.includes("Authorization"));
  assert.ok(!keys.includes("authorization"));
  assert.ok(!keys.includes("Cookie"));
  assert.ok(!keys.includes("cookie"));
});

test("PlatformErrorRequestContext - request is not mutated", () => {
  const headers = new Headers({ "x-correlation-id": "corr-123" });
  const request = new Request("http://localhost/api", { headers });

  createPlatformErrorContextFromRequest(request);

  assert.strictEqual(request.headers.get("x-correlation-id"), "corr-123");
});

test("PlatformErrorRequestContext - invalid timestamp rejected (throws)", () => {
  const request = new Request("http://localhost/api");
  assert.throws(() => {
    createPlatformErrorContextFromRequest(request, {
      now: () => "invalid-date",
    });
  }, (err) => err instanceof ZodError);
});

test("PlatformErrorRequestContext - invalid generated id rejected (throws)", () => {
  const request = new Request("http://localhost/api");
  assert.throws(() => {
    createPlatformErrorContextFromRequest(request, {
      createId: () => "", // EntityIdSchema requires min(1)
    });
  }, (err) => err instanceof ZodError);
});

test("PlatformErrorRequestContext - valid injected values accepted", () => {
  const request = new Request("http://localhost/api");
  const context = createPlatformErrorContextFromRequest(request, {
    createId: () => "valid-id",
    now: () => "2024-05-20T10:00:00Z",
  });

  assert.strictEqual(context.id, "valid-id");
  assert.strictEqual(context.timestamp, "2024-05-20T10:00:00Z");
});

test("PlatformErrorRequestContext - frozen context", () => {
  const request = new Request("http://localhost/api");
  const context = createPlatformErrorContextFromRequest(request) as PlatformErrorContext;

  assert.throws(() => {
    // @ts-expect-error - testing readonly enforcement
    context.id = "new-id";
  }, /TypeError/);
});
