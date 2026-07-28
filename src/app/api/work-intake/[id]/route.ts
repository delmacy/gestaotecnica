import { NextResponse } from "next/server";
import { resolveWorkspaceContext } from "@/platform/workspace";
import { getIntakeRequestById } from "@/modules/work-intake/queries";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await resolveWorkspaceContext({ source: "integration" });

    const request = await getIntakeRequestById(id);

    if (!request) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Request not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: request }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
      { status: 500 }
    );
  }
}
