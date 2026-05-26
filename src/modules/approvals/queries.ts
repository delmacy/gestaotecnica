import { count, desc, eq, inArray } from "drizzle-orm";
import { getDb } from "@/db";
import { assets, serviceOrders, workItems } from "@/db/schema";

export async function getApprovalQueue() {
  const db = getDb();

  return db
    .select({
      id: serviceOrders.id,
      code: serviceOrders.code,
      title: serviceOrders.title,
      objective: serviceOrders.objective,
      status: serviceOrders.status,
      priority: serviceOrders.priority,
      completedAt: serviceOrders.completedAt,
      createdAt: serviceOrders.createdAt,
      workItemId: serviceOrders.workItemId,
      workItemTitle: workItems.title,
      assetId: serviceOrders.assetId,
      assetCode: assets.code,
      assetName: assets.name,
    })
    .from(serviceOrders)
    .leftJoin(workItems, eq(serviceOrders.workItemId, workItems.id))
    .leftJoin(assets, eq(serviceOrders.assetId, assets.id))
    .where(inArray(serviceOrders.status, ["waiting_review", "completed"]))
    .orderBy(desc(serviceOrders.updatedAt))
    .limit(50);
}

export async function getApprovalSummary() {
  const db = getDb();

  const [waitingRow] = await db
    .select({ value: count() })
    .from(serviceOrders)
    .where(eq(serviceOrders.status, "waiting_review"));
  const [completedRow] = await db
    .select({ value: count() })
    .from(serviceOrders)
    .where(eq(serviceOrders.status, "completed"));
  const [approvedRow] = await db
    .select({ value: count() })
    .from(serviceOrders)
    .where(eq(serviceOrders.status, "approved"));

  return [
    { label: "Em revisao", value: waitingRow.value },
    { label: "Concluidas", value: completedRow.value },
    { label: "Aprovadas", value: approvedRow.value },
  ];
}
