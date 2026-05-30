import { getPlatformDb } from "@/db";
import { capabilities } from "@/db/platform/schema/registry";
import type { ActionDefinition } from "@/platform/actions";
import { actionObjectSchema } from "@/platform/actions/schema-presets";

export const listCapabilitiesKernelAction: ActionDefinition<any, any[]> = {
  key: "registry.list_capabilities",
  moduleKey: "registry",
  description: "Lista todas as capacidades registradas na plataforma.",
  callableBy: ["ui", "system"],
  inputSchema: actionObjectSchema({}),
  async handler() {
    const db = getPlatformDb();
    const rows = await db.select().from(capabilities);
    return {
      success: true,
      data: rows,
    };
  },
};
