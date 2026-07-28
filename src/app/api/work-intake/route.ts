import { NextResponse } from "next/server";
import { resolveWorkspaceContext } from "@/platform/workspace";
import { runAction } from "@/platform/actions";
import { getIntakeRequests } from "@/modules/work-intake/queries";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const status = url.searchParams.get("status");

    // Auth context handled internally via workspace
    const context = await resolveWorkspaceContext({ source: "integration" });

    const filters = status ? { status } : undefined;
    const requests = await getIntakeRequests(filters);

    return NextResponse.json({ success: true, data: requests });
  } catch (error) {
    console.error("Failed to list work intake requests", error);
    return NextResponse.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const context = await resolveWorkspaceContext({ source: "integration" });
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

    const result = await runAction("work_intake.capture", body, context);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data: result.data }, { status: 201 });
  } catch (error) {
    console.error("Failed to create work intake request", error);
    return NextResponse.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}
