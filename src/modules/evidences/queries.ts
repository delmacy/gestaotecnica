import { count, desc, eq, isNotNull } from "drizzle-orm";
import { getDb } from "@/db";
import { assets, evidences, serviceOrders, workItems } from "@/db/schema";

export async function getEvidences() {
  const db = getDb();

  return db
    .select({
      id: evidences.id,
      title: evidences.title,
      description: evidences.description,
      fileUrl: evidences.fileUrl,
      mimeType: evidences.mimeType,
      createdAt: evidences.createdAt,
      serviceOrderId: evidences.serviceOrderId,
      serviceOrderCode: serviceOrders.code,
      serviceOrderTitle: serviceOrders.title,
      workItemId: evidences.workItemId,
      workItemTitle: workItems.title,
      assetId: evidences.assetId,
      assetCode: assets.code,
      assetName: assets.name,
    })
    .from(evidences)
    .leftJoin(serviceOrders, eq(evidences.serviceOrderId, serviceOrders.id))
    .leftJoin(workItems, eq(evidences.workItemId, workItems.id))
    .leftJoin(assets, eq(evidences.assetId, assets.id))
    .orderBy(desc(evidences.createdAt))
    .limit(100);
}

export async function getEvidenceSummary() {
  const db = getDb();

  const [totalRow] = await db.select({ value: count() }).from(evidences);
  const [serviceOrderRow] = await db
    .select({ value: count() })
    .from(evidences)
    .where(isNotNull(evidences.serviceOrderId));
  const [assetRow] = await db
    .select({ value: count() })
    .from(evidences)
    .where(isNotNull(evidences.assetId));

  return [
    { label: "Evidencias", value: totalRow.value },
    { label: "Com OS", value: serviceOrderRow.value },
    { label: "Com ativo", value: assetRow.value },
  ];
}

export async function getEvidenceLinkOptions() {
  const db = getDb();
  const [serviceOrderRows, workItemRows, assetRows] = await Promise.all([
    db
      .select({
        id: serviceOrders.id,
        code: serviceOrders.code,
        title: serviceOrders.title,
      })
      .from(serviceOrders)
      .orderBy(desc(serviceOrders.createdAt))
      .limit(40),
    db
      .select({
        id: workItems.id,
        title: workItems.title,
      })
      .from(workItems)
      .orderBy(desc(workItems.createdAt))
      .limit(40),
    db
      .select({
        id: assets.id,
        code: assets.code,
        name: assets.name,
      })
      .from(assets)
      .orderBy(desc(assets.createdAt))
      .limit(40),
  ]);

  return {
    serviceOrders: serviceOrderRows,
    workItems: workItemRows,
    assets: assetRows,
  };
}
