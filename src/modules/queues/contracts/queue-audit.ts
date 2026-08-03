import { z } from "zod";

export const QueueAuditEventTypes = [
  "queue_item.created",
  "queue_item.updated",
  "queue_item.recovered",
  "queue_item.deleted",
  "sla_policy.upserted",
] as const;

export type QueueAuditEventType = (typeof QueueAuditEventTypes)[number];

export const QueueAuditEventSchema = z.object({
  id: z.string().uuid(),
  eventType: z.string().min(1),
  entityType: z.string().min(1),
  actorName: z.string().nullable(),
  occurredAt: z.date(),
  payload: z.record(z.string(), z.unknown()),
});

export type QueueAuditEvent = z.infer<typeof QueueAuditEventSchema>;

export const QueueAuditReceiptSchema = z.discriminatedUnion("state", [
  z.object({
    state: z.literal("real"),
    workspaceId: z.string().uuid(),
    workspaceName: z.string(),
    events: z.array(QueueAuditEventSchema),
  }),
  z.object({
    state: z.literal("empty"),
    workspaceId: z.string().uuid(),
    workspaceName: z.string(),
  }),
  z.object({
    state: z.literal("blocked"),
    message: z.string().optional(),
  }),
]);

export type QueueAuditReceipt = z.infer<typeof QueueAuditReceiptSchema>;
