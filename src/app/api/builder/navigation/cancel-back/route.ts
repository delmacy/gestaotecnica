import { NextRequest, NextResponse } from "next/server";
import { resolveCancelBack, CancelBackActionSchema } from "@/platform/builder/contracts/cancel-back";
import { OriginContextSchema } from "@/platform/builder/contracts/origin-context/origin-context-contract";
import { z } from "zod";
import { WorkspaceContext } from "@/platform/workspace";

const RequestSchema = z.object({
  action: CancelBackActionSchema,
  isDirty: z.boolean(),
  moduleKey: z.string(),
  originContext: OriginContextSchema,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { action, isDirty, moduleKey, originContext } = parsed.data;

    const modeCookie = req.cookies.get("x-environment-mode")?.value;
    const environmentMode = modeCookie === "demo" ? "demo" : "real";

    const workspaceContext: WorkspaceContext = {
      workspaceId: "test-workspace-id",
      workspaceKey: "test-workspace-key",
      environmentMode,
      actor: {
        type: "user",
        id: "sys-user"
      },
      source: "ui",
      enabledModules: [],
      scopes: [],
      correlationId: "test-correlation"
    };

    const resolution = resolveCancelBack({
      action,
      isDirty,
      moduleKey,
      originContext,
      workspaceContext,
    });

    return NextResponse.json(resolution);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
