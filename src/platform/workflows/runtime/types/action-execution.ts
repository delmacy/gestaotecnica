import { z } from "zod";
import { UUIDSchema, WorkspaceIdSchema, ISODateTimeSchema, SafeJsonRecordSchema, CorrelationIdSchema, CausationIdSchema } from "../../../contracts";

export const ActionExecutionStatusSchema = z.enum([
  "pending",
  "running",
  "completed",
  "failed",
  "skipped",
]);

export type ActionExecutionStatus = z.infer<typeof ActionExecutionStatusSchema>;

/**
 * ActionExecution Canonical Schema
 * Based on docs/runtime/RUNTIME_CANONICAL_CONTRACT.md
 */
export const ActionExecutionSchema = z.object({
  id: UUIDSchema,
  workspaceId: WorkspaceIdSchema,
  instanceId: UUIDSchema,
  /**
   * Decisão Canônica: actionKey armazenará o nodeId (o key identificador do nó lógico publicado no JSON).
   */
  actionKey: z.string().min(1),
  actorId: UUIDSchema.nullable(),
  inputPayload: SafeJsonRecordSchema.optional(),
  outputPayload: SafeJsonRecordSchema.optional(),
  status: ActionExecutionStatusSchema,
  error: z.union([SafeJsonRecordSchema, z.string()]).nullable().optional(),
  startedAt: ISODateTimeSchema,
  finishedAt: ISODateTimeSchema.nullable().optional(),
  /**
   * Correlation and Causation IDs - required by PKG-RUNTIME-TYPES-MAPPERS-001
   */
  correlationId: CorrelationIdSchema,
  causationId: CausationIdSchema,
});

export type ActionExecution = z.infer<typeof ActionExecutionSchema>;
