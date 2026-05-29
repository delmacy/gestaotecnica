import { count, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { assets, eventLogs, serviceOrders, workItems } from "@/db/schema";

export async function getEvents() {
  const db = getDb();

  return db
    .select({
      id: eventLogs.id,
      eventType: eventLogs.eventType,
      entityType: eventLogs.entityType,
      entityId: eventLogs.entityId,
      payload: eventLogs.payload,
      occurredAt: eventLogs.occurredAt,
      workItemId: eventLogs.workItemId,
      workItemTitle: workItems.title,
      serviceOrderId: eventLogs.serviceOrderId,
      serviceOrderCode: serviceOrders.code,
      serviceOrderTitle: serviceOrders.title,
      assetId: eventLogs.assetId,
      assetCode: assets.code,
      assetName: assets.name,
    })
    .from(eventLogs)
    .leftJoin(workItems, eq(eventLogs.workItemId, workItems.id))
    .leftJoin(serviceOrders, eq(eventLogs.serviceOrderId, serviceOrders.id))
    .leftJoin(assets, eq(eventLogs.assetId, assets.id))
    .orderBy(desc(eventLogs.occurredAt))
    .limit(120);
}

export async function getEventSummary() {
  const db = getDb();

  const [totalRow] = await db.select({ value: count() }).from(eventLogs);
  const [serviceOrderRow] = await db
    .select({ value: count() })
    .from(eventLogs)
    .where(eq(eventLogs.entityType, "service_order"));
  const [workItemRow] = await db
    .select({ value: count() })
    .from(eventLogs)
    .where(eq(eventLogs.entityType, "work_item"));
  const [assetRow] = await db
    .select({ value: count() })
    .from(eventLogs)
    .where(eq(eventLogs.entityType, "asset"));

  return [
    { label: "Eventos", value: totalRow.value },
    { label: "execucao", value: serviceOrderRow.value },
    { label: "Demandas", value: workItemRow.value },
    { label: "Ativos", value: assetRow.value },
  ];
}
