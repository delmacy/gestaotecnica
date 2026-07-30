import { z } from "zod";

export const ServiceOrderEventSchema = z.object({
  id: z.string().uuid(),
  eventType: z.string(),
  payload: z.unknown(),
  occurredAt: z.date(),
});

export type ServiceOrderEvent = z.infer<typeof ServiceOrderEventSchema>;
