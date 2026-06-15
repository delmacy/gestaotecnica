import { test, describe } from "node:test";
import assert from "node:assert";
import {
  createNotificationIntent,
  validateNotificationRecipient,
  createNotificationAttempt,
  markNotificationDelivered,
  markNotificationFailed,
  NotificationDelivery,
  NotificationIntent
} from "../../src/platform/notifications";

describe("Notification Contracts and Pure Functions", () => {
  const validWorkspaceId = "550e8400-e29b-41d4-a716-446655440000";
  const validIntentId = "intent-123";
  const validTimestamp = new Date().toISOString();

  const baseIntent = {
    id: validIntentId,
    workspaceId: validWorkspaceId,
    recipient: { type: "user", userId: "user-123" },
    channel: "in_app",
    priority: "normal",
    payload: { message: "Hello" },
    correlationId: "corr-123",
    causationId: "caus-123",
    metadata: {},
  };

  describe("createNotificationIntent", () => {
    test("should create a valid minimal intent", () => {
      const intent = createNotificationIntent(baseIntent);
      assert.strictEqual(intent.id, validIntentId);
      assert.strictEqual(intent.workspaceId, validWorkspaceId);
      assert.strictEqual(intent.channel, "in_app");
    });

    test("should create a complete intent with dates and template", () => {
      const completeIntent = {
        ...baseIntent,
        template: { id: "tmpl-1", version: "1.0.0" },
        subject: "Welcome",
        scheduledAt: validTimestamp,
        expiresAt: new Date(Date.now() + 10000).toISOString(),
      };
      const intent = createNotificationIntent(completeIntent);
      assert.strictEqual(intent.template?.id, "tmpl-1");
      assert.ok(intent.expiresAt);
    });

    test("should throw if workspaceId is missing", () => {
      const invalid = { ...baseIntent, workspaceId: undefined };
      assert.throws(() => createNotificationIntent(invalid));
    });

    test("should throw if correlationId is missing", () => {
      const invalid = { ...baseIntent, correlationId: undefined };
      assert.throws(() => createNotificationIntent(invalid));
    });

    test("should throw if expiresAt is before scheduledAt", () => {
      const invalid = {
        ...baseIntent,
        scheduledAt: new Date(Date.now() + 10000).toISOString(),
        expiresAt: validTimestamp
      };
      assert.throws(() => createNotificationIntent(invalid));
    });

    test("should throw for invalid channel", () => {
      const invalid = { ...baseIntent, channel: "invalid_channel" };
      assert.throws(() => createNotificationIntent(invalid));
    });
  });

  describe("validateNotificationRecipient", () => {
    test("should accept valid email with external address", () => {
      const recipient = { type: "external_address", address: "test@example.com" };
      const result = validateNotificationRecipient(recipient as any, "email");
      assert.strictEqual(result.valid, true);
    });

    test("should reject invalid email address", () => {
      const recipient = { type: "external_address", address: "invalid-email" };
      const result = validateNotificationRecipient(recipient as any, "email");
      assert.strictEqual(result.valid, false);
    });

    test("should accept valid SMS with E.164", () => {
      const recipient = { type: "external_address", address: "+5511999999999" };
      const result = validateNotificationRecipient(recipient as any, "sms");
      assert.strictEqual(result.valid, true);
    });

    test("should reject invalid SMS format", () => {
      const recipient = { type: "external_address", address: "999999999" };
      const result = validateNotificationRecipient(recipient as any, "sms");
      assert.strictEqual(result.valid, false);
    });

    test("should accept webhook with endpoint", () => {
      const recipient = { type: "webhook_endpoint", url: "https://example.com/webhook" };
      const result = validateNotificationRecipient(recipient as any, "webhook");
      assert.strictEqual(result.valid, true);
    });

    test("should reject webhook with wrong recipient type", () => {
      const recipient = { type: "user", userId: "u1" };
      const result = validateNotificationRecipient(recipient as any, "webhook");
      assert.strictEqual(result.valid, false);
    });

    test("should reject webhook endpoint with wrong channel", () => {
      const recipient = { type: "webhook_endpoint", url: "https://example.com/webhook" };
      const result = validateNotificationRecipient(recipient as any, "email");
      assert.strictEqual(result.valid, false);
    });
  });

  describe("Delivery and Attempts", () => {
    const baseDelivery: NotificationDelivery = {
      intentId: validIntentId,
      workspaceId: validWorkspaceId,
      status: "pending",
      attempts: [],
      metadata: {},
    };

    test("should create attempt and increment delivery state", () => {
      const attemptTimestamp = new Date().toISOString();
      const updated = createNotificationAttempt(baseDelivery, {
        number: 1,
        attemptedAt: attemptTimestamp,
        status: "processing"
      });

      assert.strictEqual(updated.status, "processing");
      assert.strictEqual(updated.attempts.length, 1);
      assert.strictEqual(updated.attempts[0].number, 1);
      assert.strictEqual(updated.lastAttemptAt, attemptTimestamp);
    });

    test("should mark as delivered", () => {
      const deliveredAt = new Date().toISOString();
      const updated = markNotificationDelivered(baseDelivery, { deliveredAt });

      assert.strictEqual(updated.status, "delivered");
      assert.strictEqual(updated.deliveredAt, deliveredAt);
    });

    test("should mark as failed and record failure in last attempt", () => {
      const attempt = createNotificationAttempt(baseDelivery, {
        number: 1,
        attemptedAt: validTimestamp,
        status: "processing"
      });

      const failure = { code: "PROVIDER_ERROR", reason: "Service unavailable" };
      const failed = markNotificationFailed(attempt, failure);

      assert.strictEqual(failed.status, "failed");
      assert.strictEqual(failed.attempts[0].status, "failed");
      assert.deepStrictEqual(failed.attempts[0].failure, failure);
    });
  });

  describe("Purity and Constraints", () => {
    test("should not mutate input (intent)", () => {
      const input = { ...baseIntent };
      createNotificationIntent(input);
      assert.deepStrictEqual(input, baseIntent);
    });

    test("should return frozen object (intent)", () => {
      const intent = createNotificationIntent(baseIntent);
      assert.throws(() => {
        (intent as any).id = "changed";
      });
    });

    test("should return frozen object (delivery)", () => {
      const baseDelivery: NotificationDelivery = {
        intentId: validIntentId,
        workspaceId: validWorkspaceId,
        status: "pending",
        attempts: [],
        metadata: {},
      };
      const updated = markNotificationDelivered(baseDelivery, { deliveredAt: validTimestamp });
      assert.throws(() => {
        (updated as any).status = "changed";
      });
    });

    test("should be serializable to JSON", () => {
      const intent = createNotificationIntent(baseIntent);
      const json = JSON.stringify(intent);
      const parsed = JSON.parse(json);
      assert.strictEqual(parsed.id, intent.id);
    });
  });
});
