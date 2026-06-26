"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { runAction } from "@/platform/actions";
import { resolveWorkspaceContext } from "@/platform/workspace";

function readRequiredText(formData: FormData, field: string) {
  const value = String(formData.get(field) ?? "").trim();
  if (!value) throw new Error(`Campo obrigatório ausente: ${field}`);
  return value;
}

function readOptionalText(formData: FormData, field: string) {
  const value = String(formData.get(field) ?? "").trim();
  return value.length > 0 ? value : undefined;
}

export async function createAsset(formData: FormData) {
  const code = readRequiredText(formData, "code");
  const name = readRequiredText(formData, "name");
  const category = readRequiredText(formData, "category");
  const status = readOptionalText(formData, "status");
  const location = readOptionalText(formData, "location");

  const context = await resolveWorkspaceContext({ source: "ui" });
  const result = await runAction(
    "assets.create",
    { code, name, category, status, location },
    context,
  );

  if (!result.success) {
    throw new Error(result.error?.message ?? "Falha ao criar ativo.");
  }

  revalidatePath("/assets");
  redirect("/assets");
}

export async function updateAsset(formData: FormData) {
  const id = readRequiredText(formData, "id");
  const name = readOptionalText(formData, "name");
  const category = readOptionalText(formData, "category");
  const location = readOptionalText(formData, "location");

  const context = await resolveWorkspaceContext({ source: "ui" });
  const result = await runAction(
    "assets.update",
    { id, name, category, location },
    context,
  );

  if (!result.success) {
    throw new Error(result.error?.message ?? "Falha ao atualizar ativo.");
  }

  revalidatePath(`/assets/${id}`);
  revalidatePath("/assets");
  redirect(`/assets/${id}`);
}

export async function updateAssetStatus(formData: FormData) {
  const id = readRequiredText(formData, "id");
  const status = readRequiredText(formData, "status");
  const note = readOptionalText(formData, "note");

  const context = await resolveWorkspaceContext({ source: "ui" });
  const result = await runAction(
    "assets.update_status",
    { id, status, note },
    context,
  );

  if (!result.success) {
    throw new Error(result.error?.message ?? "Falha ao atualizar status.");
  }

  revalidatePath(`/assets/${id}`);
  revalidatePath("/assets");
}
