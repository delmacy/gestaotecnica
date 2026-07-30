import { NextRequest, NextResponse } from "next/server";
import { resolveWorkspaceContext } from "@/platform/workspace";
import { runAction } from "@/platform/actions";
import { initializePlatformKernel } from "@/platform/kernel";

// Ensure kernel is loaded so actions are registered
initializePlatformKernel();

export async function POST(req: NextRequest) {
  let bodyText;
  try {
    bodyText = await req.text();
  } catch (error) {
    return NextResponse.json({ error: "Failed to read request body" }, { status: 400 });
  }

  let data;
  try {
    data = JSON.parse(bodyText);
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
  }

  const { serviceOrderId, decision, note } = data;

  if (!serviceOrderId || typeof serviceOrderId !== "string") {
    return NextResponse.json({ error: "serviceOrderId is required and must be a string" }, { status: 400 });
  }

  if (decision !== "approve" && decision !== "reject") {
    return NextResponse.json({ error: "decision must be 'approve' or 'reject'" }, { status: 400 });
  }

  try {
    const context = await resolveWorkspaceContext({ source: "integration" });
    const result = await runAction(
      "approvals.decide",
      {
        serviceOrderId,
        decision,
        note: typeof note === "string" ? note : undefined,
      },
      context
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error?.message || "Failed to process decision" },
        { status: result.error?.code === "NOT_FOUND" ? 404 : 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      events: result.events,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
