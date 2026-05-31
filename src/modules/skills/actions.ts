"use server";
import { trainingRecords } from "@/db/schema";


import { technicianSkills } from "@/db/schema";
import { skillCatalog } from "@/db/schema";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb, getRuntimeDb } from "@/db";
import { events as eventLogs } from "@/db/runtime/schema/workflow";
import {
  skillProficiencies,
  trainingStatuses,
  type SkillProficiencyValue,
  type TrainingStatusValue,
} from "./constants";

function readRequiredText(formData: FormData, field: string) {
  const value = String(formData.get(field) ?? "").trim();
  if (!value) throw new Error(`Campo obrigatorio ausente: ${field}`);
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

function readEnum<T extends string>(
  formData: FormData,
  field: string,
  allowedValues: readonly { value: T; label: string }[],
  fallback: T,
) {
  const value = String(formData.get(field) ?? fallback);
  return allowedValues.some((item) => item.value === value) ? (value as T) : fallback;
}

export async function createSkill(formData: FormData) {
  const name = readRequiredText(formData, "name");
  const category = readOptionalText(formData, "category");
  const description = readOptionalText(formData, "description");
  const db = getRuntimeDb();

  const [skill] = await db.insert(skillCatalog).values({ name, category, description }).returning({
    id: skillCatalog.id,
    name: skillCatalog.name,
    category: skillCatalog.category,
  });

  await db.insert(eventLogs).values({
    eventType: "skill.created",
    entityType: "skill",
    entityId: skill.id,
    payload: skill,
  });

  revalidatePath("/");
  revalidatePath("/skills");
  revalidatePath("/events");
  redirect("/skills");
}

export async function assignTechnicianSkill(formData: FormData) {
  const technicianProfileId = readRequiredText(formData, "technicianProfileId");
  const skillId = readRequiredText(formData, "skillId");
  const proficiency = readEnum<SkillProficiencyValue>(
    formData,
    "proficiency",
    skillProficiencies,
    "basic",
  );
  const certifiedAt = readOptionalDate(formData, "certifiedAt");
  const expiresAt = readOptionalDate(formData, "expiresAt");
  const notes = readOptionalText(formData, "notes");
  const db = getDb();

  const [assignment] = await db.insert(technicianSkills).values({
    technicianProfileId,
    skillId,
    proficiency,
    certifiedAt,
    expiresAt,
    notes,
  }).returning({
    id: technicianSkills.id,
    technicianProfileId: technicianSkills.technicianProfileId,
    skillId: technicianSkills.skillId,
    proficiency: technicianSkills.proficiency,
  });

  await db.insert(eventLogs).values({
    eventType: "technician_skill.assigned",
    entityType: "technician_skill",
    entityId: assignment.id,
    payload: assignment,
  });

  revalidatePath("/skills");
  revalidatePath("/events");
  redirect("/skills");
}

export async function createTrainingRecord(formData: FormData) {
  const title = readRequiredText(formData, "title");
  const technicianProfileId = readOptionalText(formData, "technicianProfileId");
  const skillId = readOptionalText(formData, "skillId");
  const provider = readOptionalText(formData, "provider");
  const status = readEnum<TrainingStatusValue>(
    formData,
    "status",
    trainingStatuses,
    "planned",
  );
  const startedAt = readOptionalDate(formData, "startedAt");
  const completedAt = readOptionalDate(formData, "completedAt");
  const expiresAt = readOptionalDate(formData, "expiresAt");
  const notes = readOptionalText(formData, "notes");
  const db = getDb();

  const [training] = await db.insert(trainingRecords).values({
    technicianProfileId,
    skillId,
    title,
    provider,
    status,
    startedAt,
    completedAt,
    expiresAt,
    notes,
  }).returning({
    id: trainingRecords.id,
    title: trainingRecords.title,
    status: trainingRecords.status,
    technicianProfileId: trainingRecords.technicianProfileId,
  });

  await db.insert(eventLogs).values({
    eventType: "training_record.created",
    entityType: "training_record",
    entityId: training.id,
    payload: training,
  });

  revalidatePath("/");
  revalidatePath("/skills");
  revalidatePath("/events");
  redirect("/skills");
}
