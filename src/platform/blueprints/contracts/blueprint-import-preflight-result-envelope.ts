import { z } from 'zod';

export const BlueprintImportPreflightResultEnvelopeSchema = z.object({
  compatible: z.boolean({
    message: "MISSING_COMPATIBLE_FLAG"
  }),
  warnings: z.array(z.string().min(1, { message: "EMPTY_WARNING" }), {
    message: "MISSING_WARNINGS"
  }),
  blockers: z.array(z.string().min(1, { message: "EMPTY_BLOCKER" }), {
    message: "MISSING_BLOCKERS"
  }),
  requiredApprovals: z.array(z.string().min(1, { message: "EMPTY_REQUIRED_APPROVAL" }), {
    message: "MISSING_REQUIRED_APPROVALS"
  })
});

export type BlueprintImportPreflightResultEnvelope = Readonly<z.infer<typeof BlueprintImportPreflightResultEnvelopeSchema>>;
