"use server";

import { revalidatePath } from "next/cache";
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

export async function submitServiceOrderForReview(prevState: unknown, formData: FormData) {
  try {
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
      return { error: result.error?.message ?? "Falha ao enviar para revisão." };
    }

    revalidatePath("/");
    revalidatePath("/approvals");
    revalidatePath("/service-orders");
    revalidatePath(`/service-orders/${id}`);

    return { id: result.receipt?.id || id, status: "success" };
  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') throw error;
    return { error: error instanceof Error ? error.message : "Erro inesperado." };
  }
}

export async function approveServiceOrder(prevState: unknown, formData: FormData) {
  try {
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
      return { error: result.error?.message ?? "Falha ao aprovar." };
    }

    revalidatePath("/");
    revalidatePath("/approvals");
    revalidatePath("/service-orders");
    revalidatePath(`/service-orders/${id}`);

    return { id: result.receipt?.id || id, status: "success" };
  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') throw error;
    return { error: error instanceof Error ? error.message : "Erro inesperado." };
  }
}

export async function returnServiceOrderForExecution(prevState: unknown, formData: FormData) {
  try {
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
      return { error: result.error?.message ?? "Falha ao retornar." };
    }

    revalidatePath("/");
    revalidatePath("/approvals");
    revalidatePath("/service-orders");
    revalidatePath(`/service-orders/${id}`);

    return { id: result.receipt?.id || id, status: "success" };
  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') throw error;
    return { error: error instanceof Error ? error.message : "Erro inesperado." };
  }
}
