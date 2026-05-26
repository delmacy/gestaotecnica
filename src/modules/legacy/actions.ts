"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { eventLogs, legacyRecords } from "@/db/schema";
import { legacySyncStatuses, type LegacySyncStatusValue } from "./constants";

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

export async function createLegacyRecord(formData: FormData) {
  const systemName = readRequiredText(formData, "systemName");
  const protocolNumber = readOptionalText(formData, "protocolNumber");
  const externalRecordId = readOptionalText(formData, "externalRecordId");
  const externalStatus = readOptionalText(formData, "externalStatus");
  const serviceOrderId = readOptionalText(formData, "serviceOrderId");
  const workItemId = readOptionalText(formData, "workItemId");
  const assetId = readOptionalText(formData, "assetId");
  const documentId = readOptionalText(formData, "documentId");
  const notes = readOptionalText(formData, "notes");
  const syncStatus = readEnum<LegacySyncStatusValue>(
    formData,
    "syncStatus",
    legacySyncStatuses,
    "pending",
  );
  const db = getDb();

  const [record] = await db
    .insert(legacyRecords)
    .values({
      systemName,
      protocolNumber,
      externalRecordId,
      externalStatus,
      serviceOrderId,
      workItemId,
      assetId,
      documentId,
      notes,
      syncStatus,
      exportedAt: syncStatus === "exported" || syncStatus === "confirmed" ? new Date() : undefined,
      payload: {},
    })
    .returning({
      id: legacyRecords.id,
      systemName: legacyRecords.systemName,
      protocolNumber: legacyRecords.protocolNumber,
      syncStatus: legacyRecords.syncStatus,
      serviceOrderId: legacyRecords.serviceOrderId,
      workItemId: legacyRecords.workItemId,
      assetId: legacyRecords.assetId,
    });

  await db.insert(eventLogs).values({
    eventType: "legacy.record_created",
    entityType: "legacy_record",
    entityId: record.id,
    serviceOrderId: record.serviceOrderId,
    workItemId: record.workItemId,
    assetId: record.assetId,
    payload: record,
  });

  revalidatePath("/");
  revalidatePath("/legacy");
  revalidatePath("/events");
  redirect("/legacy");
}

export async function updateLegacySyncStatus(formData: FormData) {
  const id = readRequiredText(formData, "id");
  const syncStatus = readEnum<LegacySyncStatusValue>(
    formData,
    "syncStatus",
    legacySyncStatuses,
    "pending",
  );
  const note = readOptionalText(formData, "note");
  const db = getDb();

  const [previous] = await db
    .select({
      id: legacyRecords.id,
      systemName: legacyRecords.systemName,
      syncStatus: legacyRecords.syncStatus,
      serviceOrderId: legacyRecords.serviceOrderId,
      workItemId: legacyRecords.workItemId,
      assetId: legacyRecords.assetId,
    })
    .from(legacyRecords)
    .where(eq(legacyRecords.id, id))
    .limit(1);

  if (!previous) throw new Error("Registro legado nao encontrado.");

  await db
    .update(legacyRecords)
    .set({
      syncStatus,
      exportedAt: syncStatus === "exported" || syncStatus === "confirmed" ? new Date() : undefined,
      updatedAt: new Date(),
    })
    .where(eq(legacyRecords.id, id));

  await db.insert(eventLogs).values({
    eventType: "legacy.sync_status_changed",
    entityType: "legacy_record",
    entityId: previous.id,
    serviceOrderId: previous.serviceOrderId,
    workItemId: previous.workItemId,
    assetId: previous.assetId,
    payload: {
      systemName: previous.systemName,
      from: previous.syncStatus,
      to: syncStatus,
      note,
    },
  });

  revalidatePath("/");
  revalidatePath("/legacy");
  revalidatePath("/events");
  redirect("/legacy");
}
