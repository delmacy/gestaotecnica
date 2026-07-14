import { z } from 'zod';

export const BlueprintExportResultEnvelopeSchema = z.object({
  artifactMetadata: z.record(z.string(), z.unknown(), {
    message: "MISSING_ARTIFACT_METADATA"
  }),
  warnings: z.array(z.string().min(1, { message: "EMPTY_WARNING" }), {
    message: "MISSING_WARNINGS"
  }),
  blockers: z.array(z.string().min(1, { message: "EMPTY_BLOCKER" }), {
    message: "MISSING_BLOCKERS"
  })
});

export type BlueprintExportResultEnvelope = Readonly<z.infer<typeof BlueprintExportResultEnvelopeSchema>>;
