import { eq, and, desc, asc, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { processCandidates } from "@/db/platform/schema/candidates";
import { events as eventLogs } from "@/db/runtime/schema/workflow";
import { resolveWorkspaceContext } from "@/platform/workspace";
import type { ApprovalRequest, ApprovalStep } from "./contracts/approval.schema";

const REQUEST_ORIGIN = "approval-request";
const STEP_ORIGIN = "approval-step";

export async function getApprovalRequests(): Promise<ApprovalRequest[]> {
  const context = await resolveWorkspaceContext({ source: "ui" });
  const db = getDb();

  const results = await db
    .select()
    .from(processCandidates)
    .where(
      and(
        eq(processCandidates.workspaceId, context.workspaceId),
        eq(processCandidates.origin, REQUEST_ORIGIN)
      )
    )
    .orderBy(desc(processCandidates.createdAt))
    .limit(50);

  return results.map(mapRowToRequest);
}

export async function getApprovalRequestById(id: string): Promise<ApprovalRequest | null> {
  const context = await resolveWorkspaceContext({ source: "ui" });
  const db = getDb();

  const [row] = await db
    .select()
    .from(processCandidates)
    .where(
      and(
        eq(processCandidates.id, id),
        eq(processCandidates.workspaceId, context.workspaceId),
        eq(processCandidates.origin, REQUEST_ORIGIN)
      )
    )
    .limit(1);

  if (!row) return null;
  return mapRowToRequest(row);
}

export async function getApprovalSteps(requestId: string): Promise<ApprovalStep[]> {
  const context = await resolveWorkspaceContext({ source: "ui" });
  const db = getDb();

  // Validate parent ownership
  const [parent] = await db
    .select({ id: processCandidates.id })
    .from(processCandidates)
    .where(
      and(
        eq(processCandidates.id, requestId),
        eq(processCandidates.workspaceId, context.workspaceId),
        eq(processCandidates.origin, REQUEST_ORIGIN)
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
        eq(processCandidates.origin, STEP_ORIGIN),
        sql`${processCandidates.proposedDefinition}->>'requestId' = ${requestId}`
      )
    )
    .orderBy(asc(sql`${processCandidates.proposedDefinition}->>'order'`));

  return results.map(mapRowToStep);
}

function mapRowToRequest(row: any): ApprovalRequest {
  const def = (row.proposedDefinition as Record<string, any>) || {};
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    title: row.name,
    description: row.description ?? undefined,
    status: row.status as any,
    origin: row.origin,
    entityType: def.entityType,
    entityId: def.entityId,
    metadata: def.metadata || {},
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function mapRowToStep(row: any): ApprovalStep {
  const def = (row.proposedDefinition as Record<string, any>) || {};
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    requestId: def.requestId,
    order: Number(def.order) || 0,
    status: row.status as any,
    approverId: def.approverId,
    approverType: def.approverType,
    decision: def.decision,
    decidedAt: def.decidedAt ? new Date(def.decidedAt) : undefined,
    decidedById: def.decidedById,
    note: def.note,
  };
}
