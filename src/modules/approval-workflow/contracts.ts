import { z } from "zod";

export const approvalStatusSchema = z.enum(["pending", "approved", "rejected", "cancelled", "completed"]);
export type ApprovalStatus = z.infer<typeof approvalStatusSchema>;

export const approverTypeSchema = z.enum(["user", "role"]);
export type ApproverType = z.infer<typeof approverTypeSchema>;

export const approvalRequestSchema = z.object({
  id: z.string().uuid(),
  workspaceId: z.string().uuid(),
  title: z.string(),
  description: z.string().optional(),
  subjectType: z.string(),
  subjectId: z.string(),
  status: approvalStatusSchema,
  currentStep: z.number().int().nonnegative(),
  requestedBy: z.string().uuid(),
  metadata: z.record(z.string(), z.unknown()).default({}),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ApprovalRequest = z.infer<typeof approvalRequestSchema>;

export const approvalStepSchema = z.object({
  id: z.string().uuid(),
  requestId: z.string().uuid(),
  order: z.number().int().nonnegative(),
  approverType: approverTypeSchema,
  approverId: z.string().uuid(),
  status: approvalStatusSchema,
  decision: z.enum(["approve", "reject"]).optional(),
  decidedBy: z.string().uuid().optional(),
  decidedAt: z.date().optional(),
  reason: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

export type ApprovalStep = z.infer<typeof approvalStepSchema>;
