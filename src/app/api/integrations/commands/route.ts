import { initializePlatformKernel } from "@/platform";
import { routeIntegrationCommand, validateGatewayRequest } from "@/platform/integrations";
import type { IntegrationCommandRequest } from "@/platform/integrations";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const authResponse = validateGatewayRequest(request);
  if (authResponse) return authResponse;

  initializePlatformKernel();

  const body = (await request.json().catch(() => ({}))) as Partial<IntegrationCommandRequest>;

  if (!body.command) {
    return Response.json(
      {
        success: false,
        error: {
          code: "COMMAND_REQUIRED",
          message: "command e obrigatorio.",
        },
        correlationId: "not_resolved",
      },
      { status: 400 },
    );
  }

  // TODO: validar API key real e escopos por cliente.
  const response = await routeIntegrationCommand({
    workspaceKey: body.workspaceKey,
    command: body.command,
    idempotencyKey: body.idempotencyKey,
    payload: body.payload,
  });

  return Response.json(
    {
      success: response.success,
      data: response.data,
      error: response.error,
      correlationId: response.correlationId,
    },
    { status: response.success ? 200 : 400 },
  );
}
