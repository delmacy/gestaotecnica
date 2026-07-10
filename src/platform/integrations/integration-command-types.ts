import { z } from "zod";
import { IntegrationWebhookEnvelopeSchema } from "./contracts/webhook-envelope";

export type IntegrationCommandRequest = {
  workspaceKey?: string;
  command: string;
  idempotencyKey?: string;
  payload?: unknown;
};

export type IntegrationCommandResponse = {
  success: boolean;
  data?: unknown;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  correlationId: string;
};

export const IntegrationWebhookCommandEnvelopeSchema = IntegrationWebhookEnvelopeSchema.extend({
  idempotencyKey: z.string().min(1).max(255).optional(),
});

export type IntegrationWebhookCommandEnvelope = z.infer<typeof IntegrationWebhookCommandEnvelopeSchema>;
