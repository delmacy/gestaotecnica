import { eq, and } from "drizzle-orm";
import { getDb } from "@/db";
import { processCandidates } from "@/db/platform/schema/candidates";
import {
  CreateEmployeeInputSchema,
  UpdateEmployeeInputSchema,
  type CreateEmployeeInput,
  type UpdateEmployeeInput
} from "./contracts/hr.schema";

const HR_ORIGIN = "human-resources";

export async function createEmployee(workspaceId: string, input: Omit<CreateEmployeeInput, "workspaceId">) {
  // Validate using schema (omitting workspaceId as it comes from trusted context)
  const data = CreateEmployeeInputSchema.parse({ ...input, workspaceId });
  const db = getDb();

  const [row] = await db
    .insert(processCandidates)
    .values({
      workspaceId: data.workspaceId,
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

  return row;
}

export async function updateEmployee(workspaceId: string, input: Omit<UpdateEmployeeInput, "workspaceId">) {
  // Validate using schema
  const data = UpdateEmployeeInputSchema.parse({ ...input, workspaceId });
  const db = getDb();

  // First verify ownership and origin
  const [existing] = await db
    .select()
    .from(processCandidates)
    .where(
      and(
        eq(processCandidates.id, data.id),
        eq(processCandidates.workspaceId, workspaceId),
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
        eq(processCandidates.workspaceId, workspaceId),
        eq(processCandidates.origin, HR_ORIGIN) // Critical: enforce origin in update too
      )
    )
    .returning();

  return row;
}
