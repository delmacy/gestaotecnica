import { z } from "zod";
import { UUIDSchema, WorkspaceIdSchema, ISODateTimeSchema, SchemaVersionSchema, UnknownRecordSchema } from "../../../contracts";

/**
 * ProcessPayload Canonical Schema
 * Based on docs/runtime/RUNTIME_CANONICAL_CONTRACT.md and docs/runtime/RUNTIME_PAYLOAD_CONTRACT.md
 */
export const ProcessPayloadSchema = z.object({
  id: UUIDSchema,
  instanceId: UUIDSchema,
  workspaceId: WorkspaceIdSchema,
  schemaVersion: SchemaVersionSchema,
  data: UnknownRecordSchema,
  createdAt: ISODateTimeSchema,
  updatedAt: ISODateTimeSchema,
});

export type ProcessPayload = z.infer<typeof ProcessPayloadSchema>;
