"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { eventLogs, teams, technicianProfiles, users } from "@/db/schema";
import {
  type TechnicianLevelValue,
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
