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

function readOptionalBoolean(formData: FormData, field: string) {
  return formData.get(field) === "on";
}

export async function createShift(formData: FormData) {
  const name = readRequiredText(formData, "name");
  const context = await resolveWorkspaceContext({ source: "ui" });

  const result = await runAction(
    "shifts.open",
    {
      name,
    },
    context,
  );

  if (!result.success) {
    throw new Error(result.error?.message ?? "Falha ao abrir turno.");
  }

  const shift = result.data as { id: string };

  revalidatePath("/");
  revalidatePath("/shifts");
  redirect(`/shifts/${shift.id}`);
}

export async function createShiftLogEntry(formData: FormData) {
  const shiftId = readRequiredText(formData, "shiftId");
  const title = readRequiredText(formData, "title");
  const description = readOptionalText(formData, "description");
  const workItemId = readOptionalText(formData, "workItemId");
  const serviceOrderId = readOptionalText(formData, "serviceOrderId");
  const assetId = readOptionalText(formData, "assetId");
  const isPending = readOptionalBoolean(formData, "isPending");

  const context = await resolveWorkspaceContext({ source: "ui" });

  const result = await runAction(
    "shift_logs.add_entry",
    {
      shiftId,
      title,
      description,
      workItemId,
      serviceOrderId,
      assetId,
      isPending,
    },
    context,
  );

  if (!result.success) {
    throw new Error(result.error?.message ?? "Falha ao adicionar registro no turno.");
  }

  revalidatePath("/");
  revalidatePath("/shifts");
  revalidatePath(`/shifts/${shiftId}`);
  redirect(`/shifts/${shiftId}`);
}

export async function closeShift(formData: FormData) {
  const id = readRequiredText(formData, "id");
  const summary = readRequiredText(formData, "summary");

  const context = await resolveWorkspaceContext({ source: "ui" });

  const result = await runAction(
    "shifts.close",
    {
      shiftId: id,
      summary,
    },
    context,
  );

  if (!result.success) {
    throw new Error(result.error?.message ?? "Falha ao fechar turno.");
  }

  revalidatePath("/");
  revalidatePath("/shifts");
  revalidatePath(`/shifts/${id}`);
  redirect(`/shifts/${id}`);
}
