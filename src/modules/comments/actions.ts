"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { entityAttachments, entityComments } from "@/db/schema";
import { getCurrentUser } from "@/modules/auth/session";

function readRequiredText(formData: FormData, field: string) {
  const value = String(formData.get(field) ?? "").trim();
  if (!value) throw new Error(`Campo obrigatorio ausente: ${field}`);
  return value;
}

function readOptionalText(formData: FormData, field: string) {
  const value = String(formData.get(field) ?? "").trim();
  return value.length > 0 ? value : undefined;
}

export async function createEntityComment(formData: FormData) {
  const entityType = readRequiredText(formData, "entityType");
  const entityId = readRequiredText(formData, "entityId");
  const body = readRequiredText(formData, "body");
  const currentUser = await getCurrentUser();

  await getDb().insert(entityComments).values({
    entityType,
    entityId,
    body,
    createdById: currentUser?.userId,
  });

  revalidatePath(String(formData.get("returnTo") ?? "/"));
}

export async function createEntityAttachment(formData: FormData) {
  const entityType = readRequiredText(formData, "entityType");
  const entityId = readRequiredText(formData, "entityId");
  const title = readRequiredText(formData, "title");
  const fileUrl = readRequiredText(formData, "fileUrl");
  const mimeType = readOptionalText(formData, "mimeType");
  const currentUser = await getCurrentUser();

  await getDb().insert(entityAttachments).values({
    entityType,
    entityId,
    title,
    fileUrl,
    mimeType,
    createdById: currentUser?.userId,
  });

  revalidatePath(String(formData.get("returnTo") ?? "/"));
}
