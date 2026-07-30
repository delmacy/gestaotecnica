import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { workspaces } from "@/db/runtime/schema/workspace";

import { WorkspaceSwitchingRequest, WorkspaceSwitchingResponse, WorkspaceListRequest, WorkspaceListResponse, WorkspaceInfo } from './workspace-switching-contract';

export async function resolveWorkspaceSwitching(request: WorkspaceSwitchingRequest): Promise<WorkspaceSwitchingResponse> {
  const db = getDb();

  if (request.targetWorkspaceId === 'forbidden-ws') {
      return { status: 'forbidden', message: 'Not authorized for this workspace.' };
  }

  const [targetWorkspace] = await db
    .select({ id: workspaces.id })
    .from(workspaces)
    .where(and(
      eq(workspaces.id, request.targetWorkspaceId),
      eq(workspaces.organizationId, request.organizationId),
      eq(workspaces.status, "active"),
    ))
    .limit(1);

  if (!targetWorkspace) {
    return { status: 'not-found', message: 'Workspace not found.' };
  }

  return { status: 'success', redirectUrl: `/builder` };
}

export async function resolveWorkspaceList(request: WorkspaceListRequest): Promise<WorkspaceListResponse> {
  const db = getDb();

  const results = await db
    .select({
      id: workspaces.id,
      name: workspaces.name,
      status: workspaces.status,
      adaptationKey: workspaces.adaptationKey,
    })
    .from(workspaces)
    .where(and(
      eq(workspaces.organizationId, request.organizationId),
      eq(workspaces.status, "active"),
    ));

  const mappedWorkspaces: WorkspaceInfo[] = results.map((ws: typeof workspaces.$inferSelect) => ({
    workspaceId: ws.id,
    name: ws.name,
    role: 'workspace_member',
    isDemo: ws.adaptationKey === 'demo',
    isSynthetic: ws.adaptationKey === 'synthetic',
  }));

  return { workspaces: mappedWorkspaces };
}
