import { z } from "zod";
import { SafeJsonRecordSchema } from "@/platform/contracts/safe-json";

export const TechnicianLevelSchema = z.enum(["trainee", "pleno", "especialista", "supervisor"]);
export type TechnicianLevel = z.infer<typeof TechnicianLevelSchema>;

export const WorkforceMemberStatusSchema = z.enum(["active", "inactive", "away", "training"]);
export type WorkforceMemberStatus = z.infer<typeof WorkforceMemberStatusSchema>;

export const WorkforceMemberSchema = z.object({
  id: z.string().uuid().optional(),
  workspaceId: z.string().uuid(),
  userId: z.string().uuid().optional(),
  name: z.string().min(1),
  teamId: z.string().uuid().optional(),
  level: TechnicianLevelSchema.default("trainee"),
  function: z.string().optional(),
  competencies: z.array(z.string()).default([]),
  registrationCode: z.string().optional(),
  specialty: z.string().optional(),
  status: WorkforceMemberStatusSchema.default("active"),
  isAvailable: z.boolean().default(true),
  metadata: SafeJsonRecordSchema.default({}),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}).strict();
export type WorkforceMember = z.infer<typeof WorkforceMemberSchema>;

export const CreateWorkforceMemberInputSchema = WorkforceMemberSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).strict();

export const UnavailabilityReasonSchema = z.enum(["vacation", "sick_leave", "training", "personal", "other"]);
export type UnavailabilityReason = z.infer<typeof UnavailabilityReasonSchema>;

export const UnavailabilityStatusSchema = z.enum(["planned", "active", "completed", "cancelled"]);
export type UnavailabilityStatus = z.infer<typeof UnavailabilityStatusSchema>;

export const WorkforceUnavailabilitySchema = z.object({
  id: z.string().uuid().optional(),
  workspaceId: z.string().uuid(),
  memberId: z.string().uuid(),
  reason: UnavailabilityReasonSchema,
  startsAt: z.date(),
  endsAt: z.date().optional(),
  status: UnavailabilityStatusSchema.default("planned"),
  notes: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}).strict();
export type WorkforceUnavailability = z.infer<typeof WorkforceUnavailabilitySchema>;

export const CreateUnavailabilityInputSchema = WorkforceUnavailabilitySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).strict();
