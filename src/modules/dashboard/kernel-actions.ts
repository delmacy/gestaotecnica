import type { ActionDefinition } from "@/platform/actions";
import { actionObjectSchema } from "@/platform/actions/schema-presets";
import { getDashboardSummary } from "./queries";

export const getDashboardSummaryKernelAction: ActionDefinition<
  Record<string, never>,
  unknown
> = {
  key: "dashboard.get_summary",
  moduleKey: "dashboard",
  description: "Retorna o sumário de métricas do dashboard.",
  callableBy: ["ui", "system"],
  inputSchema: actionObjectSchema({}),
  handler: async () => {
    const summary = await getDashboardSummary();
    return {
      success: true,
      data: summary,
    };
  },
};
