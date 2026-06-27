"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { runAction } from "@/platform/actions";
import { resolveWorkspaceContext } from "@/platform/workspace";
import {
  type AssetCriticalityValue,
  type AssetStatusValue,
  assetCriticalities,
  assetStatuses,
} from "./constants";
import { getAssetTypeOptions } from "./queries";

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

async function readAssetType(formData: FormData) {
  const assetTypes = await getAssetTypeOptions();
  const value = String(formData.get("type") ?? "").trim();
  const fallback = assetTypes[0]?.value ?? "equipment";

  return assetTypes.some((item) => item.value === value) ? value : fallback;
}

export async function createAsset(formData: FormData) {
  const code = readRequiredText(formData, "code");
  const name = readRequiredText(formData, "name");
  const type = await readAssetType(formData);
  const location = readOptionalText(formData, "location");
  const description = readOptionalText(formData, "description");
  const status = readEnum<AssetStatusValue>(
    formData,
    "status",
    assetStatuses,
    "active",
  );
  const criticality = readEnum<AssetCriticalityValue>(
    formData,
    "criticality",
    assetCriticalities,
    "medium",
  );

  const context = await resolveWorkspaceContext({ source: "ui" });
  const result = await runAction(
    "assets.create",
    {
      code,
      name,
      type,
      location,
      description,
      status,
      criticality,
    },
    context,
  );

  if (!result.success) {
    throw new Error(result.error?.message ?? "Falha ao criar ativo.");
  }

  const asset = result.data as { id: string };

  revalidatePath("/");
  revalidatePath("/assets");
  redirect(`/assets/${asset.id}`);
}

export async function updateAssetStatus(formData: FormData) {
  const id = readRequiredText(formData, "id");
  const status = readEnum<AssetStatusValue>(
    formData,
    "status",
    assetStatuses,
    "active",
  );
  const note = readOptionalText(formData, "note");

  const context = await resolveWorkspaceContext({ source: "ui" });
  const result = await runAction(
    "assets.update_status",
    {
      assetId: id,
      status,
      note,
    },
    context,
  );

  if (!result.success) {
    throw new Error(result.error?.message ?? "Falha ao atualizar status do ativo.");
  }

  revalidatePath("/");
  revalidatePath("/assets");
  revalidatePath(`/assets/${id}`);
  redirect(`/assets/${id}`);
}
