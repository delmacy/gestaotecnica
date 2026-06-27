import { eq, desc, and, sql, asc } from "drizzle-orm";
import { getDb } from "@/db";
import { processCandidates } from "@/db/platform/schema/candidates";
import { events as eventLogs } from "@/db/runtime/schema/workflow";
import { users } from "@/db/legacy/schema";
import { workspaceMembers } from "@/db/runtime/schema/workspace";
import { resolveWorkspaceContext } from "@/platform/workspace";
import type { Case, CaseHistoryEvent, CaseComment } from "./contracts/case.schema";

const ORIGIN = "case-management";
const COMMENT_ORIGIN = "case-management-comment";

function mapRowToCase(row: any): Case {
  const proposed = (row.proposedDefinition as Record<string, any>) || {};
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    title: row.name,
    description: row.description ?? undefined,
    status: row.status as any,
    priority: proposed.priority,
    category: proposed.category,
    responsibleId: proposed.responsibleId,
    metadata: proposed.metadata || {},
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function getCases(filters?: { category?: string }): Promise<Case[]> {
  const context = await resolveWorkspaceContext({ source: "ui" });
  const db = getDb();

  const results = await db
    .select()
    .from(processCandidates)
    .where(
      and(
        eq(processCandidates.workspaceId, context.workspaceId),
        eq(processCandidates.origin, ORIGIN),
        filters?.category
          ? sql`${processCandidates.proposedDefinition}->>'category' = ${filters.category}`
          : undefined
      )
    )
    .orderBy(desc(processCandidates.createdAt))
    .limit(50);

  return results.map(mapRowToCase);
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
        eq(processCandidates.origin, ORIGIN)
      )
    )
    .limit(1);

  if (!row) return null;

  return mapRowToCase(row);
}

export async function getCaseHistory(id: string): Promise<CaseHistoryEvent[]> {
  const context = await resolveWorkspaceContext({ source: "ui" });
  const db = getDb();

  // Confirm case exists, same workspace and origin before reading events
  const [parent] = await db
    .select({ id: processCandidates.id })
    .from(processCandidates)
    .where(
      and(
        eq(processCandidates.id, id),
        eq(processCandidates.workspaceId, context.workspaceId),
        eq(processCandidates.origin, ORIGIN)
      )
    )
    .limit(1);

  if (!parent) return [];

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
        eq(eventLogs.entityType, "case"),
        eq(eventLogs.workspaceId, context.workspaceId)
      )
    )
    .orderBy(desc(eventLogs.createdAt));

  return results as any[];
}

export async function getCaseComments(id: string): Promise<CaseComment[]> {
  const context = await resolveWorkspaceContext({ source: "ui" });
  const db = getDb();

  // Confirm case exists, same workspace and origin before reading comments
  const [parent] = await db
    .select({ id: processCandidates.id })
    .from(processCandidates)
    .where(
      and(
        eq(processCandidates.id, id),
        eq(processCandidates.workspaceId, context.workspaceId),
        eq(processCandidates.origin, ORIGIN)
      )
    )
    .limit(1);

  if (!parent) return [];

  const results = await db
    .select()
    .from(processCandidates)
    .where(
      and(
        eq(processCandidates.workspaceId, context.workspaceId),
        eq(processCandidates.origin, COMMENT_ORIGIN),
        sql`${processCandidates.proposedDefinition}->>'caseId' = ${id}`
      )
    )
    .orderBy(desc(processCandidates.createdAt))
    .limit(100);

  if (!Array.isArray(results)) return [];

  return results.map((row: any) => {
    const proposed = (row.proposedDefinition as Record<string, any>) || {};
    return {
      id: row.id,
      body: proposed.body || row.description || "",
      authorName: proposed.authorName,
      createdAt: row.createdAt,
    };
  });
}

export async function getUsers() {
  const context = await resolveWorkspaceContext({ source: "ui" });
  const db = getDb();

  // Filter users through workspace_members for isolation
  return db
    .select({
      id: users.id,
      name: users.name,
    })
    .from(workspaceMembers)
    .innerJoin(users, eq(workspaceMembers.userId, users.id))
    .where(eq(workspaceMembers.workspaceId, context.workspaceId))
    .orderBy(asc(users.name));
}
