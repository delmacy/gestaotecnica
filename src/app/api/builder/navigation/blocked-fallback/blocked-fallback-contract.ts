import { z } from 'zod';

export const BlockedFallbackReasonSchema = z.enum([
  'unauthorized',
  'forbidden_workspace',
  'forbidden_platform',
  'not_found',
  'system_error',
  'demo_restricted'
]);

export type BlockedFallbackReason = z.infer<typeof BlockedFallbackReasonSchema>;

export const BlockedFallbackDestinationSchema = z.object({
  fallbackPath: z.string(),
  userMessage: z.string(),
  reason: BlockedFallbackReasonSchema,
  shouldRedirect: z.boolean(),
});

export type BlockedFallbackDestination = z.infer<typeof BlockedFallbackDestinationSchema>;
