import { processDefinitions, processVersions } from "@/db/platform/schema/workflow";
import { eq, desc } from "drizzle-orm";
import type { ProcessDefinitionDb } from "./process-definition.repository";

export async function listProcessDefinitions(
  db: ProcessDefinitionDb,
  workspaceId: string
) {
  return db
    .select({
      id: processDefinitions.id,
      key: processDefinitions.key,
      name: processDefinitions.name,
      status: processDefinitions.status,
      updatedAt: processDefinitions.updatedAt,
    })
    .from(processDefinitions)
    .where(eq(processDefinitions.workspaceId, workspaceId))
    .orderBy(desc(processDefinitions.updatedAt));
}

export async function getProcessDefinitionById(
  db: ProcessDefinitionDb,
  workspaceId: string,
  processDefinitionId: string
) {
  const definitions = await db
    .select({
      id: processDefinitions.id,
      key: processDefinitions.key,
      name: processDefinitions.name,
      status: processDefinitions.status,
    })
    .from(processDefinitions)
    .where(eq(processDefinitions.id, processDefinitionId))
    .limit(1);

  if (definitions.length === 0) {
    return null;
  }

  const definition = definitions[0];

  const versions = await db
    .select({
      version: processVersions.version,
      definitionJson: processVersions.definitionJson,
    })
    .from(processVersions)
    .where(eq(processVersions.processDefinitionId, processDefinitionId))
    .orderBy(desc(processVersions.version))
    .limit(1);

  return {
    ...definition,
    latestVersion: versions.length > 0 ? versions[0].version : undefined,
    definitionJson: versions.length > 0 ? versions[0].definitionJson : undefined,
  };
}
