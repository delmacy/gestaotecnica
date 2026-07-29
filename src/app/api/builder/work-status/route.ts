import { NextResponse } from "next/server";
import { resolveWorkspaceContext } from "@/platform/workspace";
import { resolveWorkStatus } from "@/platform/builder/contracts/work-status/resolve-work-status";
import { emitEvent, createReceipt } from "@/platform/events/event-log-service";

export async function POST(req: Request) {
  try {
    const textBody = await req.text();
    let body;
    try {
      body = JSON.parse(textBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { workId, moduleKey, isWorkEmpty, returnPath, returnLabel } = body;

    if (!moduleKey) {
      return NextResponse.json({ error: "Missing required fields: moduleKey" }, { status: 400 });
    }

    const workspaceContext = await resolveWorkspaceContext({ source: "integration" });

    // Safely parse headers to strings
    const headerEnvMode = req.headers.get("x-environment-mode") || "real";
    const headerBlocked = req.headers.get("x-is-blocked") === "true";

    const environmentMode = headerEnvMode === "demo" ? "demo" : headerEnvMode === "synthetic" ? "synthetic" : "real";

    const resolution = resolveWorkStatus({
      workId,
      moduleKey,
      isWorkEmpty,
      workspaceContext: {
        ...workspaceContext,
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

    try {
      const event = await emitEvent({
        eventType: "work_status.resolved",
        entityType: "work_status",
        entityId: workId || moduleKey,
        payload: { status: resolution.status, destination: resolution.destination }
      }, { ...workspaceContext, environmentMode });

      resolution.receipt = createReceipt(event, "success");
    } catch (auditError) {
      console.error("Failed to emit audit event for work-status:", auditError);
      // We don't fail the primary action, but we lack a receipt.
    }

    return NextResponse.json(resolution);
  } catch (error) {
    console.error("Error in work-status route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
