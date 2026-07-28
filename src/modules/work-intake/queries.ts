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

  return results.map((row: unknown) => {
    const r = row as {
      id: string;
      workspaceId: string;
      name: string;
      description: string | null;
      status: string;
      origin: string;
      proposedDefinition: unknown;
      createdAt: Date;
      updatedAt: Date;
    };
    const proposed = (r.proposedDefinition as Record<string, unknown>) || {};
    return {
      id: r.id,
      workspaceId: r.workspaceId,
      title: r.name,
      description: r.description ?? undefined,
      status: r.status as IntakeRequest["status"],
      source: r.origin as IntakeRequest["source"],
      category: proposed.category as string,
      priority: proposed.priority as IntakeRequest["priority"],
      requester: proposed.requester as IntakeRequest["requester"],
      metadata: (proposed.metadata as Record<string, unknown>) || {},
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
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

  const r = row as {
    id: string;
    workspaceId: string;
    name: string;
    description: string | null;
    status: string;
    origin: string;
    proposedDefinition: unknown;
    createdAt: Date;
    updatedAt: Date;
  };
  const proposed = (r.proposedDefinition as Record<string, unknown>) || {};
  return {
    id: r.id,
    workspaceId: r.workspaceId,
    title: r.name,
    description: r.description ?? undefined,
    status: r.status as IntakeRequest["status"],
    source: r.origin as IntakeRequest["source"],
    category: proposed.category as string,
    priority: proposed.priority as IntakeRequest["priority"],
    requester: proposed.requester as IntakeRequest["requester"],
    metadata: (proposed.metadata as Record<string, unknown>) || {},
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

  return results as unknown as IntakeHistoryEvent[];
}
