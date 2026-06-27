"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { runAction } from "@/platform/actions";
import { resolveWorkspaceContext } from "@/platform/workspace";

export async function submitApprovalRequest(formData: FormData) {
  const title = String(formData.get("title") || "");
  const description = String(formData.get("description") || "");
  const subjectType = String(formData.get("subjectType") || "");
  const subjectId = String(formData.get("subjectId") || "");
  const approverId = String(formData.get("approverId") || "");

  const context = await resolveWorkspaceContext({ source: "ui" });

  const result = await runAction(
    "approval.request",
    {
      title,
      description,
      subjectType,
      subjectId,
      steps: [
        { approverId, approverType: "user" }
      ]
    },
    context
  );

  if (!result.success) {
    throw new Error(result.error?.message ?? "Falha ao criar requisição de aprovação.");
  }

  revalidatePath("/approvals");
  redirect("/approvals");
}

export async function submitDecision(formData: FormData) {
  const requestId = String(formData.get("requestId") || "");
  const stepId = String(formData.get("stepId") || "");
  const decision = String(formData.get("decision") || "");
  const reason = String(formData.get("reason") || "");

  const context = await resolveWorkspaceContext({ source: "ui" });

  const result = await runAction(
    "approval.decide",
    {
      requestId,
      stepId,
      decision,
      reason
    },
    context
  );

  if (!result.success) {
    throw new Error(result.error?.message ?? "Falha ao submeter decisão.");
  }

  revalidatePath("/approvals");
  revalidatePath(`/approvals/${requestId}`);
}
