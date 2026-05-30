import { eq, desc } from "drizzle-orm";
import { getPlatformDb } from "@/db";
import { blueprints, blueprintVersions } from "@/db/platform/schema/blueprints";
import type { ActionDefinition } from "@/platform/actions";
import {
  actionObjectSchema,
  stringProperty,
} from "@/platform/actions/schema-presets";

type SaveBlueprintDraftInput = {
  blueprintKey: string;
  blueprintName: string;
  definition: any;
};

export const saveBlueprintDraftKernelAction: ActionDefinition<SaveBlueprintDraftInput, { id: string; versionId: string }> = {
  key: "blueprints.save_draft",
  moduleKey: "blueprints",
  description: "Salva um rascunho da arquitetura de um blueprint.",
  callableBy: ["ui", "system"],
  inputSchema: actionObjectSchema(
    {
      blueprintKey: stringProperty("Chave única do blueprint."),
      blueprintName: stringProperty("Nome amigável do blueprint."),
      definition: { type: "object", description: "Definição completa da arquitetura (nodes, edges, etc)." },
    },
    ["blueprintKey", "blueprintName", "definition"],
  ),
  outputSchema: actionObjectSchema({
    id: stringProperty("ID do blueprint."),
    versionId: stringProperty("ID da versão salva."),
  }),
  async handler(input) {
    const db = getPlatformDb();

    // 1. Ensure blueprint exists
    let [blueprint] = await db
      .select()
      .from(blueprints)
      .where(eq(blueprints.key, input.blueprintKey))
      .limit(1);

    if (!blueprint) {
      [blueprint] = await db
        .insert(blueprints)
        .values({
          key: input.blueprintKey,
          name: input.blueprintName,
        })
        .returning();
    }

    // 2. Create new version
    const [version] = await db
      .insert(blueprintVersions)
      .values({
        blueprintId: blueprint.id,
        version: `draft-${Date.now()}`,
        definition: input.definition,
      })
      .returning();

    return {
      success: true,
      data: {
        id: blueprint.id,
        versionId: version.id,
      },
    };
  },
};

type GetLatestBlueprintInput = {
  blueprintKey: string;
};

export const getLatestBlueprintKernelAction: ActionDefinition<GetLatestBlueprintInput, any> = {
  key: "blueprints.get_latest",
  moduleKey: "blueprints",
  description: "Recupera a versão mais recente de um blueprint.",
  callableBy: ["ui", "system"],
  inputSchema: actionObjectSchema(
    {
      blueprintKey: stringProperty("Chave do blueprint."),
    },
    ["blueprintKey"],
  ),
  async handler(input) {
    const db = getPlatformDb();

    const [blueprint] = await db
      .select()
      .from(blueprints)
      .where(eq(blueprints.key, input.blueprintKey))
      .limit(1);

    if (!blueprint) {
      return { success: false, error: { code: "NOT_FOUND", message: "Blueprint não encontrado." } };
    }

    const [version] = await db
      .select()
      .from(blueprintVersions)
      .where(eq(blueprintVersions.blueprintId, blueprint.id))
      .orderBy(desc(blueprintVersions.createdAt))
      .limit(1);

    return {
      success: true,
      data: version?.definition || { nodes: [], edges: [] },
    };
  },
};
