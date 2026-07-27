import { z } from "zod";

export const RuntimeEvidenceHandoffRequestSchema = z.object({
  processId: z.string(),
  executionPayload: z.record(z.string(), z.unknown()),
  timestamp: z.string(),
});

export type RuntimeEvidenceHandoffRequest = z.infer<typeof RuntimeEvidenceHandoffRequestSchema>;

export const RuntimeEvidenceHandoffResponseSchema = z.object({
  success: z.boolean(),
  evidenceId: z.string().optional(),
  receiptUrl: z.string().optional(),
  message: z.string().optional(),
  status: z.enum(['success', 'empty', 'blocked', 'demo', 'synthetic']).optional()
});

export type RuntimeEvidenceHandoffResponse = z.infer<typeof RuntimeEvidenceHandoffResponseSchema>;
