import { NextResponse } from "next/server";
import { RuntimeEvidenceHandoffRequestSchema } from "@/platform/runtime/contracts/evidence-handoff/evidence-handoff-contract";
import { resolveRuntimeEvidenceHandoff } from "@/platform/runtime/contracts/evidence-handoff/resolve-evidence-handoff";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const result = RuntimeEvidenceHandoffRequestSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Required information missing",
          status: "empty"
        },
        { status: 400 }
      );
    }

    const roleHeader = req.headers.get("x-user-role");
    const envHeader = req.headers.get("x-environment-id");

    let role = "runtime_user";
    if (roleHeader === "blocked" || roleHeader === "auditor" || roleHeader === "builder_admin" || roleHeader === "manager") {
      role = roleHeader;
    }

    let env = "production";
    if (envHeader === "demo" || envHeader === "synthetic" || envHeader === "prod-restricted") {
      env = envHeader;
    }

    const resolution = await resolveRuntimeEvidenceHandoff(result.data, role, env);

    return NextResponse.json(resolution);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error"
      },
      { status: 500 }
    );
  }
}
