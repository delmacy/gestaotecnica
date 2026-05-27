import { NextResponse } from "next/server";
import { validateGatewayRequest } from "@/platform/integrations/auth";
import { contextualPacks } from "@/platform/integrations/packs";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authError = validateGatewayRequest(request);
  if (authError) return authError;

  return NextResponse.json({
    ok: true,
    packs: contextualPacks,
  });
}
