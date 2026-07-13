import { z } from 'zod';

export const BlueprintCompatibilityCheckResultEnvelopeSchema = z.object({
  compatible: z.boolean({
    message: "MISSING_COMPATIBLE_FLAG"
  }),
  warnings: z.array(z.string().min(1, { message: "EMPTY_WARNING" }), {
    message: "MISSING_WARNINGS"
  }),
  blockers: z.array(z.string().min(1, { message: "EMPTY_BLOCKER" }), {
    message: "MISSING_BLOCKERS"
  })
});

export type BlueprintCompatibilityCheckResultEnvelope = Readonly<z.infer<typeof BlueprintCompatibilityCheckResultEnvelopeSchema>>;
