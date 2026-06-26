import { z } from "zod";
import { SafeJsonRecordSchema } from "@/platform/contracts/safe-json";

/**
 * State machine states
 */
export const ApprovalStatusSchema = z.enum(["pending", "approved", "rejected", "cancelled"]);
export type ApprovalStatus = z.infer<typeof ApprovalStatusSchema>;

/**
 * Valid decision values
 */
export const ApprovalDecisionValueSchema = z.enum(["approved", "rejected"]);
export type ApprovalDecisionValue = z.infer<typeof ApprovalDecisionValueSchema>;

/**
 * Allowed subject types for the universal module
 */
export const AllowedSubjectTypeSchema = z.enum([
  "service_order",
  "work_item",
  "document",
  "asset",
]);
export type AllowedSubjectType = z.infer<typeof AllowedSubjectTypeSchema>;

/**
 * Canonical Approval Request Schema
 */
export const ApprovalRequestSchema = z.object({
  id: z.string().uuid().optional(),
  workspaceId: z.string().uuid(),
  subjectType: AllowedSubjectTypeSchema,
  subjectId: z.string().min(1),
  requesterId: z.string().uuid(),
  requesterName: z.string().min(1),
  approverId: z.string().uuid().optional(),
  approverName: z.string().optional(),
  status: ApprovalStatusSchema.default("pending"),
  comment: z.string().optional(),
  decision: ApprovalDecisionValueSchema.optional(),
  decidedAt: z.date().optional(),
  metadata: SafeJsonRecordSchema.default({}),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}).strict();
export type ApprovalRequest = z.infer<typeof ApprovalRequestSchema>;

/**
 * Event Log Entry
 */
export const ApprovalHistoryEventSchema = z.object({
  id: z.string().uuid(),
  eventType: z.string(),
  payload: SafeJsonRecordSchema,
  occurredAt: z.date(),
}).strict();
export type ApprovalHistoryEvent = z.infer<typeof ApprovalHistoryEventSchema>;

/**
 * Input for creating a request
 */
export const CreateApprovalInputSchema = ApprovalRequestSchema.pick({
  subjectType: true,
  subjectId: true,
  comment: true,
  metadata: true,
}).extend({
  // workspaceId and requester info are resolved from context
}).strict();
export type CreateApprovalInput = z.infer<typeof CreateApprovalInputSchema>;

/**
 * Input for making a decision
 */
export const DecideApprovalInputSchema = z.object({
  id: z.string().uuid(),
  decision: ApprovalDecisionValueSchema,
  comment: z.string().optional(),
  metadata: SafeJsonRecordSchema.optional(),
}).strict().superRefine((data, ctx) => {
  if (data.decision === "rejected" && (!data.comment || data.comment.trim().length < 5)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Justificativa obrigatória para rejeição (mínimo 5 caracteres).",
      path: ["comment"],
    });
  }
});
export type DecideApprovalInput = z.infer<typeof DecideApprovalInputSchema>;
