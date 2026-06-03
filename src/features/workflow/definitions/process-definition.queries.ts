import { eq, desc, and } from "drizzle-orm";
import { processDefinitions, processVersions } from "@/db/platform/schema/workflow";
import type { ProcessDefinitionDb } from "./process-definition.repository";
import type { ProcessDefinitionRecord, ProcessVersionRecord, ProcessDefinitionStatus, ProcessVersionStatus } from "./process-definition.types";
import type { SerializedBuilderDraft } from "@/features/builder/types";

// Internal normalization helpers mapped to read queries
function normalizeProcessDef(row: any): ProcessDefinitionRecord {
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    key: row.key,
    name: row.name,
    description: row.description,
    status: row.status as ProcessDefinitionStatus,
    createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : undefined,
    updatedAt: row.updatedAt ? new Date(row.updatedAt).toISOString() : undefined,
  };
}

function normalizeProcessVer(row: any): ProcessVersionRecord {
  return {
    id: row.id,
    processDefinitionId: row.processDefinitionId,
    version: row.version,
    status: row.status as ProcessVersionStatus,
    definition: row.definitionJson as SerializedBuilderDraft,
    createdBy: row.createdBy,
    createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : undefined,
  };
}

export async function listProcessDefinitions(
  db: ProcessDefinitionDb,
  input: {
    workspaceId: string;
    status?: ProcessDefinitionStatus;
    limit?: number;
    offset?: number;
  },
): Promise<ProcessDefinitionRecord[]> {
  const safeLimit = Math.min(input.limit ?? 50, 100);
  const safeOffset = input.offset ?? 0;

  const conditions = [eq(processDefinitions.workspaceId, input.workspaceId)];
  if (input.status) {
    conditions.push(eq(processDefinitions.status, input.status));
  }

  const results = await db
    .select()
    .from(processDefinitions)
    .where(and(...conditions))
    .orderBy(desc(processDefinitions.updatedAt))
    .limit(safeLimit)
    .offset(safeOffset);

  return results.map(normalizeProcessDef);
}

export async function getProcessDefinitionById(
  db: ProcessDefinitionDb,
  id: string,
): Promise<ProcessDefinitionRecord | undefined> {
  const results = await db
    .select()
    .from(processDefinitions)
    .where(eq(processDefinitions.id, id))
    .limit(1);

  if (results.length === 0) return undefined;
  return normalizeProcessDef(results[0]);
}

export async function getProcessVersions(
  db: ProcessDefinitionDb,
  processDefinitionId: string,
): Promise<ProcessVersionRecord[]> {
  const results = await db
    .select()
    .from(processVersions)
    .where(eq(processVersions.processDefinitionId, processDefinitionId))
    .orderBy(desc(processVersions.version));

  return results.map(normalizeProcessVer);
}

export async function getLatestProcessVersion(
  db: ProcessDefinitionDb,
  processDefinitionId: string,
): Promise<ProcessVersionRecord | undefined> {
  const results = await db
    .select()
    .from(processVersions)
    .where(eq(processVersions.processDefinitionId, processDefinitionId))
    .orderBy(desc(processVersions.version))
    .limit(1);

  if (results.length === 0) return undefined;
  return normalizeProcessVer(results[0]);
}

export async function getProcessDefinitionWithLatestVersion(
  db: ProcessDefinitionDb,
  id: string,
): Promise<{
  processDefinition: ProcessDefinitionRecord;
  latestVersion?: ProcessVersionRecord;
} | undefined> {
  const def = await getProcessDefinitionById(db, id);
  if (!def) return undefined;

  const latest = await getLatestProcessVersion(db, id);

  return {
    processDefinition: def,
    latestVersion: latest,
  };
}
