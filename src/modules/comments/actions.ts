"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { entityAttachments, entityComments } from "@/db/schema";
import { getCurrentUser } from "@/modules/auth/session";
import {
  CreateEntityCommentInputSchema,
  CreateEntityAttachmentInputSchema,
} from "./contracts/entity-collaboration-contract";

export async function createEntityComment(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const validated = CreateEntityCommentInputSchema.parse(rawData);
  const currentUser = await getCurrentUser();

  await getDb().insert(entityComments).values({
    entityType: validated.entityType,
    entityId: validated.entityId,
    body: validated.body,
    createdById: currentUser?.userId,
  });

  revalidatePath(validated.returnTo ?? "/");
}

export async function createEntityAttachment(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const validated = CreateEntityAttachmentInputSchema.parse(rawData);
  const currentUser = await getCurrentUser();

  await getDb().insert(entityAttachments).values({
    entityType: validated.entityType,
    entityId: validated.entityId,
    title: validated.title,
    fileUrl: validated.fileUrl,
    mimeType: validated.mimeType,
    createdById: currentUser?.userId,
  });

  revalidatePath(validated.returnTo ?? "/");
}
