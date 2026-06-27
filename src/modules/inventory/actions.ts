"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { processCandidates } from "@/db/platform/schema/candidates";
import { events as eventLogs } from "@/db/runtime/schema/workflow";
import { and, eq } from "drizzle-orm";
import { resolveWorkspaceContext } from "@/platform/workspace";
import {
  inventoryMovementTypes,
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

async function calculateCurrentBalance(db: any, workspaceId: string, itemId: string): Promise<number> {
  const itemRecord = await db.select()
    .from(processCandidates)
    .where(
      and(
        eq(processCandidates.id, itemId),
        eq(processCandidates.workspaceId, workspaceId),
        eq(processCandidates.origin, "inventory-item")
      )
    )
    .limit(1);

  if (!itemRecord[0]) {
    throw new Error("Item não encontrado ou acesso negado.");
  }

  const def = itemRecord[0].proposedDefinition;
  const initial = Number(def.initialQuantity) || 0;

  const movements = await db.select()
    .from(processCandidates)
    .where(
      and(
        eq(processCandidates.workspaceId, workspaceId),
        eq(processCandidates.origin, "inventory-movement")
      )
    );

  const itemMovements = movements.filter((m: any) => m.proposedDefinition.itemId === itemId);

  return itemMovements.reduce((acc: number, m: any) => {
    const mDef = m.proposedDefinition;
    const qty = Number(mDef.quantity) || 0;
    if (mDef.movementType === 'inbound' || mDef.movementType === 'release') {
      return acc + qty;
    } else if (mDef.movementType === 'outbound' || mDef.movementType === 'reservation') {
      return acc - qty;
    } else if (mDef.movementType === 'adjustment') {
      return acc + qty; // Adjustment quantity is the delta
    }
    return acc;
  }, initial);
}

export async function createInventoryItem(formData: FormData) {
  // Resolve workspaceId from trusted server context
  const context = await resolveWorkspaceContext();
  const workspaceId = context.workspaceId;

  const sku = readRequiredText(formData, "sku");
  const name = readRequiredText(formData, "name");
  const initialQuantity = readInteger(formData, "quantityOnHand", 0);
  const minimumQuantity = readInteger(formData, "minimumQuantity", 0);

  if (initialQuantity < 0 || minimumQuantity < 0) {
    throw new Error("Quantidades não podem ser negativas.");
  }

  const db = getDb();

  const [item] = await db.insert(processCandidates).values({
    workspaceId,
    name: `Item: ${name} (${sku})`,
    origin: "inventory-item",
    proposedDefinition: {
      sku,
      name,
      initialQuantity,
      minimumQuantity,
      category: readOptionalText(formData, "category"),
      unit: readOptionalText(formData, "unit") ?? "un",
      location: readOptionalText(formData, "location"),
      supplierId: readOptionalText(formData, "supplierId"),
      assetId: readOptionalText(formData, "assetId"),
      notes: readOptionalText(formData, "notes"),
    },
  }).returning({
    id: processCandidates.id,
  });

  await db.insert(eventLogs).values({
    workspaceId,
    eventType: "inventory_item.created",
    entityType: "inventory_item",
    entityId: item.id,
    payload: { id: item.id, sku, name },
  });

  revalidatePath("/inventory");
  redirect("/inventory");
}

export async function createInventoryMovement(formData: FormData) {
  // Resolve workspaceId from trusted server context
  const context = await resolveWorkspaceContext();
  const workspaceId = context.workspaceId;

  const itemId = readRequiredText(formData, "itemId");
  const movementType = readEnum<InventoryMovementTypeValue>(
    formData,
    "movementType",
    inventoryMovementTypes,
    "adjustment",
  );
  const quantity = readInteger(formData, "quantity");

  // Validation for adjustment: quantity can be negative, for others must be positive
  if (movementType !== 'adjustment' && quantity <= 0) {
    throw new Error("Quantidade de movimentação deve ser maior que zero para este tipo.");
  }
  if (movementType === 'adjustment' && quantity === 0) {
    throw new Error("Ajuste deve ter valor diferente de zero.");
  }

  const db = getDb();

  // Calculate current balance before reductions
  const currentBalance = await calculateCurrentBalance(db, workspaceId, itemId);

  // Semantics: outbound/reservation reduce balance. adjustment reduces if quantity is negative.
  let delta = 0;
  if (movementType === 'inbound' || movementType === 'release') {
    delta = quantity;
  } else if (movementType === 'outbound' || movementType === 'reservation') {
    delta = -quantity;
  } else if (movementType === 'adjustment') {
    delta = quantity;
  }

  if (currentBalance + delta < 0) {
    throw new Error(`Saldo insuficiente. Saldo atual: ${currentBalance}, Tentativa de alteração: ${delta}`);
  }

  const [movement] = await db.insert(processCandidates).values({
    workspaceId,
    name: `Movimentação: ${movementType} - ${quantity}`,
    origin: "inventory-movement",
    proposedDefinition: {
      itemId,
      movementType,
      quantity,
      serviceOrderId: readOptionalText(formData, "serviceOrderId"),
      acquisitionNeedId: readOptionalText(formData, "acquisitionNeedId"),
      performedById: readOptionalText(formData, "performedById"),
      notes: readOptionalText(formData, "notes"),
    },
  }).returning({
    id: processCandidates.id,
  });

  await db.insert(eventLogs).values({
    workspaceId,
    eventType: "inventory_movement.created",
    entityType: "inventory_movement",
    entityId: movement.id,
    payload: { id: movement.id, itemId, movementType, quantity },
  });

  revalidatePath("/inventory");
  redirect("/inventory");
}
