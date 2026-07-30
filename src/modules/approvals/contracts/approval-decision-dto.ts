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

export const ApprovalDecisionResultSchema = z.object({
  id: z.string(),
  status: z.string(),
}).strict();

export type ApprovalDecisionResult = z.infer<typeof ApprovalDecisionResultSchema>;

export const ApprovalQueueViewStateSchema = z.enum([
  "empty",
  "data",
  "blocked",
  "demo",
]);

export type ApprovalQueueViewState = z.infer<typeof ApprovalQueueViewStateSchema>;

export const ApprovalQueuePageDTOSchema = z.object({
  state: ApprovalQueueViewStateSchema,
  items: z.array(ApprovalQueueItemSchema),
  summary: z.array(ApprovalSummaryItemSchema),
  stateMessage: z.string().optional(),
}).strict();

export type ApprovalQueuePageDTO = z.infer<typeof ApprovalQueuePageDTOSchema>;
