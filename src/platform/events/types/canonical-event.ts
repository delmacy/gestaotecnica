import { z } from "zod";
import {
  UUIDSchema,
  WorkspaceIdSchema,
  ISODateTimeSchema,
  SchemaVersionSchema,
  UnknownRecordSchema,
  ActorReferenceSchema,
  CorrelationIdSchema,
  CausationIdSchema,
} from "../../contracts";

/**
 * Canonical Event Envelope
 * Following docs/events/EVENT_CANONICAL_ENVELOPE.md and prompt requirements.
 * Uses camelCase to match existing platform contracts.
 */
export const CanonicalEventSchema = z.object({
  eventId: UUIDSchema,
  eventType: z.string().min(1),
  eventVersion: SchemaVersionSchema,
  occurredAt: ISODateTimeSchema,
  recordedAt: ISODateTimeSchema.optional(),
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

export type CanonicalEvent = z.infer<typeof CanonicalEventSchema>;
