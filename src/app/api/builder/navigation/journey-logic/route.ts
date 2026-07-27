import { NextResponse } from "next/server";
import { resolveJourneyLogic } from "@/platform/builder/contracts/journey-logic/resolve-journey-logic";
import { JourneyActionSchema } from "@/platform/builder/contracts/journey-logic/journey-logic-contract";

export async function POST(req: Request) {
  try {
    const textBody = await req.text();
    let body;
    try {
      body = JSON.parse(textBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    // Parse action, ignoring other fields for schema validation
    const actionResult = JourneyActionSchema.safeParse(body.action);
    if (!actionResult.success) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const { journeyId, currentStepId, nextStepId, moduleKey, isJourneyEmpty, returnPath, returnLabel } = body;

    if (!journeyId || !moduleKey) {
      return NextResponse.json({ error: "Missing required fields: journeyId, moduleKey" }, { status: 400 });
    }

    // Safely parse headers to strings
    const headerEnvMode = req.headers.get("x-environment-mode") || "real";
    const headerBlocked = req.headers.get("x-is-blocked") === "true";

    const environmentMode = headerEnvMode === "demo" ? "demo" : headerEnvMode === "synthetic" ? "synthetic" : "real";

    const resolution = resolveJourneyLogic({
      action: actionResult.data,
      journeyId,
      currentStepId,
      nextStepId,
      moduleKey,
      isJourneyEmpty,
      workspaceContext: {
        workspaceId: "w-demo",
        workspaceKey: "demo",
        actor: { type: "user" },
        source: "ui",
        enabledModules: [],
        scopes: [],
        correlationId: "journey-logic",
        environmentMode
      },
      originContext: {
        originPath: null,
        isDemo: environmentMode === "demo",
        isSynthetic: environmentMode === "synthetic",
        isValidScope: true,
        isBlocked: headerBlocked,
        returnPath: returnPath || null,
        returnLabel: returnLabel || null
      }
    });

    return NextResponse.json(resolution);
  } catch (error) {
    console.error("Error in journey-logic route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
