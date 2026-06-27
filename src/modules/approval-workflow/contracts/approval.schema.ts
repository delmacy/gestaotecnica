import { z } from "zod";

export const approvalStatusSchema = z.enum(["pending", "approved", "rejected", "cancelled", "completed"]);
export const approvalDecisionSchema = z.enum(["approve", "reject"]);

export const approvalRequestSchema = z.object({
  id: z.string().uuid(),
  workspaceId: z.string().uuid(),
  title: z.string().min(3),
  description: z.string().optional(),
  status: approvalStatusSchema,
  origin: z.string(),
  entityType: z.string(),
  entityId: z.string().uuid(),
  metadata: z.record(z.string(), z.unknown()).default({}),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const approvalStepSchema = z.object({
  id: z.string().uuid(),
  workspaceId: z.string().uuid(),
  requestId: z.string().uuid(),
  order: z.number().int().nonnegative(),
  status: approvalStatusSchema,
  approverId: z.string().uuid().optional(), // Membership ID or Team ID
  approverType: z.enum(["user", "team"]).default("user"),
  decision: approvalDecisionSchema.optional(),
  decidedAt: z.date().optional(),
  decidedById: z.string().uuid().optional(), // Real User ID from context
  note: z.string().optional(),
});

export const createApprovalRequestInputSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  entityType: z.string(),
  entityId: z.string().uuid(),
  steps: z.array(z.object({
    approverId: z.string().uuid(),
    approverType: z.enum(["user", "team"]).default("user"),
  })).min(1),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const decideApprovalInputSchema = z.object({
  requestId: z.string().uuid(),
  stepId: z.string().uuid(),
  decision: approvalDecisionSchema,
  note: z.string().optional(),
});

export type ApprovalRequest = z.infer<typeof approvalRequestSchema>;
export type ApprovalStep = z.infer<typeof approvalStepSchema>;
