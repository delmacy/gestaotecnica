import { NextResponse } from "next/server";
import { processAgentSubmissionWithMetadata } from "@/features/platform/gateway/agent-gateway-metadata.service";
import {
  toNextPlatformErrorResponse,
  toNextUnknownErrorResponse,
} from "@/platform/errors/next-response-adapter";
import { createPlatformError, createPlatformErrorContext } from "@/platform/errors/factory";

export async function POST(request: Request) {
  const context = createPlatformErrorContext(request);

  try {
    const agentKey = request.headers.get("x-agent-key");
    const idempotencyKey = request.headers.get("x-idempotency-key");
    const validKey = process.env.AGENT_GATEWAY_KEY;

    if (!validKey) {
      console.warn("AGENT_GATEWAY_KEY is not configured in the environment.");
      const envelope = createPlatformError(
        {
          code: "AGENT.CONFIG.MISSING_KEY",
          category: "unexpected",
          severity: "error",
          message: "Agent Gateway is not properly configured.",
        },
        context,
      );
      return toNextPlatformErrorResponse(envelope);
    }

    if (!agentKey || agentKey !== validKey) {
      const envelope = createPlatformError(
        {
          code: "AGENT.AUTH.INVALID_KEY",
          category: "authentication",
          severity: "error",
          message: "Invalid or missing x-agent-key.",
        },
        context,
      );
      return toNextPlatformErrorResponse(envelope);
    }

    const payload = await request.json();

    const result = await processAgentSubmissionWithMetadata(payload, {
      correlationId: context.correlationId,
      idempotencyKey,
    });

    if (!result.ok) {
      const envelope = createPlatformError(
        {
          code: result.error?.code === "INVALID_PAYLOAD" ? "VALIDATION.PAYLOAD.INVALID" : (result.error?.code || "VALIDATION.PAYLOAD.UNKNOWN"),
          category: "validation",
          severity: "warning",
          message: result.error?.message || "Payload validation failed.",
          details: {
            ...result.error?.details,
          },
          metadata: {
            receipt: result.receipt,
          },
        },
        {
          ...context,
          correlationId: result.receipt.correlationId,
        },
      );
      return toNextPlatformErrorResponse(envelope);
    }

    return NextResponse.json(
      { ok: true, data: result.data, receipt: result.receipt },
      { status: 200 },
    );
  } catch (error) {
    return toNextUnknownErrorResponse(error, context);
  }
}
