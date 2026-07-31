import { z } from "zod";

export const EvidenceSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable().optional(),
  fileUrl: z.string().url().nullable().optional(),
  mimeType: z.string().nullable().optional(),
  createdAt: z.date(),
  serviceOrderId: z.string().uuid().nullable().optional(),
  serviceOrderCode: z.string().nullable().optional(),
  serviceOrderTitle: z.string().nullable().optional(),
  workItemId: z.string().uuid().nullable().optional(),
  workItemTitle: z.string().nullable().optional(),
  assetId: z.string().uuid().nullable().optional(),
  assetCode: z.string().nullable().optional(),
  assetName: z.string().nullable().optional(),
});

export type Evidence = z.infer<typeof EvidenceSchema>;
