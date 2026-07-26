import { NextResponse, NextRequest } from "next/server";
import { resolveWorkspaceContext } from "@/platform/workspace";
import { resolveNextStep } from "@/platform/builder/contracts/next-step/resolve-next-step";
import { NextStepOutcomeSchema } from "@/platform/builder/contracts/next-step/next-step-contract";
import { createPlatformError } from "@/platform/errors";
import { OriginContext } from "@/platform/builder/contracts/origin-context/origin-context-contract";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Parse outcome using Zod schema
    const parseResult = NextStepOutcomeSchema.safeParse(body.outcome);
    if (!parseResult.success) {
      const errorEnvelope = createPlatformError(
        {
          code: "PLATFORM.API.VALIDATION_ERROR",
          category: "unexpected",
          severity: "error",
          message: "Invalid next-step outcome",
          details: {},
        },
        { id: crypto.randomUUID(), timestamp: new Date().toISOString() }
      );
      return NextResponse.json(errorEnvelope, { status: 400 });
    }

    const outcome = parseResult.data;
    const moduleKey = body.moduleKey;
    const entityId = body.entityId;
    const jobId = body.jobId;
    const hasDestinationAccess = body.hasDestinationAccess ?? true;

    if (!moduleKey) {
       const errorEnvelope = createPlatformError(
        {
          code: "PLATFORM.API.VALIDATION_ERROR",
          category: "unexpected",
          severity: "error",
          message: "Missing required field: moduleKey",
          details: {},
        },
        { id: crypto.randomUUID(), timestamp: new Date().toISOString() }
      );
      return NextResponse.json(errorEnvelope, { status: 400 });
    }

    const context = await resolveWorkspaceContext({ source: "system" });

    const originContext: OriginContext = body.originContext ?? {
      originPath: `/builder/${moduleKey}`,
      returnPath: `/builder/${moduleKey}`,
      returnLabel: `Return to ${moduleKey}`,
      isBlocked: false,
      isDemo: context.environmentMode === "demo",
      isSynthetic: context.environmentMode === "synthetic",
      isValidScope: true
    };

    const nextStep = resolveNextStep({
      outcome,
      moduleKey,
      entityId,
      jobId,
      workspaceContext: context,
      originContext,
      hasDestinationAccess
    });

    return NextResponse.json(nextStep, { status: 200 });
  } catch (error: unknown) {
    const errorEnvelope = createPlatformError(
      {
        code: "PLATFORM.API.INTERNAL_ERROR",
        category: "unexpected",
        severity: "error",
        message: "Failed to resolve next step",
        details: {},
      },
      { id: crypto.randomUUID(), timestamp: new Date().toISOString() }
    );
    return NextResponse.json(errorEnvelope, { status: 500 });
  }
}
