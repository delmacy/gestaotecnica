import { eq, desc, and } from "drizzle-orm";
import { getDb } from "@/db";
import { processCandidates } from "@/db/schema";
import { events as eventLogs } from "@/db/schema";
import { resolveWorkspaceContext } from "@/platform/workspace";
import type { Case, CaseHistoryEvent, CaseComment } from "./contracts/case.schema";

export async function getCases(filters?: { status?: string; category?: string }): Promise<Case[]> {
  const context = await resolveWorkspaceContext({ source: "ui" });
  const db = getDb();

  const results = await db
    .select()
    .from(processCandidates)
    .where(
      and(
        eq(processCandidates.workspaceId, context.workspaceId),
        eq(processCandidates.origin, "case-management"),
        filters?.status ? eq(processCandidates.status, filters.status) : undefined
      )
    )
    .orderBy(desc(processCandidates.createdAt))
    .limit(100);

  return results.map((row: any) => {
    const proposed = (row.proposedDefinition as Record<string, any>) || {};
    return {
      id: row.id,
      workspaceId: row.workspaceId,
      title: row.name,
      description: row.description ?? undefined,
      status: row.status as any,
      origin: proposed.origin || "manual",
      category: proposed.category,
      priority: proposed.priority,
      assignedToId: proposed.assignedToId,
      assignedToName: proposed.assignedToName,
      metadata: proposed.metadata || {},
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  });
}

export async function getCaseById(id: string): Promise<Case | null> {
  const context = await resolveWorkspaceContext({ source: "ui" });
  const db = getDb();

  const [row] = await db
    .select()
    .from(processCandidates)
    .where(
      and(
        eq(processCandidates.id, id),
        eq(processCandidates.workspaceId, context.workspaceId),
        eq(processCandidates.origin, "case-management")
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
    origin: proposed.origin || "manual",
    category: proposed.category,
    priority: proposed.priority,
    assignedToId: proposed.assignedToId,
    assignedToName: proposed.assignedToName,
    metadata: proposed.metadata || {},
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

export async function getCaseHistory(id: string): Promise<CaseHistoryEvent[]> {
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

export async function getCaseComments(caseId: string): Promise<CaseComment[]> {
  const context = await resolveWorkspaceContext({ source: "ui" });
  const db = getDb();

  const results = await db
    .select()
    .from(eventLogs)
    .where(
      and(
        eq(eventLogs.entityId, caseId),
        eq(eventLogs.workspaceId, context.workspaceId),
        eq(eventLogs.eventType, "case_management.comment_added")
      )
    )
    .orderBy(desc(eventLogs.createdAt));

  return results.map((row: any) => {
    const payload = row.payload as any;
    return {
      id: row.id,
      authorId: payload.authorId,
      authorName: payload.authorName,
      content: payload.content,
      createdAt: row.createdAt,
    };
  });
}
