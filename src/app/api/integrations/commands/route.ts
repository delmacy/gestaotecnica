import { NextResponse } from "next/server";
import { initializePlatformKernel } from "@/platform";
import { routeIntegrationCommand } from "@/platform/integrations";
import type { IntegrationCommandRequest } from "@/platform/integrations";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  initializePlatformKernel();

  const body = (await request.json().catch(() => ({}))) as Partial<IntegrationCommandRequest>;

  if (!body.command) {
    return NextResponse.json(
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

  return NextResponse.json(response, { status: response.success ? 200 : 400 });
}
