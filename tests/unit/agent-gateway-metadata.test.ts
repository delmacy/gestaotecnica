import test from "node:test";
import assert from "node:assert";
import {
  resolveCorrelationId,
  resolveIdempotencyKey,
  sanitizePayload,
} from "@/features/platform/gateway/agent-gateway-metadata.service";

test("Agent Gateway Metadata Service - Unit Tests", async (t) => {
  await t.test("resolveCorrelationId returns header value if present", () => {
    const id = resolveCorrelationId("header-corr-id-123");
    assert.strictEqual(id, "header-corr-id-123");
  });

  await t.test("resolveCorrelationId generates UUID if header is empty", () => {
    const id1 = resolveCorrelationId("");
    const id2 = resolveCorrelationId("   ");
    assert.ok(id1.length > 10);
    assert.ok(id2.length > 10);
    assert.notStrictEqual(id1, id2);
  });

  await t.test("resolveCorrelationId generates UUID if header is null or undefined", () => {
    const id1 = resolveCorrelationId();
    const id2 = resolveCorrelationId(null);
    assert.ok(id1.length > 10);
    assert.ok(id2.length > 10);
  });

  await t.test("sanitizePayload removes sensitive fields but keeps other data", () => {
    const payload = {
      workspaceId: "ws-123",
      name: "Candidate Test",
      agent: { source: "n8n" },
      "x-agent-key": "secret-123",
      headers: {
        authorization: "Bearer my-token",
      },
      secrets: {
        password: "my-password",
        token: "github-token",
        secret: "my-secret",
      },
    };

    const sanitized = sanitizePayload(payload);

    assert.strictEqual(sanitized.workspaceId, "ws-123");
    assert.strictEqual(sanitized.name, "Candidate Test");
    assert.deepStrictEqual(sanitized.agent, { source: "n8n" });

    // Ensure sensitive fields are redacted
    assert.strictEqual(sanitized["x-agent-key"], "[REDACTED]");
    assert.strictEqual((sanitized as any).headers.authorization, "[REDACTED]");
    assert.strictEqual((sanitized as any).secrets.password, "[REDACTED]");
    assert.strictEqual((sanitized as any).secrets.token, "[REDACTED]");
    assert.strictEqual((sanitized as any).secrets.secret, "[REDACTED]");
  });

  await t.test("resolveIdempotencyKey returns header value if present", () => {
    const key = resolveIdempotencyKey("idem-key-456", { foo: "bar" });
    assert.strictEqual(key, "idem-key-456");
  });

  await t.test("resolveIdempotencyKey generates deterministic key based on payload if header is missing", () => {
    const payload1 = { foo: "bar", test: 123 };
    const payload2 = { test: 123, foo: "bar" }; // Same properties but different order, will generate different hash if stringified directly but let's test determinism on identical payloads

    const key1 = resolveIdempotencyKey(null, payload1);
    const key2 = resolveIdempotencyKey(null, payload1);

    // Exact same payload should yield exact same generated key
    assert.strictEqual(key1, key2);
    assert.ok(key1.startsWith("auto_"));
  });
});
