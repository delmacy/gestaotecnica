import { getDb } from "@/db";
import { workspaceModuleConfigs } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import type { ActionDefinition } from "@/platform/actions";
import {
  actionObjectSchema,
  booleanProperty,
  stringProperty,
  uuidProperty,
} from "@/platform/actions/schema-presets";

type ToggleModuleInput = {
  workspaceId?: string;
  moduleKey?: string;
  enabled?: boolean;
};

export const toggleModuleKernelAction: ActionDefinition<
  ToggleModuleInput,
  { moduleKey: string; enabled: boolean }
> = {
  key: "workspace.toggle_module",
  moduleKey: "workspace-config",
  description: "Habilita ou desabilita um módulo no workspace.",
  callableBy: ["ui", "system"],
  inputSchema: actionObjectSchema(
    {
      workspaceId: uuidProperty("ID do workspace."),
      moduleKey: stringProperty("Chave do módulo."),
      enabled: booleanProperty("Status desejado."),
    },
    ["workspaceId", "moduleKey", "enabled"],
  ),
  outputSchema: actionObjectSchema({
    moduleKey: stringProperty("Módulo alterado."),
    enabled: booleanProperty("Novo status."),
  }),
  handler: async (input) => {
    const workspaceId = String(input.workspaceId ?? "").trim();
    const moduleKey = String(input.moduleKey ?? "").trim();

    const db = getDb();
    await db
      .update(workspaceModuleConfigs)
      .set({ isEnabled: input.enabled, updatedAt: new Date() })
      .where(
        and(
          eq(workspaceModuleConfigs.workspaceId, workspaceId),
          eq(workspaceModuleConfigs.moduleKey, moduleKey),
        ),
      );

    return {
      success: true,
      data: { moduleKey, enabled: input.enabled ?? false },
    };
  },
};
