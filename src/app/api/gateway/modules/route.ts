import { NextResponse } from "next/server";
import { validateGatewayRequest } from "@/platform/integrations/auth";
import { gatewayModules } from "@/platform/integrations/module-registry";
import {
  toNextPlatformErrorResponse,
  toNextUnknownErrorResponse,
  createPlatformErrorContextFromRequest,
} from "@/platform/errors";
import { createPlatformError } from "@/platform/errors/factory";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const context = createPlatformErrorContextFromRequest(request);

  try {
    const authError = validateGatewayRequest(request);
    if (authError) {
      // Compatibility Decision: Mapping original 401 response to canonical pipeline.
      // The public body will change to standard envelope, but 401 status is preserved.
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
