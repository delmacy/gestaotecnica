import { z } from "zod";
import { SafeJsonRecordSchema } from "@/platform/contracts/safe-json";

export const IntakePrioritySchema = z.enum(["low", "medium", "high", "critical"]);
export type IntakePriority = z.infer<typeof IntakePrioritySchema>;

export const IntakeSourceSchema = z.enum(["manual", "email", "api", "integration", "automation"]);
export type IntakeSource = z.infer<typeof IntakeSourceSchema>;

export const IntakeStatusSchema = z.enum(["new", "triage", "qualified", "converted", "closed"]);
export type IntakeStatus = z.infer<typeof IntakeStatusSchema>;

export const IntakeRequesterSchema = z.object({
  name: z.string().min(1),
  contact: z.string().optional(),
  department: z.string().optional(),
}).strict();
export type IntakeRequester = z.infer<typeof IntakeRequesterSchema>;

export const IntakeRequestSchema = z.object({
  id: z.string().uuid().optional(),
  workspaceId: z.string().uuid(),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  category: z.string().min(1),
  priority: IntakePrioritySchema.default("medium"),
  source: IntakeSourceSchema.default("manual"),
  status: IntakeStatusSchema.default("new"),
  requester: IntakeRequesterSchema,
  metadata: SafeJsonRecordSchema.default({}),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}).strict();
export type IntakeRequest = z.infer<typeof IntakeRequestSchema>;

export const CreateIntakeInputSchema = IntakeRequestSchema.omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,
}).strict();
export type CreateIntakeInput = z.infer<typeof CreateIntakeInputSchema>;

export const TransitionIntakeInputSchema = z.object({
  id: z.string().uuid(),
  status: IntakeStatusSchema,
  reason: z.string().optional(),
  metadata: SafeJsonRecordSchema.optional(),
}).strict();
export type TransitionIntakeInput = z.infer<typeof TransitionIntakeInputSchema>;
