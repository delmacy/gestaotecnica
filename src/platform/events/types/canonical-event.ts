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
  /**
   * Globally unique identifier for this specific event occurrence.
   * Required for receipt generation and deduplication.
   */
  eventId: UUIDSchema,
  eventType: z.string().min(1),
  eventVersion: SchemaVersionSchema,
  occurredAt: ISODateTimeSchema,
  recordedAt: ISODateTimeSchema.optional(),
  workspaceId: WorkspaceIdSchema,
  actor: ActorReferenceSchema.optional(),
  subjectType: z.string().min(1),
  subjectId: z.string().min(1),
  /**
   * Identifier grouping a chain of events (e.g. from an initial command).
   * Needed for receipt generation to trace execution flows.
   */
  correlationId: CorrelationIdSchema,
  causationId: CausationIdSchema.optional(),
  /**
   * Optional key to ensure idempotency when processing or appending events.
   * Required for safe receipt generation in distributed systems.
   */
  idempotencyKey: z.string().max(255).optional(),
  source: z.string().min(1),
  payload: UnknownRecordSchema,
  metadata: UnknownRecordSchema.optional(),
  schemaVersion: SchemaVersionSchema,
});

export type CanonicalEvent = z.infer<typeof CanonicalEventSchema>;
