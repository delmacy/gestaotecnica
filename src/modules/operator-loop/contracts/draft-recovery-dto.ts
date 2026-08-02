import { z } from "zod";

export const RecoverableDraftSchema = z.object({
  id: z.string().uuid(),
  entityType: z.string(),
  title: z.string(),
  updatedAt: z.date(),
  recoveryUrl: z.string(),
});
export type RecoverableDraft = z.infer<typeof RecoverableDraftSchema>;

export const DraftRecoveryResponseSchema = z.discriminatedUnion("state", [
  z.object({ state: z.literal("real"), drafts: z.array(RecoverableDraftSchema) }),
  z.object({ state: z.literal("synthetic"), drafts: z.array(RecoverableDraftSchema), label: z.string() }),
  z.object({ state: z.literal("demo"), message: z.string().optional() }),
  z.object({ state: z.literal("empty"), message: z.string().optional() }),
  z.object({ state: z.literal("blocked"), message: z.string().optional() }),
]);

export type DraftRecoveryResponse = z.infer<typeof DraftRecoveryResponseSchema>;
