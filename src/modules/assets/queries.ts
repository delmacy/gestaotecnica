import { serviceOrders } from "@/db/schema";
import { workItems } from "@/db/schema";
import { assets } from "@/db/schema";
import { count, desc, eq } from "drizzle-orm";
import { getDb, getRuntimeDb } from "@/db";
import { workspaces } from "@/db/runtime/schema/workspace";
import { events as eventLogs } from "@/db/runtime/schema/workflow";
import { getWorkspaceAssetTypeOptions } from "@/platform/workspaces/catalogs";

export async function getAssets() {
  const db = getRuntimeDb();

  return db
    .select({
      id: assets.id,
      code: assets.code,
      name: assets.name,
      type: assets.type,
      status: assets.status,
      criticality: assets.criticality,
      location: assets.location,
      createdAt: assets.createdAt,
    })
    .from(assets)
    .orderBy(desc(assets.createdAt))
    .limit(50);
}

export async function getAssetOptions() {
  const db = getDb();

  return db
    .select({
      id: assets.id,
      code: assets.code,
      name: assets.name,
      status: assets.status,
    })
    .from(assets)
    .orderBy(desc(assets.createdAt))
    .limit(100);
}

export async function getAssetById(id: string) {
  const db = getDb();

  const [asset] = await db
    .select({
      id: assets.id,
      code: assets.code,
      name: assets.name,
      type: assets.type,
      status: assets.status,
      criticality: assets.criticality,
      location: assets.location,
      description: assets.description,
      createdAt: assets.createdAt,
      updatedAt: assets.updatedAt,
    })
    .from(assets)
    .where(eq(assets.id, id))
    .limit(1);

  return asset ?? null;
}

export async function getAssetEvents(id: string) {
  const db = getDb();

  return db
    .select({
      id: eventLogs.id,
      eventType: eventLogs.eventType,
      payload: eventLogs.payload,
      occurredAt: eventLogs.createdAt,
    })
    .from(eventLogs)
    .where(eq(eventLogs.entityId, id))
    .orderBy(desc(eventLogs.createdAt));
}

export async function getAssetRelationsSummary(id: string) {
  const db = getDb();
  const [workItemsRow] = await db
    .select({ value: count() })
    .from(workItems)
    .where(eq(workItems.assetId, id));
  const [serviceOrdersRow] = await db
    .select({ value: count() })
    .from(serviceOrders)
    .where(eq(serviceOrders.assetId, id));

  return [
    { label: "Demandas vinculadas", value: workItemsRow.value },
    { label: "OS vinculadas", value: serviceOrdersRow.value },
  ];
}

export async function getAssetSummary() {
  const db = getDb();

  const [totalRow] = await db.select({ value: count() }).from(assets);
  const [activeRow] = await db
    .select({ value: count() })
    .from(assets)
    .where(eq(assets.status, "active"));
  const [maintenanceRow] = await db
    .select({ value: count() })
    .from(assets)
    .where(eq(assets.status, "maintenance"));
  const [criticalRow] = await db
    .select({ value: count() })
    .from(assets)
    .where(eq(assets.criticality, "critical"));

  return [
    { label: "Ativos", value: totalRow.value },
    { label: "Ativos operacionais", value: activeRow.value },
    { label: "Em manutencao", value: maintenanceRow.value },
    { label: "Criticos", value: criticalRow.value },
  ];
}

export async function getAssetTypeOptions() {
  return getWorkspaceAssetTypeOptions();
}
