import { NextResponse } from "next/server";
import { validateGatewayRequest } from "@/platform/integrations/auth";
import { gatewayModules } from "@/platform/integrations/module-registry";
import {
  toNextPlatformErrorResponse,
  toNextUnknownErrorResponse,
} from "@/platform/errors/next-response-adapter";
import { createPlatformError, createPlatformErrorContext } from "@/platform/errors/factory";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const context = createPlatformErrorContext(request);

  try {
    const authError = validateGatewayRequest(request);
    if (authError) {
      const envelope = createPlatformError(
        {
          code: "GATEWAY.AUTH.UNAUTHORIZED",
          category: "authentication",
          severity: "error",
          message: "Unauthorized gateway request",
        },
        context,
      );
      return toNextPlatformErrorResponse(envelope);
    }

    return NextResponse.json({
      ok: true,
      gateway: "gestaotecnica",
      version: "v1",
      modules: gatewayModules,
    });
  } catch (error) {
    return toNextUnknownErrorResponse(error, context);
  }
}
