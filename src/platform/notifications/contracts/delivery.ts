import { z } from "zod";
import { EntityIdSchema, WorkspaceIdSchema } from "@/platform/contracts/identifiers";
import { ISODateTimeSchema } from "@/platform/contracts/time";
import { UnknownRecordSchema } from "@/platform/contracts/payload";
import { NotificationDeliveryStatusSchema } from "./status";

/**
 * NotificationFailure - models a notification delivery failure.
 */
export const NotificationFailureSchema = z.strictObject({
  code: z.string().min(1),
  reason: z.string().min(1),
  // Failure must not expose provider secrets, so we only allow a safe message and code.
}).superRefine((data, ctx) => {
  const forbiddenKeywords = [
    "token", "apiKey", "password", "authorization",
    "providerSecret", "rawResponse", "secret", "key"
  ];

  const content = JSON.stringify(data).toLowerCase();
  for (const keyword of forbiddenKeywords) {
    if (content.includes(keyword.toLowerCase())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Failure reason contains forbidden keyword: ${keyword}`,
        path: ["reason"]
      });
    }
  }
});

export type NotificationFailure = z.infer<typeof NotificationFailureSchema>;

/**
 * NotificationAttempt - models a single delivery attempt.
 */
export const NotificationAttemptSchema = z.strictObject({
  number: z.number().int().positive(),
  attemptedAt: ISODateTimeSchema,
  status: NotificationDeliveryStatusSchema,
  failure: NotificationFailureSchema.optional(),
  providerReference: z.string().optional(), // reference to external provider ID
});

export type NotificationAttempt = z.infer<typeof NotificationAttemptSchema>;

/**
 * NotificationDelivery - models the delivery state of a notification intent.
 */
export const NotificationDeliverySchema = z.strictObject({
  intentId: EntityIdSchema,
  workspaceId: WorkspaceIdSchema,
  status: NotificationDeliveryStatusSchema,
  attempts: z.array(NotificationAttemptSchema),
  lastAttemptAt: ISODateTimeSchema.optional(),
  deliveredAt: ISODateTimeSchema.optional(),
  metadata: UnknownRecordSchema,
});

export type NotificationDelivery = z.infer<typeof NotificationDeliverySchema>;
