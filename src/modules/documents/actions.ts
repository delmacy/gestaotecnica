"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { runAction } from "@/platform/actions";
import { resolveWorkspaceContext } from "@/platform/workspace";
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
  const workItemId = readOptionalText(formData, "workItemId");
  const assetId = readOptionalText(formData, "assetId");
  const documentTypes = await getDocumentTypeOptions();
  const documentType = readEnum(
    formData,
    "documentType",
    documentTypes,
    "technical_report",
  );

  const context = await resolveWorkspaceContext({ source: "ui" });
  const result = await runAction(
    "documents.generate",
    {
      title,
      content,
      serviceOrderId,
      workItemId,
      assetId,
      documentType,
    },
    context,
  );

  if (!result.success) {
    throw new Error(result.error?.message ?? "Falha ao gerar documento.");
  }

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

  const context = await resolveWorkspaceContext({ source: "ui" });
  const result = await runAction(
    "documents.transition",
    {
      documentId: id,
      status,
      note,
    },
    context,
  );

  if (!result.success) {
    throw new Error(result.error?.message ?? "Falha ao atualizar documento.");
  }

  revalidatePath("/");
  revalidatePath("/documents");
  revalidatePath("/events");
  redirect("/documents");
}
