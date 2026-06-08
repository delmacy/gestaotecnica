import { NextResponse } from "next/server";
import { submitCandidateFromAgent } from "@/features/platform/gateway/agent-gateway.service";
import {
  agentProcessCandidatePayloadSchema,
  legacyAgentSubmissionSchema,
  mapAgentPayloadToCandidateInput,
  mapLegacyPayloadToCandidateInput,
} from "@/features/platform/gateway/contracts";

export async function POST(request: Request) {
  try {
    const agentKey = request.headers.get("x-agent-key");
    const validKey = process.env.AGENT_GATEWAY_KEY;

    if (!validKey) {
      console.warn("AGENT_GATEWAY_KEY is not configured in the environment.");
      return NextResponse.json(
        { error: { code: "SERVER_ERROR", message: "Agent Gateway is not properly configured." } },
        { status: 500 }
      );
    }

    if (!agentKey || agentKey !== validKey) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Invalid or missing x-agent-key." } },
        { status: 401 }
      );
    }

    const payload = await request.json();

    const canonicalResult = agentProcessCandidatePayloadSchema.safeParse(payload);

    if (canonicalResult.success) {
      const candidateInput = mapAgentPayloadToCandidateInput(canonicalResult.data);
      const candidate = await submitCandidateFromAgent(candidateInput);

      return NextResponse.json(
        { ok: true, data: candidate },
        { status: 200 }
      );
    }

    const legacyResult = legacyAgentSubmissionSchema.safeParse(payload);

    if (legacyResult.success) {
      const candidateInput = mapLegacyPayloadToCandidateInput(legacyResult.data);
      const candidate = await submitCandidateFromAgent(candidateInput);

      return NextResponse.json(
        { ok: true, data: candidate },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        error: {
          code: "INVALID_PAYLOAD",
          message: "Payload validation failed for both canonical and legacy formats.",
          details: {
            canonicalErrors: canonicalResult.error.format(),
            legacyErrors: legacyResult.error.format(),
          },
        },
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Agent Gateway Submission Error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to process agent submission." } },
      { status: 500 }
    );
  }
}
