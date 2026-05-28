"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { runAction } from "@/platform/actions";
import { resolveWorkspaceContext } from "@/platform/workspace";
import {
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
  const startsAt = readRequiredText(formData, "startsAt");
  const endsAt = readRequiredText(formData, "endsAt");
  const notes = readOptionalText(formData, "notes");
  const scheduleTypes = await getScheduleTypeOptions();
  const type = readEnum<ScheduleTypeValue>(
    formData,
    "type",
    scheduleTypes,
    "expediente",
  );

  const context = await resolveWorkspaceContext({ source: "ui" });
  const result = await runAction(
    "schedules.create",
    {
      title,
      technicianProfileId,
      teamId,
      startsAt,
      endsAt,
      notes,
      type,
    },
    context,
  );

  if (!result.success) {
    throw new Error(result.error?.message ?? "Falha ao criar escala.");
  }

  revalidatePath("/");
  revalidatePath("/schedules");
  revalidatePath("/events");
  redirect("/schedules");
}
