import { eq, desc } from "drizzle-orm";
import { processDefinitions, processVersions } from "@/db/platform/schema/workflow";

// Avoid tight coupling to a specific Drizzle schema instance shape here if possible,
// using a minimal structural interface for the `db` parameter.
export type ProcessDefinitionDb = {
  insert: any;
  select: any;
};

export async function insertProcessDefinition(
  db: ProcessDefinitionDb,
  input: {
    workspaceId: string;
    key: string;
    name: string;
    description?: string | null;
    status?: "draft" | "published" | "archived";
  }
) {
  const [record] = await db
    .insert(processDefinitions)
    .values({
      workspaceId: input.workspaceId,
      key: input.key,
      name: input.name,
      description: input.description ?? null,
      status: input.status ?? "draft",
    })
    .returning();

  return record;
}

export async function insertProcessVersion(
  db: ProcessDefinitionDb,
  input: {
    processDefinitionId: string;
    version: number;
    status?: "draft" | "published" | "archived";
    definitionJson: unknown;
    createdBy?: string | null;
  }
) {
  const [record] = await db
    .insert(processVersions)
    .values({
      processDefinitionId: input.processDefinitionId,
      version: input.version,
      status: input.status ?? "draft",
      definitionJson: input.definitionJson,
      createdBy: input.createdBy ?? null,
    })
    .returning();

  return record;
}

export async function getLatestProcessVersionNumber(
  db: ProcessDefinitionDb,
  processDefinitionId: string
): Promise<number> {
  const result = await db
    .select({ version: processVersions.version })
    .from(processVersions)
    .where(eq(processVersions.processDefinitionId, processDefinitionId))
    .orderBy(desc(processVersions.version))
    .limit(1);

  if (result.length === 0) {
    return 0;
  }

  return result[0].version;
}
