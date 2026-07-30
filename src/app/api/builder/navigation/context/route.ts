import { NextResponse, NextRequest } from "next/server";
import { resolveWorkspaceContext } from "@/platform/workspace";
import { resolveViewState } from "@/platform/builder/contracts/empty-state/resolve-empty-state";
import { resolveBreadcrumbInventory } from "@/platform/builder/contracts/breadcrumb/breadcrumb-inventory";
import { resolvePrimaryAction } from "@/platform/builder/contracts/primary-action/resolve-primary-action";
import { createPlatformError } from "@/platform/errors";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const moduleKey = searchParams.get("moduleKey") ?? "workspace";
    const pathname = searchParams.get("pathname") ?? "/builder";
    const hasDataParam = searchParams.get("hasData");
    const hasData = hasDataParam === "true";

    const context = await resolveWorkspaceContext({ source: "system" });

    const viewState = resolveViewState(context, { moduleKey, hasData });
    const breadcrumbs = resolveBreadcrumbInventory(context, { pathname });
    const primaryAction = resolvePrimaryAction(context, { moduleKey, routeContext: "list" });

    const navigationContext = {
      cameFrom: breadcrumbs.length > 1 ? breadcrumbs.slice(0, -1).map(b => b.href).filter(Boolean) : ["/builder"],
      doHere: viewState.state === "empty"
        ? [viewState.description]
        : ["Manage module data", "Explore records"],
      goNext: primaryAction.state === "active" ? [primaryAction.href] : [],
      returnVia: ["Global Sidebar", "Breadcrumbs", "Platform Logo"]
    };

    const payload = {
      environmentMode: context.environmentMode,
      viewState,
      breadcrumbs,
      primaryAction,
      navigationContext
    };

    return NextResponse.json(payload, { status: 200 });
  } catch {
    const errorEnvelope = createPlatformError(
      {
        code: "PLATFORM.API.INTERNAL_ERROR",
        category: "unexpected",
        severity: "error",
        message: "Failed to resolve navigation context",
        details: {},
      },
      { id: crypto.randomUUID(), timestamp: new Date().toISOString() }
    );
    return NextResponse.json(errorEnvelope, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ status: "success" });
  response.cookies.set("x-organization-id", "", { path: "/", maxAge: 0, sameSite: "lax" });
  response.cookies.set("x-workspace-id", "", { path: "/", maxAge: 0, sameSite: "lax" });
  return response;
}
