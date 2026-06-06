import { z } from "zod";

export const processInstanceStatusSchema = z.enum([
  "active",
  "completed",
  "failed",
  "pending",
  "cancelled",
]);

export const actionExecutionStatusSchema = z.enum([
  "pending",
  "running",
  "completed",
  "failed",
  "skipped",
]);

export const startProcessInstanceInputSchema = z.object({
  workspaceId: z.string().uuid("workspaceId deve ser um UUID válido"),
  processVersionId: z.string().uuid("processVersionId deve ser um UUID válido"),
  createdById: z.string().uuid().optional(),
  initialPayload: z.record(z.string(), z.any()).optional().default({}),
});

export const processInstanceInsertSchema = z.object({
  id: z.string().uuid().optional(),
  workspaceId: z.string().uuid(),
  processVersionId: z.string().uuid(),
  currentStateId: z.string().uuid().nullable().optional(),
  status: processInstanceStatusSchema.optional().default("active"),
  createdById: z.string().uuid().nullable().optional(),
});

export const actionExecutionInsertSchema = z.object({
  id: z.string().uuid().optional(),
  workspaceId: z.string().uuid(),
  instanceId: z.string().uuid(),
  actionKey: z.string().min(1),
  actorId: z.string().uuid().nullable().optional(),
  inputPayload: z.record(z.string(), z.any()).optional().default({}),
  outputPayload: z.record(z.string(), z.any()).optional().default({}),
  status: actionExecutionStatusSchema.optional().default("completed"),
  error: z.string().nullable().optional(),
  finishedAt: z.date().nullable().optional(),
});
