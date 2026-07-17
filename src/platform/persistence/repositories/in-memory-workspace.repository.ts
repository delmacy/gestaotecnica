import type { Workspace, WorkspacePersistencePort } from "../ports/workspace-persistence.port";

export class InMemoryWorkspaceRepository implements WorkspacePersistencePort {
  private readonly store = new Map<string, Workspace>();

  async save(workspace: Workspace): Promise<Workspace> {
    this.store.set(workspace.id, workspace);
    return workspace;
  }

  async findById(id: string): Promise<Workspace | null> {
    return this.store.get(id) || null;
  }
}
