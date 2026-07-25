import { NextResponse, NextRequest } from "next/server";
import { resolveWorkspaceContext } from "@/platform/workspace";
import { createPlatformError } from "@/platform/errors";
import { MOCK_CAPABILITIES } from "@/platform/capabilities/mock-data/capability-data";
import { resolveViewState } from "@/platform/builder/contracts/empty-state";

export async function GET(request: NextRequest) {
  try {
    const context = await resolveWorkspaceContext({ source: "system" });

    // In real scenario we would fetch from DB based on context, but per contract:
    // "The entry experience consumes mock/static data during the development phase"
    // "The entry page must not attempt real Drizzle queries, DB mutations, or ORM relationships in this phase."

    const hasData = MOCK_CAPABILITIES.length > 0;
    const viewState = resolveViewState(context, { moduleKey: "registry", hasData });

    // The contract requires a single capabilities array with mock envelope and states

    // Explicit answers for the navigation context
    const navigationContext = {
      cameFrom: ["/builder", "/builder/settings"],
      doHere: ["View catalog", "Filter commercial capabilities", "Request installation"],
      goNext: ["Capability Detail Panel", "/builder/tasker"],
      returnVia: ["Global Sidebar", "Breadcrumbs", "Platform Logo"]
    };

    const payload = {
      mock: true,
      environmentMode: context.environmentMode,
      state: viewState.state,
      viewStateOutcome: viewState,
      capabilities: MOCK_CAPABILITIES.map(cap => ({
        ...cap,
        state: cap.install_state === "available" ? "available" : (cap.install_state === "future" ? "blocked" : "synthetic") // Map to UI state branch requirement
      })),
      navigationContext
    };

    return NextResponse.json(payload, { status: 200 });
  } catch (error: unknown) {
    const errorEnvelope = createPlatformError(
      {
        code: "PLATFORM.API.INTERNAL_ERROR",
        category: "unexpected",
        severity: "error",
        message: "Failed to fetch capabilities",
        details: {},
      },
      { id: crypto.randomUUID(), timestamp: new Date().toISOString() }
    );
    return NextResponse.json(errorEnvelope, { status: 500 });
  }
}
