import { NextResponse } from "next/server";
import { resolveWorkspaceContext } from "@/platform/workspace";
import { runAction } from "@/platform/actions";
import { getIntakeRequestById, getIntakeHistory } from "@/modules/work-intake/queries";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const context = await resolveWorkspaceContext({ source: "integration" });
    const { id } = await params;

    const [request, history] = await Promise.all([
      getIntakeRequestById(id),
      getIntakeHistory(id),
    ]);

    if (!request) {
      return NextResponse.json(
        { success: false, error: { message: "Request not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: { request, history } });
  } catch (error) {
    console.error("Failed to get work intake request", error);
    return NextResponse.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const context = await resolveWorkspaceContext({ source: "integration" });
    const { id } = await params;

    const textBody = await req.text();
    let body: unknown;

    try {
      body = JSON.parse(textBody);
    } catch (e) {
      return NextResponse.json(
        { success: false, error: { message: "Invalid JSON body" } },
        { status: 400 }
      );
    }

    const { status, reason } = body as { status?: string; reason?: string };

    if (!status) {
      return NextResponse.json(
        { success: false, error: { message: "Status is required" } },
        { status: 400 }
      );
    }

    const result = await runAction("work_intake.transition", { id, status, reason }, context);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error("Failed to transition work intake request", error);
    return NextResponse.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}
