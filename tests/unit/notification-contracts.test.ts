import { test, describe } from "node:test";
import assert from "node:assert";
import {
  createNotificationIntent,
  validateNotificationRecipient,
  createNotificationAttempt,
  markNotificationDelivered,
  markNotificationFailed,
  NotificationDelivery,
  NotificationFailure
} from "../../src/platform/notifications";

describe("Notification Contracts and Pure Functions - PR Feedback", () => {
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
    metadata: { source: "test" },
  };

  const baseDelivery: NotificationDelivery = {
    intentId: validIntentId,
    workspaceId: validWorkspaceId,
    status: "pending",
    attempts: [],
    metadata: { source: "test" },
  };

  describe("Canonical Attempt Numbering", () => {
    test("first attempt should be number 1", () => {
      const updated = createNotificationAttempt(baseDelivery, {
        attemptedAt: validTimestamp,
        status: "queued"
      });
      assert.strictEqual(updated.attempts[0].number, 1);
    });

    test("second attempt should be number 2", () => {
      const first = createNotificationAttempt(baseDelivery, {
        attemptedAt: validTimestamp,
        status: "queued"
      });
      const second = createNotificationAttempt(first, {
        attemptedAt: validTimestamp,
        status: "processing"
      });
      assert.strictEqual(second.attempts[1].number, 2);
    });

    test("should reject duplicate attempt number", () => {
      const first = createNotificationAttempt(baseDelivery, {
        attemptedAt: validTimestamp,
        status: "queued"
      });
      assert.throws(() => createNotificationAttempt(first, {
        number: 1, // should be 2
        attemptedAt: validTimestamp,
        status: "processing"
      }), /Invalid attempt number/);
    });

    test("should reject skipped attempt number", () => {
      assert.throws(() => createNotificationAttempt(baseDelivery, {
        number: 2, // should be 1
        attemptedAt: validTimestamp,
        status: "queued"
      }), /Invalid attempt number/);
    });

    test("should reject zero or negative attempt number", () => {
      // Numbers are calculated internally or validated if provided
      assert.throws(() => createNotificationAttempt(baseDelivery, {
        number: 0,
        attemptedAt: validTimestamp,
        status: "queued"
      }), /Invalid attempt number/);
    });
  });

  describe("State Transitions", () => {
    test("valid transition: pending -> queued -> processing -> delivered", () => {
      const q = createNotificationAttempt(baseDelivery, { attemptedAt: validTimestamp, status: "queued" });
      const p = createNotificationAttempt(q, { attemptedAt: validTimestamp, status: "processing" });
      const d = markNotificationDelivered(p, { deliveredAt: validTimestamp });
      assert.strictEqual(d.status, "delivered");
    });

    test("valid transition: processing -> failed -> processing", () => {
      const q = createNotificationAttempt(baseDelivery, { attemptedAt: validTimestamp, status: "queued" });
      const p = createNotificationAttempt(q, { attemptedAt: validTimestamp, status: "processing" });
      const f = markNotificationFailed(p, { code: "ERR", reason: "failed" });
      const r = createNotificationAttempt(f, { attemptedAt: validTimestamp, status: "processing" });
      assert.strictEqual(r.status, "processing");
      assert.strictEqual(r.attempts.length, 3);
    });

    test("invalid transition: delivered -> processing", () => {
      const q = createNotificationAttempt(baseDelivery, { attemptedAt: validTimestamp, status: "queued" });
      const p = createNotificationAttempt(q, { attemptedAt: validTimestamp, status: "processing" });
      const d = markNotificationDelivered(p, { deliveredAt: validTimestamp });
      assert.throws(() => createNotificationAttempt(d, { attemptedAt: validTimestamp, status: "processing" }), /Invalid state transition/);
    });

    test("invalid transition: cancelled -> delivered", () => {
      const c = createNotificationAttempt(baseDelivery, { attemptedAt: validTimestamp, status: "cancelled" });
      assert.throws(() => markNotificationDelivered(c, { deliveredAt: validTimestamp }), /Invalid state transition/);
    });
  });

  describe("Identity and Metadata Preservation", () => {
    test("should preserve intentId, workspaceId and metadata across transitions", () => {
      const q = createNotificationAttempt(baseDelivery, { attemptedAt: validTimestamp, status: "queued" });
      assert.strictEqual(q.intentId, baseDelivery.intentId);
      assert.strictEqual(q.workspaceId, baseDelivery.workspaceId);
      assert.deepStrictEqual(q.metadata, baseDelivery.metadata);

      const d = markNotificationDelivered(createNotificationAttempt(q, { attemptedAt: validTimestamp, status: "processing" }), { deliveredAt: validTimestamp });
      assert.strictEqual(d.intentId, baseDelivery.intentId);
      assert.strictEqual(d.workspaceId, baseDelivery.workspaceId);
      assert.deepStrictEqual(d.metadata, baseDelivery.metadata);
    });
  });

  describe("Failure and Delivered Constraints", () => {
    test("markNotificationFailed should reject if no attempt exists (Option A)", () => {
      // It fails transition first
      assert.throws(() => markNotificationFailed(baseDelivery, { code: "ERR", reason: "fail" }), /Invalid state transition/);
    });

    test("markNotificationDelivered should update last attempt and preserve providerReference", () => {
      const q = createNotificationAttempt(baseDelivery, { attemptedAt: validTimestamp, status: "queued" });
      const p = createNotificationAttempt(q, { attemptedAt: validTimestamp, status: "processing", providerReference: "REF-1" });
      const d = markNotificationDelivered(p, { deliveredAt: validTimestamp, providerReference: "REF-UPDATED" });

      assert.strictEqual(d.attempts[1].status, "delivered");
      assert.strictEqual(d.attempts[1].providerReference, "REF-UPDATED");
    });

    test("markNotificationDelivered should reject if last attempt was not processing", () => {
      const q = createNotificationAttempt(baseDelivery, { attemptedAt: validTimestamp, status: "queued" });
      // Transitions from queued to delivered is invalid
      assert.throws(() => markNotificationDelivered(q, { deliveredAt: validTimestamp }), /Invalid state transition/);
    });
  });

  describe("Immutability and Purity", () => {
    test("should work with frozen input and not mutate", () => {
      const frozenDelivery = Object.freeze({
        ...baseDelivery,
        attempts: Object.freeze([])
      }) as unknown as NotificationDelivery;

      const updated = createNotificationAttempt(frozenDelivery, { attemptedAt: validTimestamp, status: "queued" });
      assert.ok(updated);
      assert.notStrictEqual(updated, frozenDelivery);
    });
  });

  describe("Failure Sanitization", () => {
    test("should reject failure containing secrets", () => {
      const failure: NotificationFailure = { code: "ERR", reason: "Sensitive apiKey: 12345" };

      const q = createNotificationAttempt(baseDelivery, { attemptedAt: validTimestamp, status: "queued" });
      const p = createNotificationAttempt(q, { attemptedAt: validTimestamp, status: "processing" });

      assert.throws(() => markNotificationFailed(p, failure), /Forbidden keyword/i);
    });

    test("should reject failure containing unknown forbidden fields (via logic or schema)", () => {
      const failure = { code: "ERR", reason: "error", password: "123" };
      const q = createNotificationAttempt(baseDelivery, { attemptedAt: validTimestamp, status: "queued" });
      const p = createNotificationAttempt(q, { attemptedAt: validTimestamp, status: "processing" });

      assert.throws(() => markNotificationFailed(p, failure as any));
    });
  });
});
