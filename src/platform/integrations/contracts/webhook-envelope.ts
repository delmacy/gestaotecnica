import { z } from "zod";

export const IntegrationWebhookEnvelopeSchema = z.object({
  id: z.string().uuid().optional(),
  pluginKey: z.string().optional(),
  direction: z.enum(["inbound", "outbound"]).default("inbound"),
  eventType: z.string().min(1),
  targetModule: z.string().optional(),
  status: z.enum(["received", "processed", "failed"]).default("received"),
  source: z.string().optional(),
  payload: z.record(z.string(), z.unknown()).default({}),
  receivedAt: z.coerce.date().optional(),
  processedAt: z.coerce.date().optional(),
  errorMessage: z.string().optional(),
});

export type IntegrationWebhookEnvelope = z.infer<typeof IntegrationWebhookEnvelopeSchema>;
