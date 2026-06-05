import { eq, desc, and } from "drizzle-orm";
import { processDefinitions, processVersions } from "@/db/platform/schema/workflow";

// Avoid tight coupling to a specific Drizzle schema instance shape here if possible,
// using a minimal structural interface for the `db` parameter.
export type ProcessDefinitionDb = {
  insert: any;
  select: any;
  update: any;
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

export async function publishProcessVersionRecord(
  db: ProcessDefinitionDb,
  input: {
    processDefinitionId: string;
    processVersionId: string;
  }
) {
  // Using an array of conditions via the 'and' equivalent approach or eq directly in update
  // Since update where only takes one arg easily, we use eq id, but ensure it's the right process.
  // We'll rely on the service to have validated the processVersionId belongs to the processDefinitionId
  const [record] = await db
    .update(processVersions)
    .set({
      status: "published",
    })
    .where(and(
      eq(processVersions.id, input.processVersionId),
      eq(processVersions.processDefinitionId, input.processDefinitionId)
    ))
    .returning();

  return record;
}

export async function markProcessDefinitionAsPublished(
  db: ProcessDefinitionDb,
  input: {
    processDefinitionId: string;
  }
) {
  const [record] = await db
    .update(processDefinitions)
    .set({
      status: "published",
      updatedAt: new Date(),
    })
    .where(eq(processDefinitions.id, input.processDefinitionId))
    .returning();

  return record;
}
