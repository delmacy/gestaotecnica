import { getRuntimeDb } from "@/db";
import { workspaceMembers } from "@/db/runtime/schema/workspace";
import { users } from "@/db/runtime/schema/identity";
import { eq, and } from "drizzle-orm";
import type { WorkspaceContext } from "@/platform/workspace";
import { type WorkspaceMember } from "./contracts";

/**
 * Resolves a single member by ID, strictly scoped to the workspace.
 */
export async function getWorkspaceMember(
  memberId: string,
  workspaceId: string,
): Promise<WorkspaceMember | null> {
  const db = getRuntimeDb();

  const [row] = await db
    .select({
      id: workspaceMembers.id,
      workspaceId: workspaceMembers.workspaceId,
      userId: workspaceMembers.userId,
      status: workspaceMembers.status,
      joinedAt: workspaceMembers.joinedAt,
      name: users.name,
      email: users.email,
    })
    .from(workspaceMembers)
    .innerJoin(users, eq(workspaceMembers.userId, users.id))
    .where(
      and(
        eq(workspaceMembers.id, memberId),
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.status, "active")
      )
    )
    .limit(1);

  if (!row) return null;

  return {
    ...row,
    status: row.status as any,
    roles: [], // To be implemented when role assignments are ready
  };
}

/**
 * Lists active members of a workspace.
 */
export async function listWorkspaceMembers(
  workspaceId: string,
  filters?: { status?: string },
): Promise<WorkspaceMember[]> {
  const db = getRuntimeDb();

  const results = await db
    .select({
      id: workspaceMembers.id,
      workspaceId: workspaceMembers.workspaceId,
      userId: workspaceMembers.userId,
      status: workspaceMembers.status,
      joinedAt: workspaceMembers.joinedAt,
      name: users.name,
      email: users.email,
    })
    .from(workspaceMembers)
    .innerJoin(users, eq(workspaceMembers.userId, users.id))
    .where(
      and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.status, filters?.status ?? "active")
      )
    );

  return results.map((row: any) => ({
    ...row,
    status: row.status as any,
    roles: [],
  }));
}

/**
 * Asserts that a user belongs to a workspace and is active.
 */
export async function assertWorkspaceMembership(
  userId: string,
  workspaceId: string,
): Promise<void> {
  const db = getRuntimeDb();

  const [member] = await db
    .select({ id: workspaceMembers.id })
    .from(workspaceMembers)
    .where(
      and(
        eq(workspaceMembers.userId, userId),
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.status, "active")
      )
    )
    .limit(1);

  if (!member) {
    throw new Error(`User ${userId} is not an active member of workspace ${workspaceId}`);
  }
}

/**
 * Resolves the membership of the current actor from context.
 */
export async function resolveActorMembership(
  context: WorkspaceContext,
): Promise<WorkspaceMember> {
  if (context.actor.type !== "user") {
    throw new Error("Only user actors have workspace membership.");
  }

  const member = await getWorkspaceMemberByUserId(context.actor.id!, context.workspaceId);
  if (!member) {
    throw new Error(`Actor user ${context.actor.id} is not a member of workspace ${context.workspaceId}`);
  }

  return member;
}

/**
 * Lists members eligible for a role or capability (stub for now).
 */
export async function listEligibleMembers(
  _capabilityOrRole: string,
  workspaceId: string,
): Promise<WorkspaceMember[]> {
  // For now, return all active members as eligible
  return listWorkspaceMembers(workspaceId);
}

// Internal helper
async function getWorkspaceMemberByUserId(
  userId: string,
  workspaceId: string,
): Promise<WorkspaceMember | null> {
  const db = getRuntimeDb();

  const [row] = await db
    .select({
      id: workspaceMembers.id,
      workspaceId: workspaceMembers.workspaceId,
      userId: workspaceMembers.userId,
      status: workspaceMembers.status,
      joinedAt: workspaceMembers.joinedAt,
      name: users.name,
      email: users.email,
    })
    .from(workspaceMembers)
    .innerJoin(users, eq(workspaceMembers.userId, users.id))
    .where(
      and(
        eq(workspaceMembers.userId, userId),
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.status, "active")
      )
    )
    .limit(1);

  if (!row) return null;

  return {
    ...row,
    status: row.status as any,
    roles: [],
  };
}
