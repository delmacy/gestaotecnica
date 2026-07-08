import { processDefinitions, processVersions } from "@/db/runtime/schema/workflow";
import { eq, desc, and } from "drizzle-orm";
import type { ProcessDefinitionDb } from "./process-definition.repository";

export async function listProcessDefinitions(
  db: ProcessDefinitionDb,
  input: {
    workspaceId: string;
    status?: "draft" | "published" | "archived";
    limit?: number;
    offset?: number;
  }
) {
  const limit = input.limit ? Math.min(input.limit, 100) : 50;
  const offset = input.offset || 0;

  const whereClause = input.status
    ? and(
        eq(processDefinitions.workspaceId, input.workspaceId),
        eq(processDefinitions.isActive, input.status)
      )
    : eq(processDefinitions.workspaceId, input.workspaceId);

  const results = await db
    .select({
      id: processDefinitions.id,
      workspaceId: processDefinitions.workspaceId,
      key: processDefinitions.key,
      name: processDefinitions.name,
      description: processDefinitions.description,
      status: processDefinitions.isActive,
      createdAt: processDefinitions.createdAt,
      updatedAt: processDefinitions.updatedAt,
    })
    .from(processDefinitions)
    .where(whereClause)
    .orderBy(desc(processDefinitions.updatedAt))
    .limit(limit)
    .offset(offset);

  return results.map((def: any) => ({
    id: def.id,
    workspaceId: def.workspaceId,
    key: def.key,
    name: def.name,
    description: def.description,
    status: def.status,
    createdAt: def.createdAt ? def.createdAt.toISOString() : undefined,
    updatedAt: def.updatedAt ? def.updatedAt.toISOString() : undefined,
  }));
}

export async function getProcessDefinitionById(
  db: ProcessDefinitionDb,
  workspaceId: string,
  processDefinitionId: string
) {
  const definitions = await db
    .select({
      id: processDefinitions.id,
      workspaceId: processDefinitions.workspaceId,
      key: processDefinitions.key,
      name: processDefinitions.name,
      description: processDefinitions.description,
      status: processDefinitions.isActive,
      createdAt: processDefinitions.createdAt,
      updatedAt: processDefinitions.updatedAt,
    })
    .from(processDefinitions)
    .where(and(
      eq(processDefinitions.id, processDefinitionId),
      eq(processDefinitions.workspaceId, workspaceId)
    ))
    .limit(1);

  if (definitions.length === 0) {
    return null;
  }

  const definition = definitions[0];

  const versions = await db
    .select({
      id: processVersions.id,
      processDefinitionId: processVersions.processDefinitionId,
      version: processVersions.version,
      status: processVersions.status,
      definition: processVersions.definition,

      createdAt: processVersions.createdAt,
    })
    .from(processVersions)
    .where(eq(processVersions.processDefinitionId, processDefinitionId))
    .orderBy(desc(processVersions.version))
    .limit(1);

  let latestVersion = undefined;
  if (versions.length > 0) {
    const v = versions[0];
    latestVersion = {
      id: v.id,
      processDefinitionId: v.processDefinitionId,
      version: v.version,
      status: v.status,
      definition: v.definition,
      createdBy: v.createdBy,
      createdAt: v.createdAt ? v.createdAt.toISOString() : undefined,
    };
  }

  return {
    processDefinition: {
      id: definition.id,
      workspaceId: definition.workspaceId,
      key: definition.key,
      name: definition.name,
      description: definition.description,
      status: definition.status,
      createdAt: definition.createdAt ? definition.createdAt.toISOString() : undefined,
      updatedAt: definition.updatedAt ? definition.updatedAt.toISOString() : undefined,
    },
    latestVersion,
  };
}

// Helper function added for Phase 18C path-finding
export type ProcessVersionQueryDb = Pick<ProcessDefinitionDb, 'select'>;

export async function getProcessVersionById(
  db: ProcessVersionQueryDb,
  processVersionId: string
) {
  const versions = await db
    .select({
      id: processVersions.id,
      processDefinitionId: processVersions.processDefinitionId,
      version: processVersions.version,
      status: processVersions.status,
      definition: processVersions.definition,

      createdAt: processVersions.createdAt,
    })
    .from(processVersions)
    .where(eq(processVersions.id, processVersionId))
    .limit(1);

  if (versions.length === 0) {
    return null;
  }

  const v = versions[0];
  return {
    id: v.id,
    processDefinitionId: v.processDefinitionId,
    version: v.version,
    status: v.status,
    definition: v.definition,
    createdBy: v.createdBy,
    createdAt: v.createdAt ? v.createdAt.toISOString() : undefined,
  };
}
