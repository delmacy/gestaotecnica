import { NextResponse, NextRequest } from "next/server";
import { resolveWorkspaceContext } from "@/platform/workspace";
import { resolveNavigationInventory } from "@/platform/builder/contracts/navigation-inventory";
import { createPlatformError } from "@/platform/errors";

export async function GET(request: NextRequest) {
  try {
    const environmentModeCookie = request.cookies.get("x-environment-mode")?.value;
    const environmentMode = (environmentModeCookie === "synthetic" || environmentModeCookie === "demo") ? environmentModeCookie : "real";

    const context = await resolveWorkspaceContext({ source: "system", environmentMode });
    const inventory = resolveNavigationInventory(context);

    return NextResponse.json(inventory, { status: 200 });
  } catch (error: unknown) {
    const errorEnvelope = createPlatformError(
      {
        code: "PLATFORM.API.INTERNAL_ERROR",
        category: "unexpected",
        severity: "error",
        message: "Failed to resolve navigation inventory",
        details: {},
      },
      { id: crypto.randomUUID(), timestamp: new Date().toISOString() }
    );
    return NextResponse.json(errorEnvelope, { status: 500 });
  }
}
