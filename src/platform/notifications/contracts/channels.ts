import { z } from "zod";

/**
 * NotificationChannel - mandatory delivery channels.
 */
export const NotificationChannelSchema = z.enum([
  "in_app",
  "email",
  "sms",
  "push",
  "webhook",
]);

export type NotificationChannel = z.infer<typeof NotificationChannelSchema>;
