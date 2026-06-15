import { z } from "zod";

/**
 * NotificationDeliveryStatus - mandatory states of delivery.
 */
export const NotificationDeliveryStatusSchema = z.enum([
  "pending",
  "queued",
  "processing",
  "delivered",
  "failed",
  "cancelled",
  "suppressed",
]);

export type NotificationDeliveryStatus = z.infer<typeof NotificationDeliveryStatusSchema>;
