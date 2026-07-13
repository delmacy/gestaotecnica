import { z } from 'zod';

export const CONNECTOR_TIMEOUT_DEFAULT = 30000;

export const ConnectorRequestSchema = z.object({
  destination: z.string().min(1),
  method: z.string().min(1),
  idempotencyKey: z.string().min(1),
  payload: z.unknown(),
  timeout: z.number().int().positive().min(1000).max(300000).default(CONNECTOR_TIMEOUT_DEFAULT),
  redactedFields: z.array(z.string()).optional(),
});

export type ConnectorRequest = Readonly<z.infer<typeof ConnectorRequestSchema>>;
