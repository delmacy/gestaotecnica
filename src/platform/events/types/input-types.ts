import { z } from "zod";
import {
  WorkspaceIdSchema,
  ActorReferenceSchema,
  CorrelationIdSchema,
  CausationIdSchema,
  SchemaVersionSchema,
  UnknownRecordSchema,
} from "../../contracts";

/**
 * Raw input for mapping to a canonical event.
 * Allows more flexible types for normalization.
 */
export const EventMapperInputSchema = z.object({
  eventId: z.string().uuid(),
  eventType: z.string().min(1),
  eventVersion: SchemaVersionSchema,
  occurredAt: z.union([z.string().datetime(), z.date(), z.number()]),
  recordedAt: z.union([z.string().datetime(), z.date(), z.number()]).optional(),
  workspaceId: WorkspaceIdSchema,
  actor: ActorReferenceSchema.optional(),
  subjectType: z.string().min(1),
  subjectId: z.string().min(1),
  correlationId: CorrelationIdSchema,
  causationId: CausationIdSchema.optional(),
  source: z.string().min(1),
  payload: UnknownRecordSchema,
  metadata: UnknownRecordSchema.optional(),
  schemaVersion: SchemaVersionSchema,
});

export type EventMapperInput = z.infer<typeof EventMapperInputSchema>;
