import { resolveBuilderPortfolio, persistWorkspaceSelection } from "@/lib/builder-persistence";

import { WorkspaceSwitchingRequest, WorkspaceSwitchingResponse, WorkspaceListRequest, WorkspaceListResponse, WorkspaceInfo } from './workspace-switching-contract';

export async function resolveWorkspaceSwitching(request: WorkspaceSwitchingRequest): Promise<WorkspaceSwitchingResponse> {
  const result = await persistWorkspaceSelection(request.userId, request.targetWorkspaceId);

  if (!result.ok) {
    if (result.reason === "workspace_not_found") {
      return { status: 'not-found', message: 'Workspace not found.' };
    }
    if (result.reason === "not_a_member") {
      return { status: 'forbidden', message: 'Not authorized for this workspace.' };
    }
  }

  return { status: 'success', redirectUrl: `/builder` };
}

export async function resolveWorkspaceList(request: WorkspaceListRequest): Promise<WorkspaceListResponse> {
  const portfolio = await resolveBuilderPortfolio(request.userId);

  if (!portfolio) {
    return { workspaces: [] };
  }

  const mappedWorkspaces: WorkspaceInfo[] = portfolio.organizations.flatMap(org =>
    org.workspaces.map(ws => ({
      workspaceId: ws.id,
      name: ws.name,
      role: ws.role,
      isDemo: ws.adaptationKey === 'demo',
      isSynthetic: ws.adaptationKey === 'synthetic',
    }))
  );

  return { workspaces: mappedWorkspaces };
}
