import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { processCandidates } from "@/db/platform/schema/candidates";

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

  const candidates = await db.select({
    id: processCandidates.id,
    origin: processCandidates.origin,
    proposedDefinition: processCandidates.proposedDefinition,
    createdAt: processCandidates.createdAt,
  })
  .from(processCandidates)
  .where(
    and(
      eq(processCandidates.workspaceId, workspaceId),
    )
  )
  .orderBy(desc(processCandidates.createdAt));

  const items = candidates.filter((c: any) => c.origin === "inventory-item");
  const movements = candidates.filter((c: any) => c.origin === "inventory-movement");

  const movementMap = new Map<string, any[]>();
  movements.forEach((m: any) => {
    const itemId = (m.proposedDefinition as any).itemId;
    if (!movementMap.has(itemId)) movementMap.set(itemId, []);
    movementMap.get(itemId)?.push(m);
  });

  return items.map((item: any) => {
    const def = item.proposedDefinition as any;

    const itemMovements = movementMap.get(item.id) || [];
    const balance = itemMovements.reduce((acc: number, m: any) => {
      const mDef = m.proposedDefinition as any;
      const qty = Number(mDef.quantity) || 0;

      // Semantics of adjustment: If movementType is 'adjustment', quantity is delta (positive or negative)
      if (mDef.movementType === 'inbound' || mDef.movementType === 'release') {
        return acc + qty;
      } else if (mDef.movementType === 'outbound' || mDef.movementType === 'reservation') {
        return acc - qty;
      } else if (mDef.movementType === 'adjustment') {
        return acc + qty; // For adjustments, quantity is the relative change
      }
      return acc;
    }, Number(def.initialQuantity) || 0);

    return {
      id: item.id,
      sku: def.sku,
      name: def.name,
      category: def.category,
      status: balance <= (Number(def.minimumQuantity) || 0) ? "low_stock" : "available",
      quantityOnHand: balance,
      minimumQuantity: def.minimumQuantity,
      unit: def.unit,
      location: def.location,
      notes: def.notes,
      supplierName: "N/A (Gap: Legacy Supplier Isolation)",
      assetCode: "N/A (Gap: Legacy Asset Isolation)",
      assetName: "",
    };
  });
}

export async function getInventoryMovements(workspaceId: string) {
  const db = getDb();

  const candidates = await db.select({
    id: processCandidates.id,
    origin: processCandidates.origin,
    proposedDefinition: processCandidates.proposedDefinition,
    createdAt: processCandidates.createdAt,
  })
  .from(processCandidates)
  .where(eq(processCandidates.workspaceId, workspaceId))
  .orderBy(desc(processCandidates.createdAt));

  const movementRows = candidates.filter((c: any) => c.origin === "inventory-movement").slice(0, 80);
  const itemRows = candidates.filter((c: any) => c.origin === "inventory-item");

  const itemMap = new Map(itemRows.map((i: any) => [i.id, (i.proposedDefinition as any).name]));
  const skuMap = new Map(itemRows.map((i: any) => [i.id, (i.proposedDefinition as any).sku]));

  return movementRows.map((m: any) => {
    const def = m.proposedDefinition as any;
    return {
      id: m.id,
      movementType: def.movementType,
      quantity: def.quantity,
      notes: def.notes,
      occurredAt: m.createdAt,
      itemSku: skuMap.get(def.itemId) || "Unknown",
      itemName: itemMap.get(def.itemId) || "Unknown Item",
      serviceOrderCode: "N/A (Gap: Legacy SO Isolation)",
      acquisitionTitle: "N/A (Gap: Legacy Acquisition Isolation)",
      performedByName: "N/A (Gap: Legacy User Isolation)",
    };
  });
}

export async function getInventorySummary(workspaceId: string) {
  const items = await getInventoryItems(workspaceId);

  const totalItems = items.length;
  const lowStockCount = items.filter((i: any) => i.quantityOnHand <= (Number(i.minimumQuantity) || 0)).length;
  const totalBalance = items.reduce((acc: number, i: any) => acc + i.quantityOnHand, 0);

  return [
    { label: "Itens", value: totalItems },
    { label: "Abaixo do minimo", value: lowStockCount },
    { label: "Saldo total", value: totalBalance },
  ];
}

export async function getInventoryOptions(workspaceId: string): Promise<InventoryOptions> {
  const db = getDb();

  const itemRows = await db.select({
    id: processCandidates.id,
    proposedDefinition: processCandidates.proposedDefinition,
  })
  .from(processCandidates)
  .where(
    and(
      eq(processCandidates.workspaceId, workspaceId),
      eq(processCandidates.origin, "inventory-item")
    )
  )
  .orderBy(desc(processCandidates.createdAt))
  .limit(80);

  const items = itemRows.map((i: any) => ({
    id: i.id,
    sku: (i.proposedDefinition as any).sku,
    name: (i.proposedDefinition as any).name,
  }));

  return {
    items,
    suppliers: [],
    assets: [],
    serviceOrders: [],
    acquisitions: [],
    users: [],
  };
}
