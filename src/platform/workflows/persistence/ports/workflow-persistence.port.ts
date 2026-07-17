import { ProcessDefinition, ProcessVersion } from "../../contracts/process-definition";

export interface WorkflowPersistencePort {
  saveDefinition(workspaceId: string, definition: ProcessDefinition): Promise<void>;
  getDefinitionById(workspaceId: string, id: string): Promise<ProcessDefinition | null>;
  listDefinitions(workspaceId: string): Promise<ProcessDefinition[]>;
  saveVersion(workspaceId: string, version: ProcessVersion): Promise<void>;
  getVersionById(workspaceId: string, definitionId: string, version: number): Promise<ProcessVersion | null>;
  listVersions(workspaceId: string, definitionId: string): Promise<ProcessVersion[]>;
}
