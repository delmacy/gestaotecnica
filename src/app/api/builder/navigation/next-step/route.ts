import { NextResponse, NextRequest } from "next/server";
import { resolveWorkspaceContext } from "@/platform/workspace";
import { resolveNextStep } from "@/platform/builder/contracts/next-step/resolve-next-step";
import { NextStepOutcomeSchema } from "@/platform/builder/contracts/next-step/next-step-contract";
import { resolveOriginContext } from "@/platform/builder/contracts/origin-context/resolve-origin-context";
import { createPlatformError } from "@/platform/errors";
import { z } from "zod";

const NextStepRequestSchema = z.object({
  outcome: NextStepOutcomeSchema,
  moduleKey: z.string(),
  entityId: z.string().optional(),
  jobId: z.string().optional(),
  pathname: z.string().optional(),
  hasDestinationAccess: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = NextStepRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    const { outcome, moduleKey, entityId, jobId, pathname, hasDestinationAccess } = parsed.data;

    const workspaceContext = await resolveWorkspaceContext({ source: "system" });
    const currentPath = pathname ?? `/builder/${moduleKey}`;
    const originContext = resolveOriginContext({
      workspaceContext,
      currentPath,
      originPath: currentPath,
      moduleKey,
    });

    const resolution = resolveNextStep({
      outcome,
      moduleKey,
      entityId,
      jobId,
      workspaceContext,
      originContext,
      hasDestinationAccess,
    });

    return NextResponse.json(resolution, { status: 200 });
  } catch (error: unknown) {
    const errorEnvelope = createPlatformError(
      {
        code: "PLATFORM.API.INTERNAL_ERROR",
        category: "unexpected",
        severity: "error",
        message: "Failed to resolve next-step destination",
        details: {},
      },
      { id: crypto.randomUUID(), timestamp: new Date().toISOString() }
    );
    return NextResponse.json(errorEnvelope, { status: 500 });
  }
}
