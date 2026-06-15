import { z } from "zod";
import { NotificationChannelSchema } from "./channels";

/**
 * NotificationPreference - models notification preferences without persistence.
 */
export const NotificationPreferenceSchema = z.strictObject({
  enabledChannels: z.array(NotificationChannelSchema),
  disabledChannels: z.array(NotificationChannelSchema),
  quietHours: z.strictObject({
    enabled: z.boolean(),
    start: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/), // HH:mm
    end: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),   // HH:mm
  }).optional(),
  timezone: z.string().min(1),
  categories: z.record(z.string(), z.boolean()),
});

export type NotificationPreference = z.infer<typeof NotificationPreferenceSchema>;
