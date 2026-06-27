"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { runAction } from "@/platform/actions";
import { resolveWorkspaceContext } from "@/platform/workspace";

export async function createCaseAction(formData: FormData) {
  const context = await resolveWorkspaceContext({ source: "ui" });

  const input = {
    title: String(formData.get("title") || ""),
    description: String(formData.get("description") || ""),
    category: String(formData.get("category") || ""),
    priority: String(formData.get("priority") || "medium"),
    responsibleId: formData.get("responsibleId") ? String(formData.get("responsibleId")) : undefined,
    metadata: {},
  };

  const result = await runAction("case_management.create", input, context);

  if (!result.success) {
    throw new Error(result.error?.message || "Falha ao criar caso.");
  }

  const { id } = result.data as { id: string };

  revalidatePath("/case-management");
  redirect(`/case-management/${id}`);
}

export async function updateCaseAction(formData: FormData) {
  const context = await resolveWorkspaceContext({ source: "ui" });

  const id = String(formData.get("id") || "");
  const input: any = { id };

  if (formData.has("title")) input.title = String(formData.get("title"));
  if (formData.has("description")) input.description = String(formData.get("description"));
  if (formData.has("status")) input.status = String(formData.get("status"));
  if (formData.has("priority")) input.priority = String(formData.get("priority"));
  if (formData.has("category")) input.category = String(formData.get("category"));
  if (formData.has("responsibleId")) {
    const rid = formData.get("responsibleId");
    input.responsibleId = rid ? String(rid) : null;
  }

  const result = await runAction("case_management.update", input, context);

  if (!result.success) {
    throw new Error(result.error?.message || "Falha ao atualizar caso.");
  }

  revalidatePath("/case-management");
  revalidatePath(`/case-management/${id}`);
}

export async function addCaseCommentAction(formData: FormData) {
  const context = await resolveWorkspaceContext({ source: "ui" });

  const id = String(formData.get("id") || "");
  const body = String(formData.get("body") || "");

  const result = await runAction("case_management.add_comment", { id, body }, context);

  if (!result.success) {
    throw new Error(result.error?.message || "Falha ao adicionar comentário.");
  }

  revalidatePath(`/case-management/${id}`);
}
