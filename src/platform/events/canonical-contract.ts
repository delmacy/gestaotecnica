import { z } from "zod";
import {
  UUIDSchema,
  WorkspaceIdSchema,
  ISODateTimeSchema,
  SchemaVersionSchema,
  UnknownRecordSchema,
  CorrelationIdSchema,
  CausationIdSchema,
} from "../contracts";

/**
 * Canonical Event Contract
 * Following TASK 4 requirements.
 */
export const CanonicalEventSchema = z.object({
  id: UUIDSchema,
  workspaceId: WorkspaceIdSchema,
  eventType: z.string().min(1),
  entityType: z.string().min(1),
  entityId: z.string().min(1),
  actorId: z.string().min(1),
  occurredAt: ISODateTimeSchema,
  schemaVersion: SchemaVersionSchema,
  correlationId: CorrelationIdSchema.optional(),
  causationId: CausationIdSchema.optional(),
  idempotencyKey: z.string().optional(),
  payload: UnknownRecordSchema,
  metadata: UnknownRecordSchema.optional(),
});

export type CanonicalEvent = z.infer<typeof CanonicalEventSchema>;
