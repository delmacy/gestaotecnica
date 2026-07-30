import { z } from "zod";

export const WorkItemEventSchema = z.object({
  id: z.string().uuid(),
  eventType: z.string(),
  payload: z.unknown(),
  occurredAt: z.date(),
});

export type WorkItemEvent = z.infer<typeof WorkItemEventSchema>;
