"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import {
  eventLogs,
  teams,
  technicianProfiles,
  technicianUnavailabilities,
  users,
  workforceAllocations,
} from "@/db/schema";
import {
  type TechnicianLevelValue,
  type WorkforceAllocationStatusValue,
  type WorkforceAllocationTypeValue,
  workforceAllocationStatuses,
  workforceAllocationTypes,
} from "./constants";
import { getTechnicianLevelOptions } from "./queries";

function readRequiredText(formData: FormData, field: string) {
  const value = String(formData.get(field) ?? "").trim();

  if (!value) {
    throw new Error(`Campo obrigatorio ausente: ${field}`);
  }

  return value;
}

function readOptionalText(formData: FormData, field: string) {
  const value = String(formData.get(field) ?? "").trim();
  return value.length > 0 ? value : undefined;
}

function readOptionalDate(formData: FormData, field: string) {
  const value = readOptionalText(formData, field);
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error(`Data invalida: ${field}`);
  return date;
}

function readRequiredDate(formData: FormData, field: string) {
  const value = readRequiredText(formData, field);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error(`Data invalida: ${field}`);
  return date;
}

function readOptionalInteger(formData: FormData, field: string) {
  const value = readOptionalText(formData, field);
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) throw new Error(`Numero invalido: ${field}`);
  return parsed;
}

function readEnum<T extends string>(
  formData: FormData,
  field: string,
  allowedValues: readonly { value: T; label: string }[],
  fallback: T,
) {
  const value = String(formData.get(field) ?? fallback);
  return allowedValues.some((item) => item.value === value) ? (value as T) : fallback;
}

export async function createTeam(formData: FormData) {
  const name = readRequiredText(formData, "name");
  const description = readOptionalText(formData, "description");
  const db = getDb();

  const [team] = await db
    .insert(teams)
    .values({
      name,
      description,
      isActive: true,
    })
    .returning({
      id: teams.id,
      name: teams.name,
      description: teams.description,
      isActive: teams.isActive,
    });

  await db.insert(eventLogs).values({
    eventType: "team.created",
    entityType: "team",
    entityId: team.id,
    payload: team,
  });

  revalidatePath("/");
  revalidatePath("/workforce");
  redirect("/workforce");
}

export async function createTechnician(formData: FormData) {
  const name = readRequiredText(formData, "name");
  const email = readRequiredText(formData, "email").toLowerCase();
  const registrationCode = readOptionalText(formData, "registrationCode");
  const specialty = readOptionalText(formData, "specialty");
  const teamId = readOptionalText(formData, "teamId");
  const technicianLevels = await getTechnicianLevelOptions();
  const level = readEnum<TechnicianLevelValue>(
    formData,
    "level",
    technicianLevels,
    "trainee",
  );
  const db = getDb();

  const [user] = await db
    .insert(users)
    .values({
      name,
      email,
      status: "active",
    })
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      status: users.status,
    });

  const [technician] = await db
    .insert(technicianProfiles)
    .values({
      userId: user.id,
      teamId,
      level,
      registrationCode,
      specialty,
      isAvailable: true,
    })
    .returning({
      id: technicianProfiles.id,
      userId: technicianProfiles.userId,
      teamId: technicianProfiles.teamId,
      level: technicianProfiles.level,
      registrationCode: technicianProfiles.registrationCode,
      specialty: technicianProfiles.specialty,
      isAvailable: technicianProfiles.isAvailable,
    });

  await db.insert(eventLogs).values({
    eventType: "technician.created",
    entityType: "technician_profile",
    entityId: technician.id,
    payload: {
      ...technician,
      user,
    },
  });

  revalidatePath("/");
  revalidatePath("/workforce");
  revalidatePath("/service-orders");
  redirect("/workforce");
}

export async function createWorkforceAllocation(formData: FormData) {
  const technicianProfileId = readRequiredText(formData, "technicianProfileId");
  const allocationType = readEnum<WorkforceAllocationTypeValue>(
    formData,
    "allocationType",
    workforceAllocationTypes,
    "service_order",
  );
  const status = readEnum<WorkforceAllocationStatusValue>(
    formData,
    "status",
    workforceAllocationStatuses,
    "planned",
  );
  const serviceOrderId = readOptionalText(formData, "serviceOrderId");
  const workItemId = readOptionalText(formData, "workItemId");
  const scheduleId = readOptionalText(formData, "scheduleId");
  const startsAt = readOptionalDate(formData, "startsAt");
  const endsAt = readOptionalDate(formData, "endsAt");
  const effortMinutes = readOptionalInteger(formData, "effortMinutes");
  const notes = readOptionalText(formData, "notes");
  const db = getDb();

  const [technician] = await db
    .select({
      id: technicianProfiles.id,
      teamId: technicianProfiles.teamId,
    })
    .from(technicianProfiles)
    .where(eq(technicianProfiles.id, technicianProfileId))
    .limit(1);

  if (!technician) throw new Error("Tecnico nao encontrado.");

  const [allocation] = await db
    .insert(workforceAllocations)
    .values({
      technicianProfileId,
      teamId: technician.teamId,
      allocationType,
      status,
      serviceOrderId,
      workItemId,
      scheduleId,
      startsAt,
      endsAt,
      effortMinutes,
      notes,
    })
    .returning();

  await db.insert(eventLogs).values({
    eventType: "workforce.allocation_created",
    entityType: "workforce_allocation",
    entityId: allocation.id,
    serviceOrderId: allocation.serviceOrderId,
    workItemId: allocation.workItemId,
    payload: allocation,
  });

  revalidatePath("/");
  revalidatePath("/workforce");
  revalidatePath("/planning");
  if (serviceOrderId) revalidatePath(`/service-orders/${serviceOrderId}`);
  redirect("/workforce");
}

export async function createTechnicianUnavailability(formData: FormData) {
  const technicianProfileId = readRequiredText(formData, "technicianProfileId");
  const reason = readRequiredText(formData, "reason");
  const startsAt = readRequiredDate(formData, "startsAt");
  const endsAt = readOptionalDate(formData, "endsAt");
  const notes = readOptionalText(formData, "notes");
  const db = getDb();

  if (endsAt && endsAt < startsAt) {
    throw new Error("Fim da indisponibilidade nao pode ser anterior ao inicio.");
  }

  const [unavailability] = await db
    .insert(technicianUnavailabilities)
    .values({
      technicianProfileId,
      reason,
      startsAt,
      endsAt,
      notes,
    })
    .returning();

  await db
    .update(technicianProfiles)
    .set({ isAvailable: false, updatedAt: new Date() })
    .where(eq(technicianProfiles.id, technicianProfileId));

  await db.insert(eventLogs).values({
    eventType: "technician.unavailability_created",
    entityType: "technician_unavailability",
    entityId: unavailability.id,
    payload: unavailability,
  });

  revalidatePath("/");
  revalidatePath("/workforce");
  revalidatePath("/planning");
  redirect("/workforce");
}
