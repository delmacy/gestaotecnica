import { initializePlatformKernel } from "@/platform/kernel";
import { listActions } from "@/platform/actions";
import { listEvents } from "@/platform/events";
import { listFlows } from "@/platform/flows";
import { listModules } from "@/platform/modules";

export const dynamic = "force-dynamic";

export async function GET() {
  initializePlatformKernel();

  const actions = listActions().map((action) => ({
    key: action.key,
    moduleKey: action.moduleKey,
    description: action.description,
    requiredScopes: action.requiredScopes ?? [],
    requiredModules: action.requiredModules ?? [],
    callableBy: action.callableBy ?? [],
    inputSchema: action.inputSchema,
    outputSchema: action.outputSchema,
    emits: action.emits ?? [],
    idempotent: action.idempotent ?? false,
  }));

  const flows = listFlows().map((flow) => ({
    key: flow.key,
    name: flow.name,
    version: flow.version,
    trigger: flow.trigger,
  }));

  return Response.json({
    success: true,
    modules: listModules(),
    actions,
    events: listEvents(),
    flows,
  });
}
