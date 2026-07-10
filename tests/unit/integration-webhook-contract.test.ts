import { describe, it } from "node:test";
import * as assert from "node:assert/strict";
import { IntegrationWebhookCommandEnvelopeSchema } from "../../src/platform/integrations/integration-command-types";

describe("IntegrationWebhookCommandEnvelopeSchema", () => {
  it("should allow a valid envelope without an idempotency key", () => {
    const validEnvelope = {
      eventType: "test.event",
      direction: "inbound",
      status: "received",
      payload: { foo: "bar" },
    };

    const result = IntegrationWebhookCommandEnvelopeSchema.safeParse(validEnvelope);
    assert.strictEqual(result.success, true);
    if (result.success) {
      assert.strictEqual(result.data.idempotencyKey, undefined);
    }
  });

  it("should allow a valid envelope with a valid idempotency key", () => {
    const validEnvelope = {
      eventType: "test.event",
      direction: "inbound",
      status: "received",
      payload: { foo: "bar" },
      idempotencyKey: "valid-key-123",
    };

    const result = IntegrationWebhookCommandEnvelopeSchema.safeParse(validEnvelope);
    assert.strictEqual(result.success, true);
    if (result.success) {
      assert.strictEqual(result.data.idempotencyKey, "valid-key-123");
    }
  });

  it("should reject an envelope with an empty idempotency key", () => {
    const invalidEnvelope = {
      eventType: "test.event",
      direction: "inbound",
      status: "received",
      payload: { foo: "bar" },
      idempotencyKey: "",
    };

    const result = IntegrationWebhookCommandEnvelopeSchema.safeParse(invalidEnvelope);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.strictEqual(result.error.issues.some((i) => i.path.includes("idempotencyKey")), true);
    }
  });

  it("should reject an envelope with an idempotency key longer than 255 characters", () => {
    const invalidEnvelope = {
      eventType: "test.event",
      direction: "inbound",
      status: "received",
      payload: { foo: "bar" },
      idempotencyKey: "a".repeat(256),
    };

    const result = IntegrationWebhookCommandEnvelopeSchema.safeParse(invalidEnvelope);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.strictEqual(result.error.issues.some((i) => i.path.includes("idempotencyKey")), true);
    }
  });

  it("should allow an envelope with an idempotency key exactly 255 characters long", () => {
    const validEnvelope = {
      eventType: "test.event",
      direction: "inbound",
      status: "received",
      payload: { foo: "bar" },
      idempotencyKey: "a".repeat(255),
    };

    const result = IntegrationWebhookCommandEnvelopeSchema.safeParse(validEnvelope);
    assert.strictEqual(result.success, true);
    if (result.success) {
      assert.strictEqual(result.data.idempotencyKey?.length, 255);
    }
  });
});
