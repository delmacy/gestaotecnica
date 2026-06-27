import { getRuntimeDb } from "@/db";
import { processCandidates } from "@/db/platform/schema/candidates";
import { eq, and, asc, sql } from "drizzle-orm";
import { type ApprovalRequest, type ApprovalStep } from "./contracts";

const REQUEST_ORIGIN = "approval-request";
const STEP_ORIGIN = "approval-step";

export async function getApprovalRequest(id: string, workspaceId: string): Promise<ApprovalRequest | null> {
  const db = getRuntimeDb();

  const [row] = await db
    .select()
    .from(processCandidates)
    .where(
      and(
        eq(processCandidates.id, id),
        eq(processCandidates.workspaceId, workspaceId),
        eq(processCandidates.origin, REQUEST_ORIGIN)
      )
    )
    .limit(1);

  if (!row) return null;

  const def = (row as any).proposedDefinition as any;

  return {
    id: row.id,
    workspaceId: row.workspaceId,
    title: row.name,
    description: row.description ?? undefined,
    subjectType: def.subjectType,
    subjectId: def.subjectId,
    status: row.status as any,
    currentStep: def.currentStep,
    requestedBy: row.createdById!,
    metadata: def.metadata ?? {},
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function listApprovalRequests(workspaceId: string): Promise<ApprovalRequest[]> {
  const db = getRuntimeDb();

  const results = await db
    .select()
    .from(processCandidates)
    .where(
      and(
        eq(processCandidates.workspaceId, workspaceId),
        eq(processCandidates.origin, REQUEST_ORIGIN)
      )
    );

  return results.map((row: any) => {
    const def = row.proposedDefinition as any;
    return {
      id: row.id,
      workspaceId: row.workspaceId,
      title: row.name,
      description: row.description ?? undefined,
      subjectType: def.subjectType,
      subjectId: def.subjectId,
      status: row.status as any,
      currentStep: def.currentStep,
      requestedBy: row.createdById!,
      metadata: def.metadata ?? {},
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  });
}

export async function getApprovalSteps(requestId: string, workspaceId: string): Promise<ApprovalStep[]> {
  const db = getRuntimeDb();

  const results = await db
    .select()
    .from(processCandidates)
    .where(
      and(
        eq(processCandidates.workspaceId, workspaceId),
        eq(processCandidates.origin, STEP_ORIGIN),
        sql`${processCandidates.proposedDefinition}->>'requestId' = ${requestId}`
      )
    )
    .orderBy(asc(sql`(${processCandidates.proposedDefinition}->>'order')::integer`));

  return results.map((row: any) => {
    const def = row.proposedDefinition as any;
    return {
      id: row.id,
      requestId: def.requestId,
      order: def.order,
      approverType: def.approverType,
      approverId: def.approverId,
      status: row.status as any,
      decision: def.decision,
      decidedBy: def.decidedBy,
      decidedAt: def.decidedAt ? new Date(def.decidedAt) : undefined,
      reason: def.reason,
      metadata: def.metadata ?? {},
    };
  });
}
