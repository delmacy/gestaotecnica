import { count, desc, eq, and } from "drizzle-orm";
import { getDb } from "@/db";
import { processCandidates } from "@/db/platform/schema/candidates";
import { events as eventLogs } from "@/db/runtime/schema/workflow";
import { resolveWorkspaceContext } from "@/platform/workspace";
import type { ApprovalRequest, ApprovalHistoryEvent } from "./contracts/approval.schema";

/**
 * Common filters for all approval queries to ensure isolation
 */
const approvalFilters = (workspaceId: string) => and(
  eq(processCandidates.workspaceId, workspaceId),
  eq(processCandidates.origin, "approval")
);

export async function getApprovalQueue(): Promise<ApprovalRequest[]> {
  const context = await resolveWorkspaceContext({ source: "ui" });
  const db = getDb();

  const results = await db
    .select()
    .from(processCandidates)
    .where(
      and(
        approvalFilters(context.workspaceId),
        eq(processCandidates.status, "pending")
      )
    )
    .orderBy(desc(processCandidates.createdAt))
    .limit(50);

  return results.map((row: any): ApprovalRequest => {
    const proposed = (row.proposedDefinition as Record<string, any>) || {};
    return {
      id: row.id,
      workspaceId: row.workspaceId,
      subjectType: proposed.subjectType,
      subjectId: proposed.subjectId,
      requesterId: proposed.requesterId,
      requesterName: proposed.requesterName,
      approverId: proposed.approverId,
      approverName: proposed.approverName,
      status: row.status as any,
      comment: row.description ?? undefined,
      decision: proposed.decision as any,
      decidedAt: proposed.decidedAt ? new Date(proposed.decidedAt) : undefined,
      metadata: proposed.metadata || {},
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  });
}

export async function getApprovalById(id: string): Promise<ApprovalRequest | null> {
  const context = await resolveWorkspaceContext({ source: "ui" });
  const db = getDb();

  const [row] = await db
    .select()
    .from(processCandidates)
    .where(
      and(
        eq(processCandidates.id, id),
        approvalFilters(context.workspaceId)
      )
    )
    .limit(1);

  if (!row) return null;

  const r = row as any;
  const proposed = (r.proposedDefinition as Record<string, any>) || {};
  return {
    id: r.id,
    workspaceId: r.workspaceId,
    subjectType: proposed.subjectType,
    subjectId: proposed.subjectId,
    requesterId: proposed.requesterId,
    requesterName: proposed.requesterName,
    approverId: proposed.approverId,
    approverName: proposed.approverName,
    status: r.status as any,
    comment: r.description ?? undefined,
    decision: proposed.decision as any,
    decidedAt: proposed.decidedAt ? new Date(proposed.decidedAt) : undefined,
    metadata: proposed.metadata || {},
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

export async function getApprovalSummary() {
  const context = await resolveWorkspaceContext({ source: "ui" });
  const db = getDb();

  const [pendingRow] = await db
    .select({ value: count() })
    .from(processCandidates)
    .where(
      and(
        approvalFilters(context.workspaceId),
        eq(processCandidates.status, "pending")
      )
    );

  const [approvedRow] = await db
    .select({ value: count() })
    .from(processCandidates)
    .where(
      and(
        approvalFilters(context.workspaceId),
        eq(processCandidates.status, "approved")
      )
    );

  const [rejectedRow] = await db
    .select({ value: count() })
    .from(processCandidates)
    .where(
      and(
        approvalFilters(context.workspaceId),
        eq(processCandidates.status, "rejected")
      )
    );

  return [
    { label: "Pendentes", value: pendingRow.value },
    { label: "Aprovados", value: approvedRow.value },
    { label: "Rejeitados", value: rejectedRow.value },
  ];
}

export async function getApprovalHistory(id: string): Promise<ApprovalHistoryEvent[]> {
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
        eq(eventLogs.workspaceId, context.workspaceId),
        // Ensure we only get events related to this specific approval request
        eq(eventLogs.entityType, "approval_request")
      )
    )
    .orderBy(desc(eventLogs.createdAt));

  return results as any[];
}
