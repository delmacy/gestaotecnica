import { WorkspaceSwitchingRequest, WorkspaceSwitchingResponse, WorkspaceListRequest, WorkspaceListResponse, WorkspaceInfo } from './workspace-switching-contract';

export function resolveWorkspaceSwitching(request: WorkspaceSwitchingRequest): WorkspaceSwitchingResponse {
  // This is a contract resolution. Implementation will be added in backend tasks.
  if (request.targetWorkspaceId === 'forbidden-ws') {
      return { status: 'forbidden', message: 'Not authorized for this workspace.' };
  }
  return { status: 'success', redirectUrl: `/builder` };
}

export function resolveWorkspaceList(request: WorkspaceListRequest): WorkspaceListResponse {
    // Contract implementation stub
    const dummyWorkspaces: WorkspaceInfo[] = [
        { workspaceId: 'ws-1', name: 'Primary Operations', role: 'workspace_admin', isDemo: false, isSynthetic: false },
        { workspaceId: 'ws-2', name: 'Beta Features', role: 'workspace_member', isDemo: false, isSynthetic: true },
    ];
    return { workspaces: dummyWorkspaces };
}
