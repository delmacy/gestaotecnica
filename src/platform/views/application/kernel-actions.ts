import { eq } from "drizzle-orm";
import { getRuntimeDb } from "@/db";
import { workflowSchema } from "@/db/runtime/schema/workflow"; // Views usually in workflow or view schema
import type { ActionDefinition } from "@/platform/actions";
import {
  actionObjectSchema,
  stringProperty,
  uuidProperty,
} from "@/platform/actions/schema-presets";

// For now, let's use the forms table as a proxy for UI definitions if a dedicated views table doesn't exist
import { forms } from "@/db/runtime/schema/workflow";

type SaveViewDefinitionInput = {
  workspaceId: string;
  key: string;
  name: string;
  config: any;
};

export const saveViewDefinitionKernelAction: ActionDefinition<SaveViewDefinitionInput, any> = {
  key: "views.save_definition",
  moduleKey: "view",
  description: "Salva a definição de uma view de interface.",
  callableBy: ["ui", "system"],
  inputSchema: actionObjectSchema(
    {
      workspaceId: uuidProperty("Workspace dono."),
      key: stringProperty("Chave da view."),
      name: stringProperty("Nome da view."),
      config: { type: "object", description: "Configuração do layout." },
    },
    ["workspaceId", "key", "name", "config"],
  ),
  async handler(input) {
    const db = getRuntimeDb();

    // Use forms table as proxy for now, storing config in description or a new column if we had one
    // Let's use name to also store a bit of metadata if needed or just trust key is enough for lookup
    const [saved] = await db
      .insert(forms)
      .values({
        workspaceId: input.workspaceId,
        key: input.key,
        name: input.name,
        description: JSON.stringify(input.config),
      })
      .onConflictDoUpdate({
        target: [forms.workspaceId, forms.key],
        set: {
          name: input.name,
          description: JSON.stringify(input.config),
          updatedAt: new Date(),
        },
      })
      .returning();

    return {
      success: true,
      data: saved,
    };
  },
};

export const getViewDefinitionKernelAction: ActionDefinition<{ key: string }, any> = {
  key: "views.get_definition",
  moduleKey: "view",
  description: "Recupera a definição de uma view.",
  callableBy: ["ui", "system"],
  inputSchema: actionObjectSchema({ key: stringProperty("Chave da view") }, ["key"]),
  async handler(input) {
    const db = getRuntimeDb();
    const [view] = await db
      .select()
      .from(forms)
      .where(eq(forms.key, input.key))
      .limit(1);

    if (!view) return { success: true, data: null };

    return {
      success: true,
      data: {
        ...view,
        config: view.description ? JSON.parse(view.description) : {},
      },
    };
  },
};
