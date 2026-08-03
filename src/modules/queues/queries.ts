import { and, asc, count, desc, eq, inArray } from "drizzle-orm";
import { getDb } from "@/db";
import { workspaces } from "@/db/runtime/schema/workspace";
import { events as eventLogs } from "@/db/runtime/schema/workflow";
import { queueItems, slaPolicies, workspaceQueues, users } from "@/db/schema";
import { ensureActiveWorkspaceConfig } from "@/platform/workspaces/bootstrap";
import { QueueAuditEventTypes, QueueAuditReceiptSchema } from "./contracts/queue-audit";
import type { DraftRecoveryResponse } from "@/modules/operator-loop/contracts/draft-recovery-dto";

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

export async function getRecoverableDrafts(): Promise<DraftRecoveryResponse> {
  const workspace = await ensureActiveWorkspaceConfig();
  const db = getDb();

  const rows = await db
    .select({
      id: queueItems.id,
      entityType: queueItems.entityType,
      entityId: queueItems.entityId,
      updatedAt: queueItems.updatedAt,
      queueLabel: workspaceQueues.label,
    })
    .from(queueItems)
    .innerJoin(workspaceQueues, eq(queueItems.queueId, workspaceQueues.id))
    .where(
      and(
        eq(workspaceQueues.workspaceId, workspace.id),
        eq(queueItems.status, "draft"),
      ),
    )
    .orderBy(desc(queueItems.updatedAt))
    .limit(50);

  if (rows.length === 0) {
    return { state: "empty" };
  }

  return {
    state: "real",
    drafts: rows.map((row: { id: string; entityType: string; entityId: string; updatedAt: Date; queueLabel: string }) => ({
      id: row.id,
      entityType: row.entityType,
      title: `${row.entityType} — ${row.queueLabel}`,
      updatedAt: row.updatedAt,
      recoveryUrl: "/admin/queues",
    })),
  };
}

export async function getQueueItemReceipts() {
  const workspace = await ensureActiveWorkspaceConfig();
  const db = getDb();

  const rows = await db
    .select({
      id: eventLogs.id,
      eventType: eventLogs.eventType,
      entityType: eventLogs.entityType,
      entityId: eventLogs.entityId,
      actorName: users.name,
      occurredAt: eventLogs.createdAt,
    })
    .from(eventLogs)
    .leftJoin(users, eq(eventLogs.actorId, users.id))
    .where(
      and(
        eq(eventLogs.workspaceId, workspace.id),
        inArray(eventLogs.eventType, [...QueueAuditEventTypes]),
      ),
    )
    .orderBy(desc(eventLogs.createdAt))
    .limit(20);

  if (rows.length === 0) {
    return QueueAuditReceiptSchema.parse({
      state: "empty",
      workspaceId: workspace.id,
      workspaceName: workspace.name,
    });
  }

  return QueueAuditReceiptSchema.parse({
    state: "real",
    workspaceId: workspace.id,
    workspaceName: workspace.name,
    events: rows.map((row: { id: string; eventType: string; entityType: string; actorName: string | null; occurredAt: Date }) => ({
      id: row.id,
      eventType: row.eventType,
      entityType: row.entityType,
      actorName: row.actorName,
      occurredAt: row.occurredAt,
      payload: {},
    })),
  });
}
