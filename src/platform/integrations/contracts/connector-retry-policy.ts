import { z } from 'zod';

export const ConnectorRetryPolicySchema = z.object({
  maxAttempts: z.number().int().positive(),
  backoff: z.number().int().nonnegative(),
  retryableErrorClasses: z.array(z.string().min(1))
});

export type ConnectorRetryPolicy = Readonly<z.infer<typeof ConnectorRetryPolicySchema>>;
