import { eq, and } from "drizzle-orm";
import { getDb } from "@/db";
import { processCandidates } from "@/db/platform/schema/candidates";
import { events as eventLogs } from "@/db/runtime/schema/workflow";
import { resolveWorkspaceContext } from "@/platform/workspace";
import {
  CreateEmployeeInputSchema,
  UpdateEmployeeInputSchema,
  type CreateEmployeeInput,
  type UpdateEmployeeInput
} from "./contracts/hr.schema";

const HR_ORIGIN = "human-resources";

export async function createEmployee(input: CreateEmployeeInput) {
  const context = await resolveWorkspaceContext({ source: "ui" });
  const data = CreateEmployeeInputSchema.parse(input);
  const db = getDb();

  const [row] = await db
    .insert(processCandidates)
    .values({
      workspaceId: context.workspaceId,
      name: data.name,
      description: data.observations,
      status: data.status,
      origin: HR_ORIGIN,
      proposedDefinition: {
        registrationCode: data.registrationCode,
        position: data.position,
        department: data.department,
        managerId: data.managerId,
        managerName: data.managerName,
        admissionDate: data.admissionDate,
        contacts: data.contacts,
        metadata: data.metadata,
      },
    })
    .returning();

  await db.insert(eventLogs).values({
    workspaceId: context.workspaceId,
    entityId: row.id,
    entityType: "employee",
    eventType: "hr.employee.created",
    payload: {
      employeeId: row.id,
      name: row.name,
      registrationCode: data.registrationCode,
    },
  });

  return row;
}

export async function updateEmployee(input: UpdateEmployeeInput) {
  const context = await resolveWorkspaceContext({ source: "ui" });
  const data = UpdateEmployeeInputSchema.parse(input);
  const db = getDb();

  // First verify ownership
  const [existing] = await db
    .select()
    .from(processCandidates)
    .where(
      and(
        eq(processCandidates.id, data.id),
        eq(processCandidates.workspaceId, context.workspaceId),
        eq(processCandidates.origin, HR_ORIGIN)
      )
    )
    .limit(1);

  if (!existing) {
    throw new Error("Employee not found or access denied");
  }

  const existingProposed = (existing.proposedDefinition as Record<string, any>) || {};

  const updateData: any = {};
  if (data.name) updateData.name = data.name;
  if (data.observations !== undefined) updateData.description = data.observations;
  if (data.status) updateData.status = data.status;

  const newProposed = {
    ...existingProposed,
    ...(data.registrationCode && { registrationCode: data.registrationCode }),
    ...(data.position && { position: data.position }),
    ...(data.department && { department: data.department }),
    ...(data.managerId !== undefined && { managerId: data.managerId }),
    ...(data.managerName !== undefined && { managerName: data.managerName }),
    ...(data.admissionDate && { admissionDate: data.admissionDate }),
    ...(data.contacts && { contacts: data.contacts }),
    ...(data.metadata && { metadata: { ...existingProposed.metadata, ...data.metadata } }),
  };

  const [row] = await db
    .update(processCandidates)
    .set({
      ...updateData,
      proposedDefinition: newProposed,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(processCandidates.id, data.id),
        eq(processCandidates.workspaceId, context.workspaceId)
      )
    )
    .returning();

  await db.insert(eventLogs).values({
    workspaceId: context.workspaceId,
    entityId: row.id,
    entityType: "employee",
    eventType: "hr.employee.updated",
    payload: {
      employeeId: row.id,
      changes: data,
    },
  });

  return row;
}
