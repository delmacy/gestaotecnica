import { z } from "zod";

export const processEventTypeSchema = z.enum([
  "process.started",
  "process.completed",
  "step.started",
  "step.completed",
]);

export const logEventInputSchema = z.object({
  workspaceId: z.string().uuid(),
  instanceId: z.string().uuid().optional(),
  eventType: processEventTypeSchema,
  entityType: z.string().min(1),
  entityId: z.string().uuid().optional(),
  actorType: z.string().optional(),
  actorId: z.string().uuid().optional(),
  source: z.string().optional(),
  correlationId: z.string().optional(),
  causationId: z.string().optional(),
  payload: z.record(z.string(), z.unknown()).optional().default({}),
});

export const getTimelineForInstanceInputSchema = z.object({
  workspaceId: z.string().uuid(),
  instanceId: z.string().uuid(),
});
