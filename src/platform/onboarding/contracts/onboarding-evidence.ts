import { z } from "zod";

export const OnboardingEvidenceSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  stepCompleted: z.string(),
  timestamp: z.string().datetime(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type OnboardingEvidence = Readonly<z.infer<typeof OnboardingEvidenceSchema>>;
