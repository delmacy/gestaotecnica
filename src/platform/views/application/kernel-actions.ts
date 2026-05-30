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

    const [saved] = await db
      .insert(forms)
      .values({
        workspaceId: input.workspaceId,
        key: input.key,
        name: input.name,
      })
      .onConflictDoUpdate({
        target: [forms.workspaceId, forms.key],
        set: { name: input.name, updatedAt: new Date() }
      })
      .returning();

    return {
      success: true,
      data: saved,
    };
  },
};
