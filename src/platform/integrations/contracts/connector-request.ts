import { z } from 'zod';

export const ConnectorRequestSchema = z.object({
  destination: z.string().min(1),
  method: z.string().min(1),
  idempotencyKey: z.string().min(1),
  payload: z.unknown(),
  timeout: z.number().int().positive(),
});

export type ConnectorRequest = Readonly<z.infer<typeof ConnectorRequestSchema>>;
