"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { eventLogs, schedules } from "@/db/schema";
import {
  scheduleStatuses,
  type ScheduleStatusValue,
  type ScheduleTypeValue,
} from "./constants";
import { getScheduleTypeOptions } from "./queries";

function readRequiredText(formData: FormData, field: string) {
  const value = String(formData.get(field) ?? "").trim();
  if (!value) throw new Error(`Campo obrigatorio ausente: ${field}`);
  return value;
}

function readOptionalText(formData: FormData, field: string) {
  const value = String(formData.get(field) ?? "").trim();
  return value.length > 0 ? value : undefined;
}

function readDate(formData: FormData, field: string) {
  const date = new Date(readRequiredText(formData, field));
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

export async function createSchedule(formData: FormData) {
  const title = readRequiredText(formData, "title");
  const technicianProfileId = readOptionalText(formData, "technicianProfileId");
  const teamId = readOptionalText(formData, "teamId");
  const startsAt = readDate(formData, "startsAt");
  const endsAt = readDate(formData, "endsAt");
  const notes = readOptionalText(formData, "notes");
  const scheduleTypes = await getScheduleTypeOptions();
  const type = readEnum<ScheduleTypeValue>(
    formData,
    "type",
    scheduleTypes,
    "expediente",
  );
  const status = readEnum<ScheduleStatusValue>(
    formData,
    "status",
    scheduleStatuses,
    "planned",
  );

  if (endsAt <= startsAt) {
    throw new Error("Fim da escala precisa ser posterior ao inicio.");
  }

  const db = getDb();
  const [schedule] = await db
    .insert(schedules)
    .values({
      title,
      technicianProfileId,
      teamId,
      startsAt,
      endsAt,
      notes,
      type,
      status,
    })
    .returning({
      id: schedules.id,
      title: schedules.title,
      type: schedules.type,
      status: schedules.status,
      startsAt: schedules.startsAt,
      endsAt: schedules.endsAt,
    });

  await db.insert(eventLogs).values({
    eventType: "schedule.created",
    entityType: "schedule",
    entityId: schedule.id,
    payload: schedule,
  });

  revalidatePath("/");
  revalidatePath("/schedules");
  revalidatePath("/events");
  redirect("/schedules");
}
