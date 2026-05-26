import { count, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import {
  assets,
  legacyRecords,
  serviceOrders,
  technicalDocuments,
  workItems,
} from "@/db/schema";

export async function getLegacyRecords() {
  const db = getDb();

  return db
    .select({
      id: legacyRecords.id,
      systemName: legacyRecords.systemName,
      protocolNumber: legacyRecords.protocolNumber,
      externalRecordId: legacyRecords.externalRecordId,
      externalStatus: legacyRecords.externalStatus,
      syncStatus: legacyRecords.syncStatus,
      exportedAt: legacyRecords.exportedAt,
      notes: legacyRecords.notes,
      createdAt: legacyRecords.createdAt,
      serviceOrderId: legacyRecords.serviceOrderId,
      serviceOrderCode: serviceOrders.code,
      serviceOrderTitle: serviceOrders.title,
      workItemId: legacyRecords.workItemId,
      workItemTitle: workItems.title,
      assetId: legacyRecords.assetId,
      assetCode: assets.code,
      assetName: assets.name,
      documentId: legacyRecords.documentId,
      documentTitle: technicalDocuments.title,
    })
    .from(legacyRecords)
    .leftJoin(serviceOrders, eq(legacyRecords.serviceOrderId, serviceOrders.id))
    .leftJoin(workItems, eq(legacyRecords.workItemId, workItems.id))
    .leftJoin(assets, eq(legacyRecords.assetId, assets.id))
    .leftJoin(technicalDocuments, eq(legacyRecords.documentId, technicalDocuments.id))
    .orderBy(desc(legacyRecords.createdAt))
    .limit(80);
}

export async function getLegacySummary() {
  const db = getDb();
  const [pending] = await db
    .select({ value: count() })
    .from(legacyRecords)
    .where(eq(legacyRecords.syncStatus, "pending"));
  const [exported] = await db
    .select({ value: count() })
    .from(legacyRecords)
    .where(eq(legacyRecords.syncStatus, "exported"));
  const [confirmed] = await db
    .select({ value: count() })
    .from(legacyRecords)
    .where(eq(legacyRecords.syncStatus, "confirmed"));

  return [
    { label: "Pendentes", value: pending.value },
    { label: "Exportados", value: exported.value },
    { label: "Confirmados", value: confirmed.value },
  ];
}

export async function getLegacyLinkOptions() {
  const db = getDb();
  const [serviceOrdersRows, workItemsRows, assetRows, documentRows] =
    await Promise.all([
      db.select({ id: serviceOrders.id, code: serviceOrders.code, title: serviceOrders.title }).from(serviceOrders).orderBy(desc(serviceOrders.createdAt)).limit(40),
      db.select({ id: workItems.id, title: workItems.title }).from(workItems).orderBy(desc(workItems.createdAt)).limit(40),
      db.select({ id: assets.id, code: assets.code, name: assets.name }).from(assets).orderBy(desc(assets.createdAt)).limit(40),
      db.select({ id: technicalDocuments.id, title: technicalDocuments.title }).from(technicalDocuments).orderBy(desc(technicalDocuments.createdAt)).limit(40),
    ]);

  return {
    assets: assetRows,
    documents: documentRows,
    serviceOrders: serviceOrdersRows,
    workItems: workItemsRows,
  };
}
