import { eq, desc, and } from "drizzle-orm";
import { getDb } from "@/db";
import { processCandidates } from "@/db/platform/schema/candidates";
import { events as eventLogs } from "@/db/runtime/schema/workflow";
import { resolveWorkspaceContext } from "@/platform/workspace";

export async function getIntakeRequests(filters?: { status?: string }) {
  const context = await resolveWorkspaceContext({ source: "ui" });
  const db = getDb();

  const query = db
    .select()
    .from(processCandidates)
    .where(
      and(
        eq(processCandidates.workspaceId, context.workspaceId),
        filters?.status ? eq(processCandidates.status, filters.status) : undefined
      )
    )
    .orderBy(desc(processCandidates.createdAt))
    .limit(50);

  const results = await query;

  return results.map((row: any) => {
    const proposed = (row.proposedDefinition as any) || {};
    return {
      id: row.id,
      workspaceId: row.workspaceId,
      title: row.name,
      description: row.description,
      status: row.status,
      origin: row.origin,
      category: proposed.category,
      priority: proposed.priority,
      requester: proposed.requester,
      metadata: proposed.metadata,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  });
}

export async function getIntakeRequestById(id: string) {
  const context = await resolveWorkspaceContext({ source: "ui" });
  const db = getDb();

  const [row] = await db
    .select()
    .from(processCandidates)
    .where(
      and(
        eq(processCandidates.id, id),
        eq(processCandidates.workspaceId, context.workspaceId)
      )
    )
    .limit(1);

  if (!row) return null;

  const proposed = (row.proposedDefinition as any) || {};
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    title: row.name,
    description: row.description,
    status: row.status,
    origin: row.origin,
    category: proposed.category,
    priority: proposed.priority,
    requester: proposed.requester,
    metadata: proposed.metadata,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function getIntakeHistory(id: string) {
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
