import { NextResponse } from "next/server";
import { runAction } from "@/platform/actions";
import { resolveWorkspaceContext } from "@/platform/workspace";
import { TransitionIntakeInputSchema } from "@/modules/work-intake/contracts/intake.schema";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const text = await req.text();
    let body;
    try {
      body = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_JSON", message: "Invalid JSON payload" } },
        { status: 400 }
      );
    }

    const validation = TransitionIntakeInputSchema.safeParse({ id, ...body });
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: validation.error.message, details: validation.error.issues } },
        { status: 400 }
      );
    }

    const context = await resolveWorkspaceContext({ source: "integration" });
    const result = await runAction("work_intake.transition", validation.data, context);

    if (!result.success) {
      if (result.error?.code === "NOT_FOUND") {
         return NextResponse.json(
          { success: false, error: result.error },
          { status: 404 }
        );
      }
      if (result.error?.code === "FORBIDDEN") {
         return NextResponse.json(
          { success: false, error: result.error },
          { status: 403 }
        );
      }

      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data: result.data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
      { status: 500 }
    );
  }
}
