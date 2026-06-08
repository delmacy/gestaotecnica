import { getPlatformDb } from "@/db";
import { processCandidates } from "@/db/platform/schema/candidates";

export interface AgentCandidateSubmission {
  workspaceId: string;
  name: string;
  description?: string;
  proposedDefinition?: Record<string, unknown>;
  evidence?: Record<string, unknown>;
}

export async function submitCandidateFromAgent(payload: AgentCandidateSubmission) {
  const db = getPlatformDb();

  const [inserted] = await db
    .insert(processCandidates)
    .values({
      workspaceId: payload.workspaceId,
      name: payload.name,
      description: payload.description || null,
      proposedDefinition: payload.proposedDefinition || {},
      evidence: payload.evidence || {},
      status: "draft",
      origin: "agent",
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return inserted;
}
