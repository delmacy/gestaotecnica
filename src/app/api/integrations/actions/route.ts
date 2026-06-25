import { initializePlatformKernel } from "@/platform/kernel";
import { listActions } from "@/platform/actions";
import { validateActionDescriptor } from "@/platform/actions/contracts/action-descriptor";
import { listEvents } from "@/platform/events";
import { listFlows } from "@/platform/flows";
import { listModules } from "@/platform/modules";

export const dynamic = "force-dynamic";

export async function GET() {
  initializePlatformKernel();

  const actions = listActions().map((action) => {
    // 1. Build the canonical descriptor based on the registered ActionDefinition
    // Provide default `{}` object for schemas to satisfy descriptor contract if missing.
    const rawDescriptor = {
      key: action.key,
      name: action.uiLabel || action.key,
      description: action.description,
      handlerKey: action.key, // Currently handlers are referenced by action key
      inputSchema: action.inputSchema || { type: "object", properties: {} },
      outputSchema: action.outputSchema || { type: "object", properties: {} },
      idempotent: action.idempotent,
    };

    // 2. Validate descriptor against strict technical contract
    // We intentionally allow this to throw ZodError if validation fails,
    // ensuring failures are explicitly observable in logs and do not silently mask operational errors.
    const descriptor = validateActionDescriptor(rawDescriptor);

    // 3. Expose additional contextual execution fields useful for API consumers
    // without violating the core descriptor metadata shape
    return {
      ...descriptor,
      moduleKey: action.moduleKey,
      requiredScopes: action.requiredScopes ?? [],
      requiredModules: action.requiredModules ?? [],
      callableBy: action.callableBy ?? [],
      emits: action.emits ?? [],
    };
  });

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
