import { z } from "zod";

export const EventReceiptSchema = z.object({
  eventId: z.string().min(1),
  processorId: z.string().min(1).optional(),
  processedAt: z.string().datetime(),
  status: z.enum(["success", "error", "skipped"]),
  correlationId: z.string().min(1).optional(),
  error: z.string().optional()
});

export type EventReceipt = z.infer<typeof EventReceiptSchema>;

export type EventDefinition = {
  key: string;
  moduleKey: string;
  description?: string;
  payloadSchema?: unknown;
};

export type EmitEventInput = {
  eventType: string;
  entityType: string;
  entityId: string;
  payload?: Record<string, unknown>;
  causationId?: string;
};

export type EmittedEvent = EmitEventInput & {
  id?: string;
  correlationId: string;
};
