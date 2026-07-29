"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { runAction } from "@/platform/actions";
import { resolveWorkspaceContext } from "@/platform/workspace";
import {
  type WorkItemPriorityValue,
  type WorkItemStatusValue,
  type WorkItemTypeValue,
  workItemPriorities,
  workItemStatuses,
} from "./constants";
import { getWorkItemTypeOptions } from "./queries";

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

export async function createWorkItem(prevState: unknown, formData: FormData) {
  try {
  const title = readRequiredText(formData, "title");
  const description = readOptionalText(formData, "description");
  const workItemTypes = await getWorkItemTypeOptions();
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

  const context = await resolveWorkspaceContext({ source: "ui" });
  const result = await runAction(
    "work_items.create",
    {
      title,
      description,
      type,
      priority,
    },
    context,
  );

  if (!result.success) {
    return { error: result.error?.message ?? "Falha ao criar demanda." };
  }

  const workItem = result.data as { id: string };

  revalidatePath("/");
  revalidatePath("/work-items");
  return { success: true, workId: workItem.id, error: "" };
} catch (error: unknown) {
  if ((error as Error).message === "NEXT_REDIRECT") {
    throw error;
  }
  return { error: error instanceof Error ? error.message : "Erro inesperado ao criar." };
}
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

  const context = await resolveWorkspaceContext({ source: "ui" });
  const result = await runAction(
    "work_items.transition",
    {
      workItemId: id,
      status,
      note,
    },
    context,
  );

  if (!result.success) {
    throw new Error(result.error?.message ?? "Falha ao atualizar status.");
  }

  revalidatePath("/");
  revalidatePath("/work-items");
  revalidatePath(`/work-items/${id}`);
  redirect(`/work-items/${id}`);
}
