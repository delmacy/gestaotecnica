import { NextResponse } from "next/server";
import { z } from "zod";
import { submitCandidateFromAgent } from "@/features/platform/gateway/agent-gateway.service";

const agentSubmissionSchema = z.object({
  workspaceId: z.string().uuid("Invalid workspaceId. Must be a valid UUID."),
  name: z.string().min(1, "Candidate name is required."),
  description: z.string().optional(),
  proposedDefinition: z.record(z.string(), z.unknown()).default({}),
  evidence: z.record(z.string(), z.unknown()).default({}),
});

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
    const result = agentSubmissionSchema.safeParse(payload);

    if (!result.success) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_PAYLOAD",
            message: "Payload validation failed.",
            details: result.error.format(),
          },
        },
        { status: 400 }
      );
    }

    const candidate = await submitCandidateFromAgent(result.data);

    return NextResponse.json(
      { ok: true, data: candidate },
      { status: 200 }
    );
  } catch (error) {
    console.error("Agent Gateway Submission Error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to process agent submission." } },
      { status: 500 }
    );
  }
}
