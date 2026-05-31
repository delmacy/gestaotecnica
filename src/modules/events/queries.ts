import { workItems, serviceOrders, assets } from "@/db/schema";
import { count, desc, eq } from "drizzle-orm";
import { getDb, getRuntimeDb } from "@/db";
import { events as eventLogs } from "@/db/runtime/schema/workflow";

export async function getEvents() {
  const db = getRuntimeDb();

  return db
    .select({
      id: eventLogs.id,
      eventType: eventLogs.eventType,
      entityType: eventLogs.entityType,
      entityId: eventLogs.entityId,
      payload: eventLogs.payload,
      occurredAt: eventLogs.createdAt,
      workItemId: eventLogs.entityId,
      workItemTitle: workItems.title,
      serviceOrderId: eventLogs.entityId,
      serviceOrderCode: serviceOrders.code,
      serviceOrderTitle: serviceOrders.title,
      assetId: eventLogs.entityId,
      assetCode: assets.code,
      assetName: assets.name,
    })
    .from(eventLogs)
    .leftJoin(workItems, eq(eventLogs.entityId, workItems.id))
    .leftJoin(serviceOrders, eq(eventLogs.entityId, serviceOrders.id))
    .leftJoin(assets, eq(eventLogs.entityId, assets.id))
    .orderBy(desc(eventLogs.createdAt))
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
    { label: "OS", value: serviceOrderRow.value },
    { label: "Demandas", value: workItemRow.value },
    { label: "Ativos", value: assetRow.value },
  ];
}
