import { z } from "zod";

export const TimelineItemSchema = z.object({
  id: z.string(),
  type: z.string(),
  title: z.string(),
  description: z.string().optional(),
  occurredAt: z.date(),
  actorId: z.string().optional(),
  payload: z.record(z.string(), z.unknown()),
}).strict();

export type TimelineItem = Readonly<z.infer<typeof TimelineItemSchema>>;
