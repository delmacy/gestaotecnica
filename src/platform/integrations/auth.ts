import { NextResponse } from "next/server";

export function validateGatewayRequest(request: Request) {
  const expectedKey = process.env.SYSTEM_BUILDER_API_KEY;

  if (!expectedKey) {
    return null;
  }

  const providedKey =
    request.headers.get("x-system-builder-api-key") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (providedKey === expectedKey) {
    return null;
  }

  return NextResponse.json(
    {
      ok: false,
      error: "unauthorized_gateway_request",
    },
    { status: 401 },
  );
}
