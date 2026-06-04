import { processDefinitions, processVersions } from "@/db/platform/schema/workflow";
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

  let whereClause = eq(processDefinitions.workspaceId, input.workspaceId);

  if (input.status) {
    whereClause = and(whereClause, eq(processDefinitions.status, input.status)) as any;
  }

  return db
    .select({
      id: processDefinitions.id,
      workspaceId: processDefinitions.workspaceId,
      key: processDefinitions.key,
      name: processDefinitions.name,
      description: processDefinitions.description,
      status: processDefinitions.status,
      createdAt: processDefinitions.createdAt,
      updatedAt: processDefinitions.updatedAt,
    })
    .from(processDefinitions)
    .where(whereClause)
    .orderBy(desc(processDefinitions.updatedAt))
    .limit(limit)
    .offset(offset);
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
      status: processDefinitions.status,
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
      definitionJson: processVersions.definitionJson,
      createdBy: processVersions.createdBy,
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
      ...v,
      definition: v.definitionJson, // Map definitionJson to definition
    };
  }

  return {
    processDefinition: definition,
    latestVersion,
  };
}
