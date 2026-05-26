"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { eventLogs, serviceOrders, technicalDocuments } from "@/db/schema";
import { documentStatuses, type DocumentStatusValue } from "./constants";
import { getDocumentTypeOptions } from "./queries";

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

export async function createTechnicalDocument(formData: FormData) {
  const title = readRequiredText(formData, "title");
  const content = readOptionalText(formData, "content");
  const serviceOrderId = readOptionalText(formData, "serviceOrderId");
  let workItemId = readOptionalText(formData, "workItemId");
  let assetId = readOptionalText(formData, "assetId");
  const documentTypes = await getDocumentTypeOptions();
  const documentType = readEnum(
    formData,
    "documentType",
    documentTypes,
    "technical_report",
  );
  const db = getDb();

  if (serviceOrderId) {
    const [serviceOrder] = await db
      .select({ workItemId: serviceOrders.workItemId, assetId: serviceOrders.assetId })
      .from(serviceOrders)
      .where(eq(serviceOrders.id, serviceOrderId))
      .limit(1);
    if (serviceOrder) {
      workItemId = workItemId ?? serviceOrder.workItemId ?? undefined;
      assetId = assetId ?? serviceOrder.assetId ?? undefined;
    }
  }

  const [document] = await db
    .insert(technicalDocuments)
    .values({
      title,
      content,
      serviceOrderId,
      workItemId,
      assetId,
      documentType,
      status: "draft",
    })
    .returning({
      id: technicalDocuments.id,
      title: technicalDocuments.title,
      documentType: technicalDocuments.documentType,
      status: technicalDocuments.status,
      serviceOrderId: technicalDocuments.serviceOrderId,
      workItemId: technicalDocuments.workItemId,
      assetId: technicalDocuments.assetId,
    });

  await db.insert(eventLogs).values({
    eventType: "document.created",
    entityType: "technical_document",
    entityId: document.id,
    serviceOrderId: document.serviceOrderId,
    workItemId: document.workItemId,
    assetId: document.assetId,
    payload: document,
  });

  revalidatePath("/");
  revalidatePath("/documents");
  revalidatePath("/events");
  redirect("/documents");
}

export async function updateDocumentStatus(formData: FormData) {
  const id = readRequiredText(formData, "id");
  const status = readEnum<DocumentStatusValue>(
    formData,
    "status",
    documentStatuses,
    "draft",
  );
  const note = readOptionalText(formData, "note");
  const db = getDb();

  const [previous] = await db
    .select({
      id: technicalDocuments.id,
      title: technicalDocuments.title,
      status: technicalDocuments.status,
      serviceOrderId: technicalDocuments.serviceOrderId,
      workItemId: technicalDocuments.workItemId,
      assetId: technicalDocuments.assetId,
    })
    .from(technicalDocuments)
    .where(eq(technicalDocuments.id, id))
    .limit(1);

  if (!previous) throw new Error("Documento nao encontrado.");

  await db
    .update(technicalDocuments)
    .set({ status, updatedAt: new Date() })
    .where(eq(technicalDocuments.id, id));

  await db.insert(eventLogs).values({
    eventType: "document.status_changed",
    entityType: "technical_document",
    entityId: previous.id,
    serviceOrderId: previous.serviceOrderId,
    workItemId: previous.workItemId,
    assetId: previous.assetId,
    payload: {
      title: previous.title,
      from: previous.status,
      to: status,
      note,
    },
  });

  revalidatePath("/");
  revalidatePath("/documents");
  revalidatePath("/events");
  redirect("/documents");
}
