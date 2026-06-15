import { z } from "zod";
import { EntityIdSchema, WorkspaceIdSchema } from "@/platform/contracts/identifiers";
import { ISODateTimeSchema } from "@/platform/contracts/time";
import { CorrelationIdSchema, CausationIdSchema } from "@/platform/contracts/correlation";
import { UnknownRecordSchema } from "@/platform/contracts/payload";
import { NotificationRecipientSchema } from "./recipient";
import { NotificationChannelSchema } from "./channels";
import { NotificationPrioritySchema } from "./priority";
import { NotificationTemplateReferenceSchema } from "./template";

/**
 * NotificationIntent - models the intention to send a notification.
 */
export const NotificationIntentSchema = z.strictObject({
  id: EntityIdSchema,
  workspaceId: WorkspaceIdSchema,
  recipient: NotificationRecipientSchema,
  channel: NotificationChannelSchema,
  priority: NotificationPrioritySchema,
  template: NotificationTemplateReferenceSchema.optional(),
  subject: z.string().min(1).optional(),
  payload: UnknownRecordSchema,
  scheduledAt: ISODateTimeSchema.optional(),
  expiresAt: ISODateTimeSchema.optional(),
  correlationId: CorrelationIdSchema,
  causationId: CausationIdSchema,
  metadata: UnknownRecordSchema,
}).refine((data) => {
  if (data.scheduledAt && data.expiresAt) {
    return new Date(data.expiresAt) >= new Date(data.scheduledAt);
  }
  return true;
}, {
  message: "expiresAt cannot be before scheduledAt",
  path: ["expiresAt"],
});

export type NotificationIntent = z.infer<typeof NotificationIntentSchema>;
