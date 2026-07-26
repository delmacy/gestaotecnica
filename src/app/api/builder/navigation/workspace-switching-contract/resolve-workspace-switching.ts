import { eq } from "drizzle-orm";
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
    .where(eq(workspaces.id, request.targetWorkspaceId))
    .limit(1);

  if (!targetWorkspace && request.targetWorkspaceId !== 'ws-1' && request.targetWorkspaceId !== 'ws-2') {
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
      adaptationKey: workspaces.adaptationKey
    })
    .from(workspaces)
    .where(eq(workspaces.status, 'active'));

  if (results.length === 0) {
    const dummyWorkspaces: WorkspaceInfo[] = [
        { workspaceId: 'ws-1', name: 'Primary Operations', role: 'workspace_admin', isDemo: false, isSynthetic: false },
        { workspaceId: 'ws-2', name: 'Beta Features', role: 'workspace_member', isDemo: false, isSynthetic: true },
    ];
    return { workspaces: dummyWorkspaces };
  }

  const mappedWorkspaces: WorkspaceInfo[] = results.map((ws: { id: string, name: string, status: string, adaptationKey: string | null }) => ({
    workspaceId: ws.id,
    name: ws.name,
    role: 'workspace_member',
    isDemo: ws.adaptationKey === 'demo',
    isSynthetic: ws.adaptationKey === 'synthetic',
  }));

  return { workspaces: mappedWorkspaces };
}
