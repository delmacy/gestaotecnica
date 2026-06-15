import { z } from "zod";

/**
 * NotificationPriority - mandatory priorities.
 */
export const NotificationPrioritySchema = z.enum([
  "low",
  "normal",
  "high",
  "urgent",
]);

export type NotificationPriority = z.infer<typeof NotificationPrioritySchema>;
