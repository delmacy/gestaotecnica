import { NextResponse, NextRequest } from "next/server";
import { resolveWorkspaceContext } from "@/platform/workspace";
import { resolveDeepLinkLanding } from "@/platform/builder/contracts/deep-link-landing/resolve-deep-link-landing";
import { createPlatformError } from "@/platform/errors";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const context = await resolveWorkspaceContext({ source: "system" });

    // In a real application, you'd extract session, roles, entity existence from the request/DB
    // Here we use the body to supply the state for testing the contract
    const result = resolveDeepLinkLanding(body, context);

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    const errorEnvelope = createPlatformError(
      {
        code: "PLATFORM.API.INTERNAL_ERROR",
        category: "unexpected",
        severity: "error",
        message: "Failed to resolve deep link landing",
        details: {},
      },
      { id: crypto.randomUUID(), timestamp: new Date().toISOString() }
    );
    return NextResponse.json(errorEnvelope, { status: 500 });
  }
}
