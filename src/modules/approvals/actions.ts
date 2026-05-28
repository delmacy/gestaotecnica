"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { runAction } from "@/platform/actions";
import { resolveWorkspaceContext } from "@/platform/workspace";

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

export async function submitServiceOrderForReview(formData: FormData) {
  const id = readRequiredText(formData, "id");
  const note = readOptionalText(formData, "note");
  const context = await resolveWorkspaceContext({ source: "ui" });

  const result = await runAction(
    "approvals.request",
    {
      serviceOrderId: id,
      note,
    },
    context,
  );

  if (!result.success) {
    throw new Error(result.error?.message ?? "Falha ao enviar para revisão.");
  }

  revalidatePath("/");
  revalidatePath("/approvals");
  revalidatePath("/service-orders");
  revalidatePath(`/service-orders/${id}`);
  redirect(`/service-orders/${id}`);
}

export async function approveServiceOrder(formData: FormData) {
  const id = readRequiredText(formData, "id");
  const note = readOptionalText(formData, "note");
  const context = await resolveWorkspaceContext({ source: "ui" });

  const result = await runAction(
    "approvals.decide",
    {
      serviceOrderId: id,
      decision: "approve",
      note,
    },
    context,
  );

  if (!result.success) {
    throw new Error(result.error?.message ?? "Falha ao aprovar.");
  }

  revalidatePath("/");
  revalidatePath("/approvals");
  revalidatePath("/service-orders");
  revalidatePath(`/service-orders/${id}`);
  redirect("/approvals");
}

export async function returnServiceOrderForExecution(formData: FormData) {
  const id = readRequiredText(formData, "id");
  const note = readRequiredText(formData, "note");
  const context = await resolveWorkspaceContext({ source: "ui" });

  const result = await runAction(
    "approvals.decide",
    {
      serviceOrderId: id,
      decision: "reject",
      note,
    },
    context,
  );

  if (!result.success) {
    throw new Error(result.error?.message ?? "Falha ao retornar.");
  }

  revalidatePath("/");
  revalidatePath("/approvals");
  revalidatePath("/service-orders");
  revalidatePath(`/service-orders/${id}`);
  redirect("/approvals");
}
