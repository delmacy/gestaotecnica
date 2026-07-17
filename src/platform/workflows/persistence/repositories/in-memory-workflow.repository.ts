import { WorkflowPersistencePort } from "../ports/workflow-persistence.port";
import { ProcessDefinition, ProcessVersion } from "../../contracts/process-definition";

export class InMemoryWorkflowRepository implements WorkflowPersistencePort {
  private definitions: Map<string, ProcessDefinition> = new Map();
  private versions: Map<string, ProcessVersion> = new Map();

  async saveDefinition(workspaceId: string, definition: ProcessDefinition): Promise<void> {
    const key = `${workspaceId}:${definition.id}`;
    this.definitions.set(key, { ...definition, workspaceId });
  }

  async getDefinitionById(workspaceId: string, id: string): Promise<ProcessDefinition | null> {
    const key = `${workspaceId}:${id}`;
    return this.definitions.get(key) || null;
  }

  async listDefinitions(workspaceId: string): Promise<ProcessDefinition[]> {
    return Array.from(this.definitions.values()).filter(d => d.workspaceId === workspaceId);
  }

  async saveVersion(workspaceId: string, version: ProcessVersion): Promise<void> {
    const key = `${workspaceId}:${version.processDefinitionId}:${version.version}`;
    this.versions.set(key, { ...version, workspaceId });
  }

  async getVersionById(workspaceId: string, definitionId: string, version: number): Promise<ProcessVersion | null> {
    const key = `${workspaceId}:${definitionId}:${version}`;
    return this.versions.get(key) || null;
  }

  async listVersions(workspaceId: string, definitionId: string): Promise<ProcessVersion[]> {
    return Array.from(this.versions.values()).filter(v => v.workspaceId === workspaceId && v.processDefinitionId === definitionId);
  }
}
