import { runAction } from "@/platform/actions";
import { resolveWorkspaceContext } from "@/platform/workspace";
import type { IntegrationCommandRequest, IntegrationCommandResponse } from "./integration-command-types";

export async function routeIntegrationCommand(
  commandRequest: IntegrationCommandRequest,
): Promise<IntegrationCommandResponse> {
  const context = await resolveWorkspaceContext({
    workspaceKey: commandRequest.workspaceKey,
    source: "integration",
    actor: {
      type: "api_key",
      id: "dev-api-key",
      name: "Development API Key",
    },
    scopes: ["*"],
  });

  // TODO: validate API key, persist idempotency key and reject duplicated external commands.
  const result = await runAction(commandRequest.command, commandRequest.payload ?? {}, context);

  return {
    success: result.success,
    data: result.data,
    error: result.error,
    correlationId: context.correlationId,
  };
}
