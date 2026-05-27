"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  startWorkflowInstanceForTarget,
  transitionWorkflowInstance,
} from "@/platform/workflows/runtime";

function readRequiredText(formData: FormData, field: string) {
  const value = String(formData.get(field) ?? "").trim();
  if (!value) throw new Error(`Campo obrigatorio ausente: ${field}`);
  return value;
}

function readOptionalText(formData: FormData, field: string) {
  const value = String(formData.get(field) ?? "").trim();
  return value.length > 0 ? value : undefined;
}

export async function startWorkflowInstanceAction(formData: FormData) {
  const targetType = readRequiredText(formData, "targetType");
  const targetId = readRequiredText(formData, "targetId");
  const returnTo = readOptionalText(formData, "returnTo") ?? "/admin/workflows";

  await startWorkflowInstanceForTarget({ targetType, targetId });

  revalidatePath(returnTo);
  revalidatePath("/admin/workflows");
  redirect(returnTo);
}

export async function transitionWorkflowInstanceAction(formData: FormData) {
  const workflowInstanceId = readRequiredText(formData, "workflowInstanceId");
  const toState = readRequiredText(formData, "toState");
  const note = readOptionalText(formData, "note");
  const returnTo = readOptionalText(formData, "returnTo") ?? "/admin/workflows";

  await transitionWorkflowInstance({ workflowInstanceId, toState, note });

  revalidatePath(returnTo);
  revalidatePath("/admin/workflows");
  revalidatePath("/events");
  redirect(returnTo);
}
