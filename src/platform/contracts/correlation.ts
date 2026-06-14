import { z } from "zod";

/**
 * CorrelationId - non-empty string used for tracking a request across services.
 */
export const CorrelationIdSchema = z.string().min(1);
export type CorrelationId = z.infer<typeof CorrelationIdSchema>;

/**
 * CausationId - optional non-empty string referring to the event that triggered this one.
 */
export const CausationIdSchema = z.string().min(1).optional();
export type CausationId = z.infer<typeof CausationIdSchema>;

/**
 * IdempotencyKey - optional string for ensuring an operation is only performed once.
 */
export const IdempotencyKeySchema = z.string().min(1).optional();
export type IdempotencyKey = z.infer<typeof IdempotencyKeySchema>;

/**
 * CorrelationContext - preserves tracing and idempotency information.
 * Parsers must not substitute values received.
 */
export const CorrelationContextSchema = z.object({
  correlationId: CorrelationIdSchema,
  causationId: CausationIdSchema,
  idempotencyKey: IdempotencyKeySchema,
});

export type CorrelationContext = z.infer<typeof CorrelationContextSchema>;
