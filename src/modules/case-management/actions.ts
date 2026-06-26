import { eq, and } from "drizzle-orm";
import { getDb } from "@/db";
import { processCandidates } from "@/db/platform/schema/candidates";
import { events as eventLogs } from "@/db/runtime/schema/workflow";
import { resolveWorkspaceContext } from "@/platform/workspace";
import {
  CreateCaseInputSchema,
  UpdateCaseInputSchema,
  ChangeCaseStatusInputSchema,
  AddCaseCommentInputSchema
} from "./contracts/case.schema";

export async function createCase(input: unknown) {
  const data = CreateCaseInputSchema.parse(input);
  const context = await resolveWorkspaceContext({ source: "ui" });
  const db = getDb();

  if (data.workspaceId !== context.workspaceId) {
    throw new Error("Unauthorized workspace access");
  }

  const [inserted] = await db
    .insert(processCandidates)
    .values({
      workspaceId: data.workspaceId,
      name: data.title,
      description: data.description,
      status: "open",
      origin: "case-management",
      proposedDefinition: {
        origin: data.origin,
        category: data.category,
        priority: data.priority,
        assignedToId: data.assignedToId,
        assignedToName: data.assignedToName,
        metadata: data.metadata,
      },
    })
    .returning();

  await db.insert(eventLogs).values({
    workspaceId: data.workspaceId,
    entityId: inserted.id,
    entityType: "case",
    eventType: "case_management.created",
    payload: {
      caseId: inserted.id,
      title: data.title,
      status: "open",
    },
  });

  return inserted;
}

export async function updateCase(input: unknown) {
  const data = UpdateCaseInputSchema.parse(input);
  const context = await resolveWorkspaceContext({ source: "ui" });
  const db = getDb();

  const [existing] = await db
    .select()
    .from(processCandidates)
    .where(
      and(
        eq(processCandidates.id, data.id),
        eq(processCandidates.workspaceId, context.workspaceId)
      )
    )
    .limit(1);

  if (!existing) throw new Error("Case not found");

  const currentProposed = (existing.proposedDefinition as Record<string, any>) || {};
  const updatedProposed = {
    ...currentProposed,
    category: data.category ?? currentProposed.category,
    priority: data.priority ?? currentProposed.priority,
    assignedToId: data.assignedToId ?? currentProposed.assignedToId,
    assignedToName: data.assignedToName ?? currentProposed.assignedToName,
    metadata: data.metadata ? { ...currentProposed.metadata, ...data.metadata } : currentProposed.metadata,
  };

  const [updated] = await db
    .update(processCandidates)
    .set({
      name: data.title ?? existing.name,
      description: data.description ?? existing.description,
      proposedDefinition: updatedProposed,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(processCandidates.id, data.id),
        eq(processCandidates.workspaceId, context.workspaceId),
        eq(processCandidates.origin, "case-management")
      )
    )
    .returning();

  await db.insert(eventLogs).values({
    workspaceId: context.workspaceId,
    entityId: data.id,
    entityType: "case",
    eventType: "case_management.updated",
    payload: {
      updatedFields: data,
    },
  });

  return updated;
}

export async function changeCaseStatus(input: unknown) {
  const data = ChangeCaseStatusInputSchema.parse(input);
  const context = await resolveWorkspaceContext({ source: "ui" });
  const db = getDb();

  const [updated] = await db
    .update(processCandidates)
    .set({
      status: data.status,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(processCandidates.id, data.id),
        eq(processCandidates.workspaceId, context.workspaceId),
        eq(processCandidates.origin, "case-management")
      )
    )
    .returning();

  if (!updated) throw new Error("Case not found");

  await db.insert(eventLogs).values({
    workspaceId: context.workspaceId,
    entityId: data.id,
    entityType: "case",
    eventType: "case_management.status_changed",
    payload: {
      newStatus: data.status,
      reason: data.reason,
    },
  });

  return updated;
}

export async function addCaseComment(input: unknown) {
  const data = AddCaseCommentInputSchema.parse(input);
  const context = await resolveWorkspaceContext({ source: "ui" });
  const db = getDb();

  // Verify that the case exists and belongs to the workspace
  const [existing] = await db
    .select()
    .from(processCandidates)
    .where(
      and(
        eq(processCandidates.id, data.caseId),
        eq(processCandidates.workspaceId, context.workspaceId)
      )
    )
    .limit(1);

  if (!existing) throw new Error("Case not found or unauthorized");

  // In a real scenario, authorId and authorName would come from the session context
  const authorId = (context as any).userId || "00000000-0000-0000-0000-000000000000";
  const authorName = (context as any).userName || "System User";

  const commentId = globalThis.crypto.randomUUID();

  await db.insert(eventLogs).values({
    workspaceId: context.workspaceId,
    entityId: data.caseId,
    entityType: "case",
    eventType: "case_management.comment_added",
    payload: {
      commentId,
      authorId,
      authorName,
      content: data.content,
    },
  });

  return { id: commentId };
}
