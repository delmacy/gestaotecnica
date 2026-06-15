import {
  NotificationIntent,
  NotificationIntentSchema,
  NotificationRecipient,
  NotificationChannel,
  NotificationDelivery,
  NotificationAttempt,
  NotificationFailure,
  NotificationDeliveryStatus,
  NotificationDeliverySchema
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
 * Validates state transitions for notification delivery.
 */
function isValidTransition(from: NotificationDeliveryStatus, to: NotificationDeliveryStatus): boolean {
  if (from === to) return true;

  const transitions: Record<NotificationDeliveryStatus, NotificationDeliveryStatus[]> = {
    pending: ["queued", "cancelled"],
    queued: ["processing", "cancelled"],
    processing: ["delivered", "failed", "cancelled"],
    failed: ["processing", "cancelled"], // retry
    delivered: [], // terminal
    cancelled: [], // terminal
    suppressed: ["pending", "cancelled"], // can be unsuppressed/retry?
  };

  return transitions[from]?.includes(to) ?? false;
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
    number?: number;
    attemptedAt: ISODateTime;
    status: NotificationDeliveryStatus;
    providerReference?: string;
  }
): NotificationDelivery {
  // 1. Validate identity preservation
  const { intentId, workspaceId, metadata, attempts: previousAttempts, status: currentStatus } = delivery;

  // 2. Validate transition
  if (!isValidTransition(currentStatus, context.status)) {
    throw new Error(`Invalid state transition from ${currentStatus} to ${context.status}`);
  }

  // 3. Enforce canonical attempt numbering
  const expectedNumber = previousAttempts.length + 1;
  if (context.number !== undefined && context.number !== expectedNumber) {
    throw new Error(`Invalid attempt number: expected ${expectedNumber}, got ${context.number}`);
  }

  const newAttempt: NotificationAttempt = {
    number: expectedNumber,
    attemptedAt: context.attemptedAt,
    status: context.status,
    providerReference: context.providerReference,
  };

  const candidate: NotificationDelivery = {
    intentId,
    workspaceId,
    metadata: JSON.parse(JSON.stringify(metadata)),
    status: context.status,
    attempts: [...JSON.parse(JSON.stringify(previousAttempts)), newAttempt],
    lastAttemptAt: context.attemptedAt,
  };

  return Object.freeze(NotificationDeliverySchema.parse(candidate));
}

/**
 * Marks a notification as delivered.
 * Pure function.
 */
export function markNotificationDelivered(
  delivery: NotificationDelivery,
  context: { deliveredAt: ISODateTime; providerReference?: string }
): NotificationDelivery {
  const { intentId, workspaceId, metadata, attempts, status: currentStatus } = delivery;

  if (!isValidTransition(currentStatus, "delivered")) {
    throw new Error(`Invalid state transition from ${currentStatus} to delivered`);
  }

  if (attempts.length === 0) {
    throw new Error("Cannot mark as delivered without an existing attempt");
  }

  const lastAttempt = attempts[attempts.length - 1];
  if (lastAttempt.status !== "processing") {
    throw new Error("Cannot mark as delivered unless the last attempt was in 'processing' state");
  }

  const updatedAttempts = [...JSON.parse(JSON.stringify(attempts))];
  const updatedLastAttempt = updatedAttempts[updatedAttempts.length - 1];
  updatedLastAttempt.status = "delivered";
  if (context.providerReference) {
    updatedLastAttempt.providerReference = context.providerReference;
  }

  const candidate: NotificationDelivery = {
    intentId,
    workspaceId,
    metadata: JSON.parse(JSON.stringify(metadata)),
    status: "delivered",
    attempts: updatedAttempts,
    lastAttemptAt: delivery.lastAttemptAt,
    deliveredAt: context.deliveredAt,
  };

  return Object.freeze(NotificationDeliverySchema.parse(candidate));
}

/**
 * Marks a notification as failed.
 * Pure function.
 */
export function markNotificationFailed(
  delivery: NotificationDelivery,
  failure: NotificationFailure
): NotificationDelivery {
  const { intentId, workspaceId, metadata, attempts, status: currentStatus } = delivery;

  if (!isValidTransition(currentStatus, "failed")) {
    throw new Error(`Invalid state transition from ${currentStatus} to failed`);
  }

  if (attempts.length === 0) {
    throw new Error("Cannot mark as failed without an existing attempt (Option A)");
  }

  const updatedAttempts = [...JSON.parse(JSON.stringify(attempts))];
  const lastAttempt = updatedAttempts[updatedAttempts.length - 1];

  lastAttempt.status = "failed";
  lastAttempt.failure = failure;

  const candidate: NotificationDelivery = {
    intentId,
    workspaceId,
    metadata: JSON.parse(JSON.stringify(metadata)),
    status: "failed",
    attempts: updatedAttempts,
    lastAttemptAt: delivery.lastAttemptAt,
    deliveredAt: delivery.deliveredAt,
  };

  return Object.freeze(NotificationDeliverySchema.parse(candidate));
}
