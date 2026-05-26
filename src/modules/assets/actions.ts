"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { assets, eventLogs } from "@/db/schema";
import {
  type AssetCriticalityValue,
  type AssetStatusValue,
  assetCriticalities,
  assetStatuses,
} from "./constants";

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

export async function createAsset(formData: FormData) {
  const code = readRequiredText(formData, "code");
  const name = readRequiredText(formData, "name");
  const type = readRequiredText(formData, "type");
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
  const db = getDb();

  const newAsset: typeof assets.$inferInsert = {
    code,
    name,
    type,
    location,
    description,
    status,
    criticality,
    metadata: {},
  };

  const [asset] = await db.insert(assets).values(newAsset).returning({
    id: assets.id,
    code: assets.code,
    name: assets.name,
    type: assets.type,
    status: assets.status,
    criticality: assets.criticality,
  });

  await db.insert(eventLogs).values({
    eventType: "asset.created",
    entityType: "asset",
    entityId: asset.id,
    assetId: asset.id,
    payload: asset,
  });

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
  const db = getDb();

  const [previous] = await db
    .select({
      id: assets.id,
      name: assets.name,
      status: assets.status,
    })
    .from(assets)
    .where(eq(assets.id, id))
    .limit(1);

  if (!previous) {
    throw new Error("Ativo nao encontrado.");
  }

  const [updated] = await db
    .update(assets)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(eq(assets.id, id))
    .returning({
      id: assets.id,
      name: assets.name,
      status: assets.status,
    });

  await db.insert(eventLogs).values({
    eventType: "asset.status_changed",
    entityType: "asset",
    entityId: updated.id,
    assetId: updated.id,
    payload: {
      name: updated.name,
      from: previous.status,
      to: updated.status,
      note,
    },
  });

  revalidatePath("/");
  revalidatePath("/assets");
  revalidatePath(`/assets/${id}`);
  redirect(`/assets/${id}`);
}
