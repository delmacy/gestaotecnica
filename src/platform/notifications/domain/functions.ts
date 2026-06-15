import {
  NotificationIntent,
  NotificationIntentSchema,
  NotificationRecipient,
  NotificationChannel,
  NotificationDelivery,
  NotificationAttempt,
  NotificationFailure,
  NotificationDeliveryStatus
} from "../contracts";
import { ISODateTime } from "@/platform/contracts/time";

/**
 * Validates a notification recipient against a channel.
 * Pure function: deterministic, no side effects.
 */
export function validateNotificationRecipient(
  recipient: NotificationRecipient,
  channel: NotificationChannel
): { valid: true } | { valid: false; reason: string } {
  if (channel === "webhook" && recipient.type !== "webhook_endpoint") {
    return { valid: false, reason: "Webhook channel requires a webhook_endpoint recipient" };
  }

  if (recipient.type === "webhook_endpoint" && channel !== "webhook") {
    return { valid: false, reason: "Webhook endpoint recipient requires webhook channel" };
  }

  if (recipient.type === "external_address") {
    if (channel === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(recipient.address)) {
        return { valid: false, reason: "Invalid email address format" };
      }
    } else if (channel === "sms") {
      const smsRegex = /^\+[1-9]\d{1,14}$/; // E.164
      if (!smsRegex.test(recipient.address)) {
        return { valid: false, reason: "Invalid SMS phone number format (E.164 required)" };
      }
    } else {
      return { valid: false, reason: `External address recipient not compatible with channel ${channel}` };
    }
  }

  return { valid: true };
}

/**
 * Creates a notification intent.
 * Pure function: receives all inputs (including ID and timestamps) explicitly.
 */
export function createNotificationIntent(input: unknown): NotificationIntent {
  const intent = NotificationIntentSchema.parse(input);

  const validation = validateNotificationRecipient(intent.recipient, intent.channel);
  if (!validation.valid) {
    throw new Error(`Invalid intent: ${validation.reason}`);
  }

  return Object.freeze(JSON.parse(JSON.stringify(intent)));
}

/**
 * Creates a new notification attempt.
 * Pure function: returns a new delivery object with the new attempt.
 */
export function createNotificationAttempt(
  delivery: NotificationDelivery,
  context: {
    number: number;
    attemptedAt: ISODateTime;
    status: NotificationDeliveryStatus;
    providerReference?: string;
  }
): NotificationDelivery {
  const newAttempt: NotificationAttempt = {
    number: context.number,
    attemptedAt: context.attemptedAt,
    status: context.status,
    providerReference: context.providerReference,
  };

  const newDelivery: NotificationDelivery = {
    ...delivery,
    status: context.status,
    attempts: [...delivery.attempts, newAttempt],
    lastAttemptAt: context.attemptedAt,
  };

  return Object.freeze(JSON.parse(JSON.stringify(newDelivery)));
}

/**
 * Marks a notification as delivered.
 * Pure function.
 */
export function markNotificationDelivered(
  delivery: NotificationDelivery,
  context: { deliveredAt: ISODateTime; providerReference?: string }
): NotificationDelivery {
  const newDelivery: NotificationDelivery = {
    ...delivery,
    status: "delivered",
    deliveredAt: context.deliveredAt,
  };

  // If there was an attempt, we could update its status too, but usually a new attempt is created for each try.
  // This function assumes the delivery is now successful.

  return Object.freeze(JSON.parse(JSON.stringify(newDelivery)));
}

/**
 * Marks a notification as failed.
 * Pure function.
 */
export function markNotificationFailed(
  delivery: NotificationDelivery,
  failure: NotificationFailure
): NotificationDelivery {
  const newDelivery: NotificationDelivery = {
    ...delivery,
    status: "failed",
  };

  if (newDelivery.attempts.length > 0) {
    const lastAttempt = newDelivery.attempts[newDelivery.attempts.length - 1];
    const updatedLastAttempt = {
      ...lastAttempt,
      status: "failed" as const,
      failure,
    };
    newDelivery.attempts = [
      ...newDelivery.attempts.slice(0, -1),
      updatedLastAttempt,
    ];
  }

  return Object.freeze(JSON.parse(JSON.stringify(newDelivery)));
}
