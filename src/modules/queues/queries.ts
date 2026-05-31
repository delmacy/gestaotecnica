import { asc, count, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { workspaces } from "@/db/runtime/schema/workspace";
import { queueItems, slaPolicies, workspaceQueues, users } from "@/db/schema";
import { ensureActiveWorkspaceConfig } from "@/platform/workspaces/bootstrap";

export async function getQueueAdminData() {
  const workspace = await ensureActiveWorkspaceConfig();
  const db = getDb();

  const [queues, policies, items] = await Promise.all([
    db
      .select()
      .from(workspaceQueues)
      .where(eq(workspaceQueues.workspaceId, workspace.id))
      .orderBy(asc(workspaceQueues.sortOrder), asc(workspaceQueues.label)),
    db
      .select()
      .from(slaPolicies)
      .where(eq(slaPolicies.workspaceId, workspace.id))
      .orderBy(asc(slaPolicies.label)),
    db
      .select({
        id: queueItems.id,
        entityType: queueItems.entityType,
        entityId: queueItems.entityId,
        status: queueItems.status,
        priority: queueItems.priority,
        dueAt: queueItems.dueAt,
        createdAt: queueItems.createdAt,
        queueLabel: workspaceQueues.label,
        assigneeName: users.name,
      })
      .from(queueItems)
      .innerJoin(workspaceQueues, eq(queueItems.queueId, workspaceQueues.id))
      .leftJoin(users, eq(queueItems.assignedToId, users.id))
      .orderBy(desc(queueItems.createdAt))
      .limit(80),
  ]);

  const [openItems] = await db
    .select({ value: count() })
    .from(queueItems)
    .where(eq(queueItems.status, "open"));

  return { items, openItems: openItems.value, policies, queues, workspace };
}
