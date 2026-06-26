import { z } from "zod";
import { SafeJsonRecordSchema } from "@/platform/contracts";

export const CasePrioritySchema = z.enum(["low", "medium", "high", "critical"]);
export type CasePriority = z.infer<typeof CasePrioritySchema>;

export const CaseStatusSchema = z.enum(["open", "in_progress", "pending", "resolved", "closed"]);
export type CaseStatus = z.infer<typeof CaseStatusSchema>;

export const CaseOriginSchema = z.enum(["manual", "email", "api", "integration", "automation", "system"]);
export type CaseOrigin = z.infer<typeof CaseOriginSchema>;

export const CaseCommentSchema = z.object({
  id: z.string().uuid(),
  authorId: z.string().uuid(),
  authorName: z.string(),
  content: z.string().min(1),
  createdAt: z.date(),
}).strict();
export type CaseComment = z.infer<typeof CaseCommentSchema>;

export const CaseHistoryEventSchema = z.object({
  id: z.string().uuid(),
  eventType: z.string(),
  payload: SafeJsonRecordSchema,
  occurredAt: z.date(),
  authorId: z.string().uuid().optional(),
}).strict();
export type CaseHistoryEvent = z.infer<typeof CaseHistoryEventSchema>;

export const CaseSchema = z.object({
  id: z.string().uuid().optional(),
  workspaceId: z.string().uuid(),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  category: z.string().min(1),
  priority: CasePrioritySchema.default("medium"),
  status: CaseStatusSchema.default("open"),
  origin: CaseOriginSchema.default("manual"),
  assignedToId: z.string().uuid().optional(),
  assignedToName: z.string().optional(),
  metadata: SafeJsonRecordSchema.default({}),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}).strict();
export type Case = z.infer<typeof CaseSchema>;

export const CreateCaseInputSchema = CaseSchema.omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,
}).strict();
export type CreateCaseInput = z.infer<typeof CreateCaseInputSchema>;

export const UpdateCaseInputSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  category: z.string().min(1).optional(),
  priority: CasePrioritySchema.optional(),
  assignedToId: z.string().uuid().optional(),
  assignedToName: z.string().optional(),
  metadata: SafeJsonRecordSchema.optional(),
}).strict();
export type UpdateCaseInput = z.infer<typeof UpdateCaseInputSchema>;

export const ChangeCaseStatusInputSchema = z.object({
  id: z.string().uuid(),
  status: CaseStatusSchema,
  reason: z.string().optional(),
}).strict();
export type ChangeCaseStatusInput = z.infer<typeof ChangeCaseStatusInputSchema>;

export const AddCaseCommentInputSchema = z.object({
  caseId: z.string().uuid(),
  content: z.string().min(1),
}).strict();
export type AddCaseCommentInput = z.infer<typeof AddCaseCommentInputSchema>;
