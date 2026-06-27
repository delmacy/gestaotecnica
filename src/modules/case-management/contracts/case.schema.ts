import { z } from "zod";
import { SafeJsonRecordSchema } from "@/platform/contracts/safe-json";

export const CaseStatusSchema = z.enum(["open", "in_progress", "pending", "resolved", "closed"]);
export type CaseStatus = z.infer<typeof CaseStatusSchema>;

export const CasePrioritySchema = z.enum(["low", "medium", "high", "critical"]);
export type CasePriority = z.infer<typeof CasePrioritySchema>;

export const CaseSchema = z.object({
  id: z.string().uuid(),
  workspaceId: z.string().uuid(),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  status: CaseStatusSchema.default("open"),
  priority: CasePrioritySchema.default("medium"),
  category: z.string().min(1),
  responsibleId: z.string().uuid().optional(),
  metadata: SafeJsonRecordSchema.default({}),
  createdAt: z.date(),
  updatedAt: z.date(),
}).strict();
export type Case = z.infer<typeof CaseSchema>;

export const CreateCaseInputSchema = CaseSchema.pick({
  title: true,
  description: true,
  priority: true,
  category: true,
  responsibleId: true,
  metadata: true,
}).extend({
  workspaceId: z.string().uuid(),
}).strict();
export type CreateCaseInput = z.infer<typeof CreateCaseInputSchema>;

export const UpdateCaseInputSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: CaseStatusSchema.optional(),
  priority: CasePrioritySchema.optional(),
  category: z.string().optional(),
  responsibleId: z.string().uuid().optional(),
  metadata: SafeJsonRecordSchema.optional(),
}).strict();
export type UpdateCaseInput = z.infer<typeof UpdateCaseInputSchema>;

export const AddCaseCommentInputSchema = z.object({
  id: z.string().uuid(),
  body: z.string().min(1),
}).strict();
export type AddCaseCommentInput = z.infer<typeof AddCaseCommentInputSchema>;

export const CaseCommentSchema = z.object({
  id: z.string().uuid(),
  body: z.string().min(1),
  authorName: z.string().optional(),
  createdAt: z.date(),
}).strict();
export type CaseComment = z.infer<typeof CaseCommentSchema>;

export const CaseHistoryEventSchema = z.object({
  id: z.string().uuid(),
  eventType: z.string(),
  payload: SafeJsonRecordSchema,
  occurredAt: z.date(),
}).strict();
export type CaseHistoryEvent = z.infer<typeof CaseHistoryEventSchema>;
