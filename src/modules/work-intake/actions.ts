"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { runAction } from "@/platform/actions";
import { resolveWorkspaceContext } from "@/platform/workspace";

export async function captureIntakeAction(formData: FormData) {
  const context = await resolveWorkspaceContext({ source: "ui" });

  const input = {
    title: String(formData.get("title") || ""),
    description: String(formData.get("description") || ""),
    category: String(formData.get("category") || ""),
    priority: String(formData.get("priority") || "medium"),
    source: "manual",
    requester: {
      name: String(formData.get("requesterName") || ""),
      contact: String(formData.get("requesterContact") || ""),
      department: String(formData.get("requesterDepartment") || ""),
    },
    metadata: {},
  };

  const result = await runAction("work_intake.capture", input, context);

  if (!result.success) {
    throw new Error(result.error?.message || "Falha ao capturar solicitação.");
  }

  const { id } = result.data as { id: string };

  revalidatePath("/work-intake");
  redirect(`/work-intake/${id}`);
}

export async function transitionIntakeAction(formData: FormData) {
  const context = await resolveWorkspaceContext({ source: "ui" });

  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  const reason = String(formData.get("reason") || "");

  const result = await runAction("work_intake.transition", { id, status, reason }, context);

  if (!result.success) {
    throw new Error(result.error?.message || "Falha ao transicionar solicitação.");
  }

  revalidatePath("/work-intake");
  revalidatePath(`/work-intake/${id}`);
  redirect(`/work-intake/${id}`);
}
