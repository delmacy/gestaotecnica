import { z } from "zod";

export const ConnectorResultEnvelopeSchema = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("success"),
    data: z.unknown().optional(),
  }),
  z.object({
    status: z.literal("retryable_failure"),
    errorCode: z.string().min(1),
    message: z.string().optional(),
  }),
  z.object({
    status: z.literal("permanent_failure"),
    errorCode: z.string().min(1),
    message: z.string().optional(),
  }),
  z.object({
    status: z.literal("cancelled"),
    errorCode: z.string().min(1),
    message: z.string().optional(),
  }),
]);

export type ConnectorResultEnvelope = Readonly<z.infer<typeof ConnectorResultEnvelopeSchema>>;
