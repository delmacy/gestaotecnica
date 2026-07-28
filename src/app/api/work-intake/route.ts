import { NextResponse } from "next/server";
import { runAction } from "@/platform/actions";
import { resolveWorkspaceContext } from "@/platform/workspace";
import { CreateIntakeInputSchema } from "@/modules/work-intake/contracts/intake.schema";
import { getIntakeRequests } from "@/modules/work-intake/queries";
import { createReceipt } from "@/platform/events/event-log-service";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
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

    const validation = CreateIntakeInputSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: validation.error.message, details: validation.error.issues } },
        { status: 400 }
      );
    }

    const context = await resolveWorkspaceContext({ source: "integration" });
    const result = await runAction("work_intake.capture", validation.data, context);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    const firstEvent = result.events && result.events.length > 0 ? result.events[0] : undefined;
    const receipt = firstEvent ? createReceipt(firstEvent as unknown as Parameters<typeof createReceipt>[0], "success", { processorId: "work-intake-api" }) : undefined;

    return NextResponse.json({ success: true, data: result.data, receipt }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || undefined;

    // We don't strictly need to pass context here as getIntakeRequests resolves it internally,
    // but resolving it once validates auth/context.
    await resolveWorkspaceContext({ source: "integration" });

    const requests = await getIntakeRequests(status ? { status } : undefined);

    return NextResponse.json({ success: true, data: requests }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
      { status: 500 }
    );
  }
}
