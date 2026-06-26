"use server";

import { inventoryMovements, inventoryItems } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb, getRuntimeDb } from "@/db";
import { events as eventLogs } from "@/db/runtime/schema/workflow";
import {
  inventoryItemStatuses,
  inventoryMovementTypes,
  type InventoryItemStatusValue,
  type InventoryMovementTypeValue,
} from "./constants";

function readRequiredText(formData: FormData, field: string) {
  const value = String(formData.get(field) ?? "").trim();
  if (!value) throw new Error(`Campo obrigatorio ausente: ${field}`);
  return value;
}

function readOptionalText(formData: FormData, field: string) {
  const value = String(formData.get(field) ?? "").trim();
  return value.length > 0 ? value : undefined;
}

function readInteger(formData: FormData, field: string, fallback?: number) {
  const value = readOptionalText(formData, field);
  if (!value && fallback !== undefined) return fallback;
  if (!value) throw new Error(`Campo obrigatorio ausente: ${field}`);
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) throw new Error(`Numero invalido: ${field}`);
  return parsed;
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

export async function createInventoryItem(formData: FormData) {
  const workspaceId = readRequiredText(formData, "workspaceId");
  const sku = readRequiredText(formData, "sku");
  const name = readRequiredText(formData, "name");
  const quantityOnHand = readInteger(formData, "quantityOnHand", 0);
  const minimumQuantity = readInteger(formData, "minimumQuantity", 0);
  const status = readEnum<InventoryItemStatusValue>(
    formData,
    "status",
    inventoryItemStatuses,
    quantityOnHand <= minimumQuantity ? "low_stock" : "available",
  );
  const db = getRuntimeDb();

  const [item] = await db.insert(inventoryItems).values({
    workspaceId,
    sku,
    name,
    status,
    quantityOnHand,
    minimumQuantity,
    category: readOptionalText(formData, "category"),
    unit: readOptionalText(formData, "unit") ?? "un",
    location: readOptionalText(formData, "location"),
    lot: readOptionalText(formData, "lot"),
    supplierId: readOptionalText(formData, "supplierId"),
    assetId: readOptionalText(formData, "assetId"),
    notes: readOptionalText(formData, "notes"),
  }).returning({
    id: inventoryItems.id,
    sku: inventoryItems.sku,
    name: inventoryItems.name,
    status: inventoryItems.status,
  });

  await db.insert(eventLogs).values({
    workspaceId,
    eventType: "inventory_item.created",
    entityType: "inventory_item",
    entityId: item.id,
    assetId: readOptionalText(formData, "assetId"),
    payload: item,
  });

  revalidatePath("/");
  revalidatePath("/inventory");
  revalidatePath("/events");
  redirect("/inventory");
}

export async function createInventoryMovement(formData: FormData) {
  const workspaceId = readRequiredText(formData, "workspaceId");
  const itemId = readRequiredText(formData, "itemId");
  const movementType = readEnum<InventoryMovementTypeValue>(
    formData,
    "movementType",
    inventoryMovementTypes,
    "adjustment",
  );
  const quantity = readInteger(formData, "quantity");
  const db = getDb();

  // Validate item belongs to workspace
  const [item] = await db.select()
    .from(inventoryItems)
    .where(and(eq(inventoryItems.id, itemId), eq(inventoryItems.workspaceId, workspaceId)))
    .limit(1);

  if (!item) {
    throw new Error("Item nao encontrado no workspace selecionado.");
  }

  const delta = movementType === "inbound" || movementType === "release" ? quantity : -quantity;
  const [movement] = await db.insert(inventoryMovements).values({
    workspaceId,
    itemId,
    movementType,
    quantity,
    reason: readOptionalText(formData, "reason"),
    serviceOrderId: readOptionalText(formData, "serviceOrderId"),
    acquisitionNeedId: readOptionalText(formData, "acquisitionNeedId"),
    performedById: readOptionalText(formData, "performedById"),
    notes: readOptionalText(formData, "notes"),
  }).returning({
    id: inventoryMovements.id,
    itemId: inventoryMovements.itemId,
    movementType: inventoryMovements.movementType,
    quantity: inventoryMovements.quantity,
  });

  await db.update(inventoryItems)
    .set({
      quantityOnHand: sql`${inventoryItems.quantityOnHand} + ${delta}`,
      updatedAt: new Date(),
    })
    .where(and(eq(inventoryItems.id, itemId), eq(inventoryItems.workspaceId, workspaceId)));

  await db.insert(eventLogs).values({
    workspaceId,
    eventType: "inventory_movement.created",
    entityType: "inventory_movement",
    entityId: movement.id,
    serviceOrderId: readOptionalText(formData, "serviceOrderId"),
    payload: movement,
  });

  revalidatePath("/");
  revalidatePath("/inventory");
  revalidatePath("/events");
  redirect("/inventory");
}
