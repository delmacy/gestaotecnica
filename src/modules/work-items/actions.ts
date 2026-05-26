"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { eventLogs, workItems } from "@/db/schema";
import {
  type WorkItemPriorityValue,
  type WorkItemStatusValue,
  type WorkItemTypeValue,
  workItemPriorities,
  workItemStatuses,
  workItemTypes,
} from "./constants";

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

export async function createWorkItem(formData: FormData) {
  const title = readRequiredText(formData, "title");
  const description = readOptionalText(formData, "description");
  const requesterName = readOptionalText(formData, "requesterName");
  const requesterContact = readOptionalText(formData, "requesterContact");
  const assetId = readOptionalText(formData, "assetId");
  const type = readEnum<WorkItemTypeValue>(
    formData,
    "type",
    workItemTypes,
    "solicitacao",
  );
  const priority = readEnum<WorkItemPriorityValue>(
    formData,
    "priority",
    workItemPriorities,
    "medium",
  );

  const db = getDb();
  const newWorkItem: typeof workItems.$inferInsert = {
    title,
    description,
    requesterName,
    requesterContact,
    assetId,
    type,
    priority,
    status: "open",
    payload: {},
  };

  const [workItem] = await db
    .insert(workItems)
    .values(newWorkItem)
    .returning({
      id: workItems.id,
      title: workItems.title,
      type: workItems.type,
      priority: workItems.priority,
      status: workItems.status,
    });

  await db.insert(eventLogs).values({
    eventType: "work_item.created",
    entityType: "work_item",
    entityId: workItem.id,
    workItemId: workItem.id,
    payload: {
      title: workItem.title,
      type: workItem.type,
      priority: workItem.priority,
      status: workItem.status,
      assetId,
    },
  });

  revalidatePath("/");
  revalidatePath("/work-items");
  redirect(`/work-items/${workItem.id}`);
}

export async function updateWorkItemStatus(formData: FormData) {
  const id = readRequiredText(formData, "id");
  const status = readEnum<WorkItemStatusValue>(
    formData,
    "status",
    workItemStatuses,
    "open",
  );
  const note = readOptionalText(formData, "note");
  const db = getDb();

  const [previous] = await db
    .select({
      id: workItems.id,
      title: workItems.title,
      status: workItems.status,
    })
    .from(workItems)
    .where(eq(workItems.id, id))
    .limit(1);

  if (!previous) {
    throw new Error("Demanda nao encontrada.");
  }

  const [updated] = await db
    .update(workItems)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(eq(workItems.id, id))
    .returning({
      id: workItems.id,
      title: workItems.title,
      status: workItems.status,
    });

  await db.insert(eventLogs).values({
    eventType: "work_item.status_changed",
    entityType: "work_item",
    entityId: updated.id,
    workItemId: updated.id,
    payload: {
      title: updated.title,
      from: previous.status,
      to: updated.status,
      note,
    },
  });

  revalidatePath("/");
  revalidatePath("/work-items");
  revalidatePath(`/work-items/${id}`);
  redirect(`/work-items/${id}`);
}
