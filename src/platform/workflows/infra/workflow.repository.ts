import { getRuntimeDb } from "@/db";
import { processDefinitions, processVersions } from "@/db/runtime/schema/workflow";
import { eq, and } from "drizzle-orm";
import { ProcessDefinition, ProcessVersion, ProcessDefinitionStatus, ProcessVersionStatus } from "../contracts/process-definition";
import { WorkflowPersistencePort } from "../persistence/ports/workflow-persistence.port";

export class WorkflowRepository implements WorkflowPersistencePort {
  async getDefinitionById(workspaceId: string, id: string): Promise<ProcessDefinition | null> {
    const db = getRuntimeDb();
    const result = await db
      .select()
      .from(processDefinitions)
      .where(and(eq(processDefinitions.workspaceId, workspaceId), eq(processDefinitions.id, id)))
      .limit(1);

    if (result.length === 0) return null;

    const row = result[0];
    return {
      id: row.id,
      workspaceId: row.workspaceId,
      key: row.key,
      name: row.name,
      status: "draft" as ProcessDefinitionStatus, // processDefinitions schema does not have a status column in runtime, default to draft
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      createdById: row.createdById || "00000000-0000-0000-0000-000000000000",
      description: row.description || undefined,
      blueprintKey: row.blueprintKey || undefined,
      blueprintVersion: row.blueprintVersion ? parseInt(row.blueprintVersion, 10) : undefined,
    };
  }

  async saveDefinition(workspaceId: string, definition: ProcessDefinition): Promise<void> {
    const db = getRuntimeDb();

    const existing = await this.getDefinitionById(workspaceId, definition.id);
    if (existing) {
      await db.update(processDefinitions)
        .set({
          key: definition.key,
          name: definition.name,
          description: definition.description,
          updatedAt: new Date(definition.updatedAt),
          blueprintKey: definition.blueprintKey,
          blueprintVersion: definition.blueprintVersion?.toString(),
        })
        .where(and(eq(processDefinitions.workspaceId, workspaceId), eq(processDefinitions.id, definition.id)));
    } else {
      await db.insert(processDefinitions).values({
        id: definition.id,
        workspaceId: workspaceId,
        key: definition.key,
        name: definition.name,
        description: definition.description,
        createdAt: new Date(definition.createdAt),
        updatedAt: new Date(definition.updatedAt),
        blueprintKey: definition.blueprintKey,
        blueprintVersion: definition.blueprintVersion?.toString(),
        createdById: definition.createdById,
        isActive: "true",
      });
    }
  }

  async listDefinitions(workspaceId: string): Promise<ProcessDefinition[]> {
    const db = getRuntimeDb();
    const results = await db
      .select()
      .from(processDefinitions)
      .where(eq(processDefinitions.workspaceId, workspaceId));

    return results.map((row: typeof processDefinitions.$inferSelect) => ({
      id: row.id,
      workspaceId: row.workspaceId,
      key: row.key,
      name: row.name,
      status: "draft" as ProcessDefinitionStatus,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      createdById: row.createdById || "00000000-0000-0000-0000-000000000000",
      description: row.description || undefined,
      blueprintKey: row.blueprintKey || undefined,
      blueprintVersion: row.blueprintVersion ? parseInt(row.blueprintVersion, 10) : undefined,
    }));
  }

  async saveVersion(workspaceId: string, version: ProcessVersion): Promise<void> {
    const db = getRuntimeDb();

    // Verify definition belongs to workspace
    const definition = await this.getDefinitionById(workspaceId, version.processDefinitionId);
    if (!definition) {
      throw new Error("Process definition not found in workspace");
    }

    const existing = await this.getVersionById(workspaceId, version.processDefinitionId, version.version);
    if (existing) {
      await db.update(processVersions)
        .set({
          definition: version.definition as unknown as string, // Temporary cast, usually definition is JSON in Drizzle
          status: version.status,
          updatedAt: new Date(version.updatedAt),
        })
        .where(and(
          eq(processVersions.processDefinitionId, version.processDefinitionId),
          eq(processVersions.version, version.version)
        ));
    } else {
      await db.insert(processVersions).values({
        id: version.id,
        processDefinitionId: version.processDefinitionId,
        version: version.version,
        definition: version.definition as unknown as string,
        status: version.status,
        createdAt: new Date(version.createdAt),
        updatedAt: new Date(version.updatedAt),
      });
    }
  }

  async getVersionById(workspaceId: string, definitionId: string, version: number): Promise<ProcessVersion | null> {
    const db = getRuntimeDb();

    // First ensure definition is in workspace
    const definition = await this.getDefinitionById(workspaceId, definitionId);
    if (!definition) return null;

    const result = await db
      .select()
      .from(processVersions)
      .where(and(
        eq(processVersions.processDefinitionId, definitionId),
        eq(processVersions.version, version)
      ))
      .limit(1);

    if (result.length === 0) return null;

    const row = result[0];
    return {
      id: row.id,
      workspaceId: workspaceId,
      processDefinitionId: row.processDefinitionId,
      version: row.version,
      status: row.status as ProcessVersionStatus,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      createdById: "00000000-0000-0000-0000-000000000000",
      definition: row.definition as unknown as ProcessVersion["definition"],
    };
  }

  async listVersions(workspaceId: string, definitionId: string): Promise<ProcessVersion[]> {
    const db = getRuntimeDb();

    const definition = await this.getDefinitionById(workspaceId, definitionId);
    if (!definition) return [];

    const results = await db
      .select()
      .from(processVersions)
      .where(eq(processVersions.processDefinitionId, definitionId));

    return results.map((row: typeof processVersions.$inferSelect) => ({
      id: row.id,
      workspaceId: workspaceId,
      processDefinitionId: row.processDefinitionId,
      version: row.version,
      status: row.status as ProcessVersionStatus,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      createdById: "00000000-0000-0000-0000-000000000000",
      definition: row.definition as unknown as ProcessVersion["definition"],
    }));
  }
}
