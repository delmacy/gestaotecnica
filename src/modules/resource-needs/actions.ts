"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { eventLogs, resourceNeeds } from "@/db/schema";
import {
  priorities,
  resourceNeedStatuses,
  type PriorityValue,
  type ResourceNeedStatusValue,
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

export async function createResourceNeed(formData: FormData) {
  const title = readRequiredText(formData, "title");
  const category = readOptionalText(formData, "category");
  const quantity = readOptionalInteger(formData, "quantity") ?? 1;
  const justification = readOptionalText(formData, "justification");
  const assetId = readOptionalText(formData, "assetId");
  const projectId = readOptionalText(formData, "projectId");
  const acquisitionNeedId = readOptionalText(formData, "acquisitionNeedId");
  const ownerTeamId = readOptionalText(formData, "ownerTeamId");
  const status = readEnum<ResourceNeedStatusValue>(
    formData,
    "status",
    resourceNeedStatuses,
    "identified",
  );
  const priority = readEnum<PriorityValue>(formData, "priority", priorities, "medium");
  const db = getDb();

  const [need] = await db.insert(resourceNeeds).values({
    title,
    category,
    quantity,
    justification,
    assetId,
    projectId,
    acquisitionNeedId,
    ownerTeamId,
    status,
    priority,
  }).returning({
    id: resourceNeeds.id,
    title: resourceNeeds.title,
    status: resourceNeeds.status,
    assetId: resourceNeeds.assetId,
  });

  await db.insert(eventLogs).values({
    eventType: "resource_need.created",
    entityType: "resource_need",
    entityId: need.id,
    assetId: need.assetId,
    payload: need,
  });

  revalidatePath("/");
  revalidatePath("/resource-needs");
  revalidatePath("/events");
  redirect("/resource-needs");
}

export async function updateResourceNeedStatus(formData: FormData) {
  const id = readRequiredText(formData, "id");
  const status = readEnum<ResourceNeedStatusValue>(
    formData,
    "status",
    resourceNeedStatuses,
    "identified",
  );
  const db = getDb();
  const [previous] = await db.select({
    id: resourceNeeds.id,
    title: resourceNeeds.title,
    status: resourceNeeds.status,
    assetId: resourceNeeds.assetId,
  }).from(resourceNeeds).where(eq(resourceNeeds.id, id)).limit(1);

  if (!previous) throw new Error("Necessidade de recurso nao encontrada.");

  await db.update(resourceNeeds).set({ status, updatedAt: new Date() }).where(eq(resourceNeeds.id, id));
  await db.insert(eventLogs).values({
    eventType: "resource_need.status_changed",
    entityType: "resource_need",
    entityId: previous.id,
    assetId: previous.assetId,
    payload: { title: previous.title, from: previous.status, to: status },
  });

  revalidatePath("/resource-needs");
  revalidatePath("/events");
  redirect("/resource-needs");
}
