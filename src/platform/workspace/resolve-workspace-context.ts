import type { ActorType, ExecutionSource, WorkspaceContext } from "./workspace-context";

type ResolveWorkspaceContextInput = {
  workspaceKey?: string;
  actor?: {
    type?: ActorType;
    id?: string;
    name?: string;
  };
  source?: ExecutionSource;
  scopes?: string[];
  correlationId?: string;
};

function createCorrelationId() {
  return globalThis.crypto?.randomUUID?.() ?? `corr-${Date.now()}`;
}

export async function resolveWorkspaceContext(
  input: ResolveWorkspaceContextInput = {},
): Promise<WorkspaceContext> {
  // TODO: resolve workspace, enabled modules, scopes and actor from DB/session/API key.
  return {
    workspaceId: input.workspaceKey ?? "sala-tecnica",
    workspaceKey: input.workspaceKey ?? "sala-tecnica",
    adaptationKey: "secao-tecnica",
    actor: {
      type: input.actor?.type ?? "system",
      id: input.actor?.id,
      name: input.actor?.name,
    },
    source: input.source ?? "system",
    enabledModules: [
      "work-items",
      "service-orders",
      "assets",
      "reports",
      "notifications",
      "events",
      "workflow-engine",
      "automations",
      "integrations",
    ],
    scopes: input.scopes ?? ["*"],
    correlationId: input.correlationId ?? createCorrelationId(),
  };
}
