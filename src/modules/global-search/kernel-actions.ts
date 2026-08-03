import type { ActionDefinition } from "@/platform/actions";
import {
  actionObjectSchema,
  stringProperty,
} from "@/platform/actions/schema-presets";
import { searchEverything } from "./queries";
import { GlobalSearchDTOSchema } from "./contracts/search-dto";

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
  handler: async (input) => {
    const dto = await searchEverything(input.query);
    const parsed = GlobalSearchDTOSchema.safeParse(dto);
    if (!parsed.success) {
      return { success: false, error: { code: "DTO_VALIDATION_FAILED", message: "Search result DTO validation failed" } };
    }
    return {
      success: true,
      data: parsed.data,
    };
  },
};
