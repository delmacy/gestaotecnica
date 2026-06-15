import { z } from "zod";
import { EntityIdSchema } from "@/platform/contracts/identifiers";

/**
 * NotificationRecipient - models different types of recipients.
 * Each recipient must have a type and can only have one type of identifier/address.
 */
export const NotificationRecipientSchema = z.discriminatedUnion("type", [
  z.strictObject({
    type: z.literal("user"),
    userId: EntityIdSchema,
  }),
  z.strictObject({
    type: z.literal("role"),
    roleId: EntityIdSchema,
  }),
  z.strictObject({
    type: z.literal("team"),
    teamId: EntityIdSchema,
  }),
  z.strictObject({
    type: z.literal("external_address"),
    address: z.string().min(1),
  }),
  z.strictObject({
    type: z.literal("webhook_endpoint"),
    url: z.string().url(),
  }),
]);

export type NotificationRecipient = z.infer<typeof NotificationRecipientSchema>;
