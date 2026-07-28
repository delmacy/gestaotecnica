import { z } from "zod";
import { SafeJsonRecordSchema } from "@/platform/contracts/safe-json";
import { workItemPriorities, workItemStatuses, workItemTypes } from "../constants";

export const WorkItemPrioritySchema = z.enum(
  workItemPriorities.map((p) => p.value) as [string, ...string[]]
);
export type WorkItemPriority = z.infer<typeof WorkItemPrioritySchema>;

export const WorkItemStatusSchema = z.enum(
  workItemStatuses.map((s) => s.value) as [string, ...string[]]
);
export type WorkItemStatus = z.infer<typeof WorkItemStatusSchema>;

export const WorkItemTypeSchema = z.enum(
  workItemTypes.map((t) => t.value) as [string, ...string[]]
);
export type WorkItemType = z.infer<typeof WorkItemTypeSchema>;

export const WorkItemSchema = z.object({
  id: z.string().uuid(),
  title: z.string().trim().min(1).max(255),
  description: z.string().nullable(),
  type: WorkItemTypeSchema.default("solicitacao"),
  status: WorkItemStatusSchema.default("open"),
  priority: WorkItemPrioritySchema.default("medium"),
  requesterName: z.string().nullable(),
  requesterContact: z.string().nullable(),
  assetId: z.string().uuid().nullable(),
  assignedTeamId: z.string().uuid().nullable(),
  createdById: z.string().uuid().nullable(),
  payload: SafeJsonRecordSchema.default({}),
  createdAt: z.date(),
  updatedAt: z.date(),
}).strict();

export type WorkItem = z.infer<typeof WorkItemSchema>;

export const CreateWorkItemInputSchema = z.object({
  title: z.string().trim().min(1).max(255),
  description: z.string().optional(),
  type: z.string().optional().transform(val =>
    workItemTypes.some(t => t.value === val) ? val : "solicitacao"
  ),
  priority: z.string().optional().transform(val =>
    workItemPriorities.some(p => p.value === val) ? val : "medium"
  ),
  autoCreateServiceOrder: z.boolean().default(false),
}).strict();

export type CreateWorkItemInput = z.infer<typeof CreateWorkItemInputSchema>;

export const TransitionWorkItemInputSchema = z.object({
  workItemId: z.string().uuid(),
  status: z.string().optional().transform(val =>
    workItemStatuses.some(s => s.value === val) ? val : "triaged"
  ),
  note: z.string().optional(),
}).strict();

export type TransitionWorkItemInput = z.infer<typeof TransitionWorkItemInputSchema>;
