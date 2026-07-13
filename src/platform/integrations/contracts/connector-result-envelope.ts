import { z } from 'zod';

export const ConnectorResultSuccessSchema = z.object({
  status: z.literal('success'),
  data: z.unknown().optional(),
  redactedFields: z.array(z.string()).optional(),
});

export const ConnectorResultRetryableFailureSchema = z.object({
  status: z.literal('retryable_failure'),
  errorCode: z.string().min(1),
  errorMessage: z.string().optional(),
  redactedFields: z.array(z.string()).optional(),
});

export const ConnectorResultPermanentFailureSchema = z.object({
  status: z.literal('permanent_failure'),
  errorCode: z.string().min(1),
  errorMessage: z.string().optional(),
  redactedFields: z.array(z.string()).optional(),
});

export const ConnectorResultCancelledSchema = z.object({
  status: z.literal('cancelled'),
  errorCode: z.string().min(1).optional(),
  reason: z.string().optional(),
  redactedFields: z.array(z.string()).optional(),
});

export const ConnectorResultEnvelopeSchema = z.discriminatedUnion('status', [
  ConnectorResultSuccessSchema,
  ConnectorResultRetryableFailureSchema,
  ConnectorResultPermanentFailureSchema,
  ConnectorResultCancelledSchema,
]);

export type ConnectorResultEnvelope = Readonly<z.infer<typeof ConnectorResultEnvelopeSchema>>;
