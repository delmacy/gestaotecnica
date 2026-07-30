import { z } from "zod";

export const ApprovalQueueItemSchema = z.object({
  id: z.string().uuid(),
  code: z.string(),
  title: z.string(),
  objective: z.string().nullable(),
  status: z.string(),
  priority: z.string(),
  completedAt: z.date().nullable(),
  createdAt: z.date(),
  workItemId: z.string().uuid().nullable(),
  workItemTitle: z.string().nullable(),
  assetId: z.string().uuid().nullable(),
  assetCode: z.string().nullable(),
  assetName: z.string().nullable(),
}).strict();

export type ApprovalQueueItem = z.infer<typeof ApprovalQueueItemSchema>;

export const ApprovalSummaryItemSchema = z.object({
  label: z.string(),
  value: z.number().int().nonnegative(),
}).strict();

export type ApprovalSummaryItem = z.infer<typeof ApprovalSummaryItemSchema>;

export const ApprovalDecisionInputSchema = z.object({
  serviceOrderId: z.string().uuid(),
  decision: z.enum(["approve", "reject"]),
  note: z.string().optional(),
}).strict();

export type ApprovalDecisionInput = z.infer<typeof ApprovalDecisionInputSchema>;


