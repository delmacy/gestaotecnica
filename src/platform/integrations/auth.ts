import { NextResponse } from "next/server";
import { verifyGatewayToken } from "./jwt";

export type GatewayAuthResult = {
  authenticated: true;
  workspaceId: string;
} | {
  authenticated: false;
  error: NextResponse;
};

export async function authenticateGatewayRequest(
  request: Request,
): Promise<GatewayAuthResult> {
  const authHeader = request.headers.get("authorization") ?? "";
  const apiKeyHeader = request.headers.get("x-gestaotecnica-api-key");

  const expectedApiKey = process.env.GESTAOTECNICA_API_KEY;

  // 1. Try API key (backward compatible)
  if (expectedApiKey) {
    const providedKey = apiKeyHeader ?? authHeader.replace(/^Bearer\s+/i, "");
    if (providedKey === expectedApiKey) {
      return { authenticated: true, workspaceId: "global" };
    }
  }

  // 2. Try JWT Bearer token
  const bearerToken = authHeader.match(/^Bearer\s+(.+)$/i)?.[1];
  if (bearerToken) {
    const payload = await verifyGatewayToken(bearerToken);
    if (payload) {
      return { authenticated: true, workspaceId: payload.workspaceId };
    }
  }

  // 3. Both failed
  return {
    authenticated: false,
    error: NextResponse.json(
      { ok: false, error: "unauthorized_gateway_request" },
      { status: 401 },
    ),
  };
}

/** @deprecated Use `authenticateGatewayRequest` instead. */
export async function validateGatewayRequest(
  request: Request,
): Promise<NextResponse | null> {
  const result = await authenticateGatewayRequest(request);
  return result.authenticated ? null : result.error;
}
