import { z } from "zod";

export const QueueItemStatusSchema = z.enum(["draft", "open", "in_progress", "resolved", "cancelled"]);
export type QueueItemStatus = z.infer<typeof QueueItemStatusSchema>;

export const PrioritySchema = z.enum(["low", "medium", "high", "critical"]);
export type Priority = z.infer<typeof PrioritySchema>;

export const QueueItemSchema = z.object({
  id: z.string().uuid(),
  queueId: z.string().uuid(),
  entityType: z.string().min(1),
  entityId: z.string().uuid(),
  status: QueueItemStatusSchema,
  priority: PrioritySchema,
  assignedToId: z.string().uuid().nullable().optional(),
  dueAt: z.date().nullable().optional(),
  payload: z.record(z.unknown()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type QueueItem = z.infer<typeof QueueItemSchema>;

export const CreateQueueItemSchema = QueueItemSchema.pick({
  queueId: true,
  entityType: true,
  entityId: true,
}).extend({
  status: QueueItemStatusSchema.default("open"),
  priority: PrioritySchema.default("medium"),
  assignedToId: z.string().uuid().optional(),
  dueAt: z.date().optional(),
  payload: z.record(z.unknown()).default({}),
});

export type CreateQueueItemDTO = z.infer<typeof CreateQueueItemSchema>;

export const UpdateQueueItemSchema = CreateQueueItemSchema.partial();
export type UpdateQueueItemDTO = z.infer<typeof UpdateQueueItemSchema>;
