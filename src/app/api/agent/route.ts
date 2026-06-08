import { NextResponse } from "next/server";
import { processAgentSubmissionWithMetadata } from "@/features/platform/gateway/agent-gateway-metadata.service";

export async function POST(request: Request) {
  try {
    const agentKey = request.headers.get("x-agent-key");
    const correlationId = request.headers.get("x-correlation-id");
    const idempotencyKey = request.headers.get("x-idempotency-key");
    const validKey = process.env.AGENT_GATEWAY_KEY;

    if (!validKey) {
      console.warn("AGENT_GATEWAY_KEY is not configured in the environment.");
      return NextResponse.json(
        {
          error: {
            code: "SERVER_ERROR",
            message: "Agent Gateway is not properly configured.",
          },
        },
        { status: 500 },
      );
    }

    if (!agentKey || agentKey !== validKey) {
      return NextResponse.json(
        {
          error: {
            code: "UNAUTHORIZED",
            message: "Invalid or missing x-agent-key.",
          },
        },
        { status: 401 },
      );
    }

    const payload = await request.json();

    const result = await processAgentSubmissionWithMetadata(payload, {
      correlationId,
      idempotencyKey,
    });

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error, receipt: result.receipt },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { ok: true, data: result.data, receipt: result.receipt },
      { status: 200 },
    );
  } catch (error) {
    console.error("Agent Gateway Submission Error:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to process agent submission.",
        },
      },
      { status: 500 },
    );
  }
}
