import type { ActionDefinition } from "@/platform/actions";
import {
  actionObjectSchema,
  stringProperty,
} from "@/platform/actions/schema-presets";
import { searchEverything } from "./queries";

export const globalSearchKernelAction: ActionDefinition<
  { query: string },
  unknown
> = {
  key: "search.everything",
  moduleKey: "global-search",
  description: "Realiza busca global em entidades operacionais.",
  callableBy: ["ui", "integration", "automation", "system"],
  inputSchema: actionObjectSchema(
    {
      query: stringProperty("Termo de busca."),
    },
    ["query"],
  ),
  handler: async (input: any) => {
    const results = await searchEverything(input.query);
    return {
      success: true,
      data: results,
    };
  },
};
