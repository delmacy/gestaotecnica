import { eq, desc, and } from "drizzle-orm";
import { getDb } from "@/db";
import { processCandidates } from "@/db/platform/schema/candidates";
import { events as eventLogs } from "@/db/runtime/schema/workflow";
import { resolveWorkspaceContext } from "@/platform/workspace";
import type { IntakeRequest, IntakeHistoryEvent } from "./contracts/intake.schema";

export async function getIntakeRequests(filters?: { status?: string }): Promise<IntakeRequest[]> {
  const context = await resolveWorkspaceContext({ source: "ui" });
  const db = getDb();

  const results = await db
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

  return results.map((row: any) => {
    const proposed = (row.proposedDefinition as Record<string, any>) || {};
    return {
      id: row.id,
      workspaceId: row.workspaceId,
      title: row.name,
      description: row.description ?? undefined,
      status: row.status as any,
      source: row.origin as any,
      category: proposed.category,
      priority: proposed.priority,
      requester: proposed.requester,
      metadata: proposed.metadata || {},
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  });
}

export async function getIntakeRequestById(id: string): Promise<IntakeRequest | null> {
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

  const r = row as any;
  const proposed = (r.proposedDefinition as Record<string, any>) || {};
  return {
    id: r.id,
    workspaceId: r.workspaceId,
    title: r.name,
    description: r.description ?? undefined,
    status: r.status as any,
    source: r.origin as any,
    category: proposed.category,
    priority: proposed.priority,
    requester: proposed.requester,
    metadata: proposed.metadata || {},
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

export async function getIntakeHistory(id: string): Promise<IntakeHistoryEvent[]> {
  const context = await resolveWorkspaceContext({ source: "ui" });
  const db = getDb();

  const results = await db
    .select({
      id: eventLogs.id,
      eventType: eventLogs.eventType,
      payload: eventLogs.payload,
      occurredAt: eventLogs.createdAt,
    })
    .from(eventLogs)
    .where(
      and(
        eq(eventLogs.entityId, id),
        eq(eventLogs.workspaceId, context.workspaceId)
      )
    )
    .orderBy(desc(eventLogs.createdAt));

  return results as any[];
}
