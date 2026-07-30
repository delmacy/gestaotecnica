import { NextResponse } from "next/server";
import { resolveWorkspaceSwitching, resolveWorkspaceList } from "../workspace-switching-contract/resolve-workspace-switching";
import { WorkspaceSwitchingRequestSchema, WorkspaceListRequestSchema } from "../workspace-switching-contract/workspace-switching-contract";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const result = WorkspaceSwitchingRequestSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: result.error.format() },
        { status: 400 }
      );
    }

    const resolution = await resolveWorkspaceSwitching(result.data);
    const response = NextResponse.json(resolution);
    if (resolution.status === "success") {
      response.cookies.set("x-organization-id", result.data.organizationId, { path: "/", sameSite: "lax" });
      response.cookies.set("x-workspace-id", result.data.targetWorkspaceId, { path: "/", sameSite: "lax" });
    }
    return response;
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') ?? 'anonymous';
    const organizationId = searchParams.get('organizationId');

    const requestPayload = { userId, organizationId };
    const result = WorkspaceListRequestSchema.safeParse(requestPayload);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: result.error.format() },
        { status: 400 }
      );
    }

    const resolution = await resolveWorkspaceList(result.data);
    return NextResponse.json(resolution);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
