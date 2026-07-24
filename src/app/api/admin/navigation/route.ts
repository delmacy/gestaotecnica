import { NextResponse } from "next/server";
import { resolveAdminNavigationInventory } from "@/platform/admin/contracts/navigation-inventory";
import { createPlatformError } from "@/platform/errors";

export async function GET() {
  try {
    const inventory = resolveAdminNavigationInventory();
    return NextResponse.json(inventory, { status: 200 });
  } catch (error: unknown) {
    const errorEnvelope = createPlatformError(
      {
        code: "PLATFORM.API.INTERNAL_ERROR",
        category: "unexpected",
        severity: "error",
        message: "Failed to resolve admin navigation inventory",
        details: {},
      },
      { id: crypto.randomUUID(), timestamp: new Date().toISOString() }
    );
    return NextResponse.json(errorEnvelope, { status: 500 });
  }
}
