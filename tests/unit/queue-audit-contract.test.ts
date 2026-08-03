import { describe, it } from "node:test";
import assert from "node:assert";
import {
  QueueAuditEventSchema,
  QueueAuditReceiptSchema,
  QueueAuditEventTypes,
} from "@/modules/queues/contracts/queue-audit";
import {
  getQueueAuditEventLabel,
  getQueueAuditEventTypeList,
} from "@/modules/queues/audit-labels";

const EVENT_ID = "123e4567-e89b-12d3-a456-426614174000";
const WORKSPACE_ID = "123e4567-e89b-12d3-a456-426614174000";

describe("Queue audit contract - permissions, audit, and receipts", () => {
  it("validates a real audit receipt with a recovered draft event", () => {
    const payload = {
      state: "real",
      workspaceId: WORKSPACE_ID,
      workspaceName: "Seção Técnica",
      events: [
        {
          id: EVENT_ID,
          eventType: "queue_item.recovered",
          entityType: "queue_item",
          actorName: "João Operador",
          occurredAt: new Date("2026-08-03T10:00:00Z"),
          payload: { entityId: EVENT_ID, statusFrom: "draft", statusTo: "open" },
        },
      ],
    };
    const result = QueueAuditReceiptSchema.safeParse(payload);
    assert.strictEqual(result.success, true);
  });

  it("validates an empty audit receipt", () => {
    const payload = {
      state: "empty",
      workspaceId: WORKSPACE_ID,
      workspaceName: "Seção Técnica",
    };
    const result = QueueAuditReceiptSchema.safeParse(payload);
    assert.strictEqual(result.success, true);
  });

  it("validates a blocked audit receipt", () => {
    const payload = { state: "blocked", message: "Acesso restrito" };
    const result = QueueAuditReceiptSchema.safeParse(payload);
    assert.strictEqual(result.success, true);
  });

  it("rejects an unknown receipt state instead of leaking a synthetic fallback", () => {
    const payload = {
      state: "synthetic",
      workspaceId: WORKSPACE_ID,
      workspaceName: "Seção Técnica",
      events: [],
      label: "demo",
    };
    const result = QueueAuditReceiptSchema.safeParse(payload);
    assert.strictEqual(result.success, false);
  });

  it("rejects an audit event with an invalid entity id", () => {
    const payload = {
      id: "not-a-uuid",
      eventType: "queue_item.recovered",
      entityType: "queue_item",
      actorName: "João Operador",
      occurredAt: new Date("2026-08-03T10:00:00Z"),
      payload: {},
    };
    const result = QueueAuditEventSchema.safeParse(payload);
    assert.strictEqual(result.success, false);
  });

  it("accepts a valid audit event even for an unknown event type", () => {
    const payload = {
      id: EVENT_ID,
      eventType: "queue_item.escalated",
      entityType: "queue_item",
      actorName: null,
      occurredAt: new Date("2026-08-03T10:00:00Z"),
      payload: { reason: "SLA expirado" },
    };
    const result = QueueAuditEventSchema.safeParse(payload);
    assert.strictEqual(result.success, true);
  });

  it("declares only event types the queue actions persist", () => {
    const declared = getQueueAuditEventTypeList();
    assert.deepStrictEqual(declared, [...QueueAuditEventTypes]);
    for (const eventType of declared) {
      assert.notStrictEqual(
        getQueueAuditEventLabel(eventType),
        "Evento registrado",
        `Missing commercial label for ${eventType}`,
      );
    }
  });

  it("maps every declared event type to a commercial label without secrets", () => {
    for (const eventType of QueueAuditEventTypes) {
      const label = getQueueAuditEventLabel(eventType);
      assert.ok(label.length > 0);
      assert.ok(
        !/password|secret|token|api[_ -]?key/i.test(label),
        `Label for ${eventType} should not mention secrets`,
      );
    }
  });

  it("falls back safely for unknown event types", () => {
    assert.strictEqual(
      getQueueAuditEventLabel("unknown.event"),
      "Evento registrado",
    );
  });
});
