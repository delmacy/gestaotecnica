import { desc, eq, count } from "drizzle-orm";
import { getDb } from "@/db";
import { assets, eventLogs, workItems } from "@/db/schema";
import { getWorkspaceWorkItemTypeOptions } from "@/platform/workspaces/catalogs";
import type { WorkItemTypeValue } from "./constants";

export async function getWorkItems() {
  const db = getDb();

  return db
    .select({
      id: workItems.id,
      title: workItems.title,
      description: workItems.description,
      type: workItems.type,
      status: workItems.status,
      priority: workItems.priority,
      requesterName: workItems.requesterName,
      requesterContact: workItems.requesterContact,
      assetId: workItems.assetId,
      assetCode: assets.code,
      assetName: assets.name,
      createdAt: workItems.createdAt,
    })
    .from(workItems)
    .leftJoin(assets, eq(workItems.assetId, assets.id))
    .orderBy(desc(workItems.createdAt))
    .limit(50);
}

export async function getWorkItemById(id: string) {
  const db = getDb();

  const [workItem] = await db
    .select({
      id: workItems.id,
      title: workItems.title,
      description: workItems.description,
      type: workItems.type,
      status: workItems.status,
      priority: workItems.priority,
      requesterName: workItems.requesterName,
      requesterContact: workItems.requesterContact,
      assetId: workItems.assetId,
      assetCode: assets.code,
      assetName: assets.name,
      createdAt: workItems.createdAt,
      updatedAt: workItems.updatedAt,
    })
    .from(workItems)
    .leftJoin(assets, eq(workItems.assetId, assets.id))
    .where(eq(workItems.id, id))
    .limit(1);

  return workItem ?? null;
}

export async function getWorkItemEvents(id: string) {
  const db = getDb();

  return db
    .select({
      id: eventLogs.id,
      eventType: eventLogs.eventType,
      payload: eventLogs.payload,
      occurredAt: eventLogs.occurredAt,
    })
    .from(eventLogs)
    .where(eq(eventLogs.workItemId, id))
    .orderBy(desc(eventLogs.occurredAt));
}

export async function getWorkItemSummary() {
  const db = getDb();

  const [totalRow] = await db.select({ value: count() }).from(workItems);
  const [openRow] = await db
    .select({ value: count() })
    .from(workItems)
    .where(eq(workItems.status, "open"));
  const [criticalRow] = await db
    .select({ value: count() })
    .from(workItems)
    .where(eq(workItems.priority, "critical"));
  const [eventsRow] = await db
    .select({ value: count() })
    .from(eventLogs)
    .where(eq(eventLogs.eventType, "work_item.created"));

  return [
    { label: "Demandas", value: totalRow.value },
    { label: "Abertas", value: openRow.value },
    { label: "Criticas", value: criticalRow.value },
    { label: "Eventos criados", value: eventsRow.value },
  ];
}

export async function getWorkItemTypeOptions() {
  const options = await getWorkspaceWorkItemTypeOptions();
  return options.map((option: any) => ({
    ...option,
    value: option.value as WorkItemTypeValue,
  }));
}
