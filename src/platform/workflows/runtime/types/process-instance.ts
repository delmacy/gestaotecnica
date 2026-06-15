import { z } from "zod";
import { UUIDSchema, WorkspaceIdSchema, ISODateTimeSchema } from "../../../contracts";

export const ProcessInstanceStatusSchema = z.enum([
  "pending",
  "active",
  "completed",
  "failed",
  "cancelled",
]);

export type ProcessInstanceStatus = z.infer<typeof ProcessInstanceStatusSchema>;

/**
 * ProcessInstance Canonical Schema
 * Based on docs/runtime/RUNTIME_CANONICAL_CONTRACT.md
 */
export const ProcessInstanceSchema = z.object({
  id: UUIDSchema,
  workspaceId: WorkspaceIdSchema,
  processVersionId: UUIDSchema,
  // currentStateId is optional/derived as per contract
  currentStateId: UUIDSchema.optional(),
  status: ProcessInstanceStatusSchema,
  createdById: UUIDSchema.nullable(),
  createdAt: ISODateTimeSchema,
  updatedAt: ISODateTimeSchema,
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type ProcessInstance = z.infer<typeof ProcessInstanceSchema>;
