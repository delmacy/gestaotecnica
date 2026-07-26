import { NextResponse } from "next/server";
import { resolveBuilderHandoff } from "@/platform/builder/contracts/handoff/resolve-handoff";
import { BuilderHandoffRequestSchema } from "@/platform/builder/contracts/handoff/handoff-contract";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const result = BuilderHandoffRequestSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          runtimeUrl: "",
          message: "Invalid request payload",
          status: "empty"
        },
        { status: 400 }
      );
    }

    const resolution = await resolveBuilderHandoff(result.data);

    // According to contract, we want to return 200 even for known business logic rejections
    // if we are following the builder pattern, we should return the exact schema
    return NextResponse.json(resolution);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        runtimeUrl: "",
        message: "Internal server error"
      },
      { status: 500 }
    );
  }
}
