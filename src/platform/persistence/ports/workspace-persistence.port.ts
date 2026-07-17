export type Workspace = {
  id: string;
  name: string;
  [key: string]: unknown;
};

export interface WorkspacePersistencePort {
  save(workspace: Workspace): Promise<Workspace>;
  findById(id: string): Promise<Workspace | null>;
}
