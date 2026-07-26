import { NextResponse, NextRequest } from "next/server";
import { resolveWorkspaceContext } from "@/platform/workspace";
import { resolveCancelBack } from "@/platform/builder/contracts/cancel-back/resolve-cancel-back";
import { createPlatformError } from "@/platform/errors";
import { CancelBackRequest } from "@/platform/builder/contracts/cancel-back/cancel-back-contract";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Type narrow the cookie value instead of using 'as any'
    const cookieHeader = request.cookies.get('x-environment-mode')?.value;
    let envMode: "real" | "synthetic" | "demo" | undefined;
    if (cookieHeader === "real" || cookieHeader === "synthetic" || cookieHeader === "demo") {
      envMode = cookieHeader as "real" | "synthetic" | "demo";
    }

    const { action, context: viewContext, isDirty, moduleKey, entityId, originPath, hasPermissionForOrigin } = body;

    if (!action || !viewContext || !moduleKey || isDirty === undefined) {
       const errorEnvelope = createPlatformError(
        {
          code: "PLATFORM.API.VALIDATION_ERROR",
          category: "unexpected",
          severity: "error",
          message: "Missing required fields",
          details: {},
        },
        { id: crypto.randomUUID(), timestamp: new Date().toISOString() }
      );
      return NextResponse.json(errorEnvelope, { status: 400 });
    }

    const workspaceContext = await resolveWorkspaceContext({
      source: "system",
      environmentMode: envMode,
    });

    // In demo mode, discard prompts might be bypassed
    const effectiveIsDirty = workspaceContext.environmentMode === 'demo' ? false : isDirty;

    const req: CancelBackRequest = {
      action,
      context: viewContext,
      isDirty: effectiveIsDirty,
      module: moduleKey,
      entityId,
      originPath,
      hasPermissionForOrigin: hasPermissionForOrigin ?? true
    };

    const outcome = resolveCancelBack(req);

    return NextResponse.json(outcome, { status: 200 });
  } catch (error: unknown) {
    const errorEnvelope = createPlatformError(
      {
        code: "PLATFORM.API.INTERNAL_ERROR",
        category: "unexpected",
        severity: "error",
        message: "Failed to resolve cancel/back behavior",
        details: {},
      },
      { id: crypto.randomUUID(), timestamp: new Date().toISOString() }
    );
    return NextResponse.json(errorEnvelope, { status: 500 });
  }
}
