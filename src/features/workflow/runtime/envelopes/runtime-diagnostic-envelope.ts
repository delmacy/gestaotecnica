import { z } from "zod";
import { CorrelationIdSchema, EntityIdSchema } from "@/platform/contracts";
import { RedactionClassSchema } from "@/platform/documents/traceability";

export const RuntimeDiagnosticEnvelopeSchema = z.object({
  correlationId: CorrelationIdSchema,
  processId: EntityIdSchema,
  actionId: EntityIdSchema,
  redactionClass: RedactionClassSchema,
}).strict();

export type RuntimeDiagnosticEnvelope = Readonly<z.infer<typeof RuntimeDiagnosticEnvelopeSchema>>;
