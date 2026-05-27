import { NextResponse } from "next/server";
import { validateGatewayRequest } from "@/platform/integrations/auth";
import { gatewayModules } from "@/platform/integrations/module-registry";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authError = validateGatewayRequest(request);
  if (authError) return authError;

  return NextResponse.json({
    ok: true,
    gateway: "gestaotecnica",
    version: "v1",
    modules: gatewayModules,
  });
}
