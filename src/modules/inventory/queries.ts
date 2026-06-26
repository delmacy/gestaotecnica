import { and, count, desc, eq, lte, sql } from "drizzle-orm";
import { getDb } from "@/db";
import {
  acquisitionNeeds,
  assets,
  inventoryItems,
  inventoryMovements,
  serviceOrders,
  suppliers,
  users,
} from "@/db/schema";

export type InventoryOptions = {
  items: Array<{ id: string; sku: string; name: string }>;
  suppliers: Array<{ id: string; name: string }>;
  assets: Array<{ id: string; code: string; name: string }>;
  serviceOrders: Array<{ id: string; code: string; title: string }>;
  acquisitions: Array<{ id: string; title: string }>;
  users: Array<{ id: string; name: string }>;
};

export async function getInventoryItems(workspaceId: string) {
  const db = getDb();
  return db.select({
    id: inventoryItems.id,
    sku: inventoryItems.sku,
    name: inventoryItems.name,
    category: inventoryItems.category,
    status: inventoryItems.status,
    quantityOnHand: inventoryItems.quantityOnHand,
    minimumQuantity: inventoryItems.minimumQuantity,
    unit: inventoryItems.unit,
    location: inventoryItems.location,
    lot: inventoryItems.lot,
    notes: inventoryItems.notes,
    supplierName: suppliers.name,
    assetCode: assets.code,
    assetName: assets.name,
  }).from(inventoryItems)
    .leftJoin(suppliers, eq(inventoryItems.supplierId, suppliers.id))
    .leftJoin(assets, eq(inventoryItems.assetId, assets.id))
    .where(eq(inventoryItems.workspaceId, workspaceId))
    .orderBy(desc(inventoryItems.createdAt))
    .limit(80);
}

export async function getInventoryMovements(workspaceId: string) {
  const db = getDb();
  return db.select({
    id: inventoryMovements.id,
    movementType: inventoryMovements.movementType,
    quantity: inventoryMovements.quantity,
    reason: inventoryMovements.reason,
    notes: inventoryMovements.notes,
    occurredAt: inventoryMovements.occurredAt,
    itemSku: inventoryItems.sku,
    itemName: inventoryItems.name,
    serviceOrderCode: serviceOrders.code,
    acquisitionTitle: acquisitionNeeds.title,
    performedByName: users.name,
  }).from(inventoryMovements)
    .innerJoin(inventoryItems, eq(inventoryMovements.itemId, inventoryItems.id))
    .leftJoin(serviceOrders, eq(inventoryMovements.serviceOrderId, serviceOrders.id))
    .leftJoin(acquisitionNeeds, eq(inventoryMovements.acquisitionNeedId, acquisitionNeeds.id))
    .leftJoin(users, eq(inventoryMovements.performedById, users.id))
    .where(eq(inventoryMovements.workspaceId, workspaceId))
    .orderBy(desc(inventoryMovements.occurredAt))
    .limit(80);
}

export async function getInventorySummary(workspaceId: string) {
  const db = getDb();
  const [items] = await db.select({ value: count() }).from(inventoryItems).where(eq(inventoryItems.workspaceId, workspaceId));
  const [lowStock] = await db.select({ value: count() }).from(inventoryItems).where(and(eq(inventoryItems.workspaceId, workspaceId), lte(inventoryItems.quantityOnHand, inventoryItems.minimumQuantity)));
  const [total] = await db.select({ value: sql<number>`coalesce(sum(${inventoryItems.quantityOnHand}), 0)` }).from(inventoryItems).where(eq(inventoryItems.workspaceId, workspaceId));
  return [
    { label: "Itens", value: items.value },
    { label: "Abaixo do minimo", value: lowStock.value },
    { label: "Saldo total", value: total.value },
  ];
}

export async function getInventoryOptions(workspaceId: string): Promise<InventoryOptions> {
  const db = getDb();
  const [itemRows, supplierRows, assetRows, orderRows, acquisitionRows, userRows] = await Promise.all([
    db.select({ id: inventoryItems.id, sku: inventoryItems.sku, name: inventoryItems.name }).from(inventoryItems).where(eq(inventoryItems.workspaceId, workspaceId)).orderBy(desc(inventoryItems.createdAt)).limit(80),
    db.select({ id: suppliers.id, name: suppliers.name }).from(suppliers).orderBy(desc(suppliers.createdAt)).limit(50),
    db.select({ id: assets.id, code: assets.code, name: assets.name }).from(assets).orderBy(desc(assets.createdAt)).limit(50),
    db.select({ id: serviceOrders.id, code: serviceOrders.code, title: serviceOrders.title }).from(serviceOrders).orderBy(desc(serviceOrders.createdAt)).limit(50),
    db.select({ id: acquisitionNeeds.id, title: acquisitionNeeds.title }).from(acquisitionNeeds).orderBy(desc(acquisitionNeeds.createdAt)).limit(50),
    db.select({ id: users.id, name: users.name }).from(users).orderBy(desc(users.createdAt)).limit(50),
  ]);
  return { items: itemRows, suppliers: supplierRows, assets: assetRows, serviceOrders: orderRows, acquisitions: acquisitionRows, users: userRows };
}
