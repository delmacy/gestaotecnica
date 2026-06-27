import { z } from "zod";

/**
 * Universal Scheduling Domain Contracts
 *
 * Defines core schemas for the Scheduling module.
 */

// --- Policies (Configurable) ---

export const schedulingPolicySchema = z.object({
  maxShiftDurationHours: z.number().positive().default(12),
  minRestBetweenShiftsHours: z.number().positive().default(11),
  allowOverlapTypes: z.array(z.string()).default([]), // Universal: no defaults for overlap types
});

// --- Base Types ---

export const scheduleStatusSchema = z.enum([
  "planned",
  "confirmed",
  "cancelled",
  "completed",
]);

export const scheduleTypeSchema = z.string().min(1); // Universal: open string for extensibility

// --- Core Entities ---

/**
 * Represents a scheduled block of time for a resource.
 */
export const scheduleSchema = z.object({
  id: z.string().uuid(),
  workspaceId: z.string().uuid(),
  title: z.string().min(3).max(255),
  type: scheduleTypeSchema,
  status: scheduleStatusSchema,
  startsAt: z.date(),
  endsAt: z.date(),
  resourceId: z.string().uuid(), // Generic resource ID (TechnicianProfile.id)
  resourceType: z.enum(["technician", "team"]).default("technician"),
  notes: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).default({}),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}).refine(data => data.endsAt > data.startsAt, {
  message: "endsAt must be after startsAt",
  path: ["endsAt"],
});

/**
 * Recurring shift patterns.
 */
export const shiftTemplateSchema = z.object({
  id: z.string().uuid(),
  workspaceId: z.string().uuid(),
  name: z.string().min(3),
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  isActive: z.boolean().default(true),
});

/**
 * Allocation links a resource to a generic subject during a schedule.
 */
export const allocationSchema = z
  .object({
    id: z.string().uuid(),
    workspaceId: z.string().uuid(),
    scheduleId: z.string().uuid(),
    resourceId: z.string().uuid(),
    subjectType: z.string(), // Generic: "service_order", "work_item", etc.
    subjectId: z.string().uuid().optional(),
    status: z.enum(["planned", "active", "completed", "cancelled"]),
    startsAt: z.date().optional(),
    endsAt: z.date().optional(),
    effortMinutes: z.number().int().positive().optional(),
  })
  .refine(
    (data) => {
      if (data.startsAt && data.endsAt) {
        return data.endsAt > data.startsAt;
      }
      return true;
    },
    {
      message: "endsAt must be after startsAt",
      path: ["endsAt"],
    },
  );

const availabilityBase = z.object({
  id: z.string().uuid(),
  workspaceId: z.string().uuid(),
  resourceId: z.string().uuid(),
  type: z.enum(["available", "unavailable"]),
  reason: z.string().optional(),
  startsAt: z.date(),
  endsAt: z.date(),
});

export const availabilitySchema = availabilityBase.refine(
  (data) => data.endsAt > data.startsAt,
  {
    message: "endsAt must be after startsAt",
    path: ["endsAt"],
  },
);

export const unavailabilitySchema = availabilityBase
  .extend({
    type: z.literal("unavailable"),
    reason: z.string().min(1),
  })
  .refine((data) => data.endsAt > data.startsAt, {
    message: "endsAt must be after startsAt",
    path: ["endsAt"],
  });

/**
 * Analysis entities.
 */
export const coverageSchema = z
  .object({
    workspaceId: z.string().uuid(),
    periodStart: z.date(),
    periodEnd: z.date(),
    requiredCount: z.number().int().nonnegative(),
    actualCount: z.number().int().nonnegative(),
    status: z.enum(["under", "optimal", "over"]),
  })
  .refine((data) => data.periodEnd > data.periodStart, {
    message: "periodEnd must be after periodStart",
    path: ["periodEnd"],
  });

export const conflictSchema = z.object({
  id: z.string().uuid(),
  workspaceId: z.string().uuid(),
  type: z.enum(["overlap", "policy_violation", "missing_capability"]),
  severity: z.enum(["warning", "error"]),
  entities: z.array(z.object({
    type: z.string(),
    id: z.string().uuid(),
  })),
  description: z.string(),
  resolvedAt: z.date().optional(),
});

export const assignmentSchema = z.object({
  id: z.string().uuid(),
  workspaceId: z.string().uuid(),
  scheduleId: z.string().uuid(),
  resourceId: z.string().uuid(),
  role: z.string().default("member"),
  assignedAt: z.date(),
});

// --- Events ---

export const schedulingEventsSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("schedule.created"), payload: scheduleSchema }),
  z.object({ type: z.literal("schedule.updated"), payload: scheduleSchema }),
  z.object({ type: z.literal("conflict.detected"), payload: conflictSchema }),
  z.object({ type: z.literal("allocation.confirmed"), payload: allocationSchema }),
]);

// --- Workforce Interaction ---

export const workforceSchedulingInterfaceSchema = z.object({
  memberId: z.string().uuid(), // Universal member/resource identifier
  isAvailable: z.boolean(),
  currentScheduleId: z.string().uuid().optional(),
});

// --- Dynamic Validation ---

export function createShiftValidator(policy: z.infer<typeof schedulingPolicySchema>) {
  return z.object({
    startsAt: z.date(),
    endsAt: z.date(),
  }).refine(data => {
    const diffMs = data.endsAt.getTime() - data.startsAt.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours <= policy.maxShiftDurationHours;
  }, {
    message: `Shift duration exceeds policy limit of ${policy.maxShiftDurationHours} hours`,
  });
}

export function createRestPeriodValidator(policy: z.infer<typeof schedulingPolicySchema>) {
  return z.object({
    previousShiftEnd: z.date(),
    nextShiftStart: z.date(),
  }).refine(data => {
    const diffMs = data.nextShiftStart.getTime() - data.previousShiftEnd.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours >= policy.minRestBetweenShiftsHours;
  }, {
    message: `Rest period is below policy limit of ${policy.minRestBetweenShiftsHours} hours`,
  });
}

// --- Types ---

export type Schedule = z.infer<typeof scheduleSchema>;
export type ShiftTemplate = z.infer<typeof shiftTemplateSchema>;
export type Allocation = z.infer<typeof allocationSchema>;
export type Availability = z.infer<typeof availabilitySchema>;
export type Conflict = z.infer<typeof conflictSchema>;
export type SchedulingEvent = z.infer<typeof schedulingEventsSchema>;
export type SchedulingPolicy = z.infer<typeof schedulingPolicySchema>;
