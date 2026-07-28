import { desc, eq, count } from "drizzle-orm";
import { getDb, getRuntimeDb } from "@/db";
import { assets, workItems } from "@/db/legacy/schema";
import { workspaces } from "@/db/runtime/schema/workspace";
import { events as eventLogs } from "@/db/runtime/schema/workflow";
import { getWorkspaceWorkItemTypeOptions } from "@/platform/workspaces/catalogs";
import type { WorkItemTypeValue } from "./constants";
import type { WorkItem } from "./contracts/work-item.schema";

type WorkItemWithAsset = WorkItem & { assetCode: string | null; assetName: string | null };

export async function getWorkItems(): Promise<WorkItemWithAsset[]> {
  const db = getDb(); // Using getDb for workItems since it's legacy

  const results = await db
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
      assignedTeamId: workItems.assignedTeamId,
      createdById: workItems.createdById,
      payload: workItems.payload,
      createdAt: workItems.createdAt,
      updatedAt: workItems.updatedAt,
      assetCode: assets.code,
      assetName: assets.name,
    })
    .from(workItems)
    .leftJoin(assets, eq(workItems.assetId, assets.id))
    .orderBy(desc(workItems.createdAt))
    .limit(50);

  return results as unknown as WorkItemWithAsset[];
}

export async function getWorkItemById(id: string): Promise<WorkItemWithAsset | null> {
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
      assignedTeamId: workItems.assignedTeamId,
      createdById: workItems.createdById,
      payload: workItems.payload,
      createdAt: workItems.createdAt,
      updatedAt: workItems.updatedAt,
      assetCode: assets.code,
      assetName: assets.name,
    })
    .from(workItems)
    .leftJoin(assets, eq(workItems.assetId, assets.id))
    .where(eq(workItems.id, id))
    .limit(1);

  return (workItem as unknown as WorkItemWithAsset) ?? null;
}

export async function getWorkItemEvents(id: string) {
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
  return options.map((option) => ({
    ...option,
    value: option.value as WorkItemTypeValue,
  }));
}
