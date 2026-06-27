import { z } from "zod";

export const canonicalEventSchema = z.object({
  id: z.string().uuid(),
  workspaceId: z.string().uuid(),
  eventType: z.string(),
  entityType: z.string(),
  entityId: z.string().uuid(),
  actorId: z.string().uuid().optional(),
  occurredAt: z.date(),
  schemaVersion: z.string(),
  correlationId: z.string().optional(),
  causationId: z.string().optional(),
  payload: z.record(z.string(), z.unknown()),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

export type CanonicalEvent = z.infer<typeof canonicalEventSchema>;

export const emitCanonicalEventInputSchema = canonicalEventSchema.omit({
  id: true,
  occurredAt: true,
  metadata: true,
}).extend({
  occurredAt: z.date().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type EmitCanonicalEventInput = z.infer<typeof emitCanonicalEventInputSchema>;
