import { getPlatformDb } from "@/db";
import { agentGatewaySubmissions } from "@/db/platform/schema";
import { eq } from "drizzle-orm";
import type {
  AgentGatewaySubmissionRecord,
  SubmissionStatus,
} from "./agent-gateway.types";

export async function createSubmission(
  data: Omit<
    AgentGatewaySubmissionRecord,
    "id" | "createdAt" | "updatedAt" | "receivedAt" | "sanitizedPayload"
  > & {
    sanitizedPayload: unknown;
  },
): Promise<AgentGatewaySubmissionRecord> {
  const db = getPlatformDb();

  const [inserted] = await db
    .insert(agentGatewaySubmissions)
    .values({
      workspaceId: data.workspaceId,
      correlationId: data.correlationId,
      idempotencyKey: data.idempotencyKey,
      requestStatus: data.requestStatus,
      candidateId: data.candidateId,
      source: data.source,
      payloadFormat: data.payloadFormat,
      sanitizedPayload: data.sanitizedPayload || {},
      errorCode: data.errorCode,
      errorMessage: data.errorMessage,
      processedAt: data.processedAt,
      receivedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return {
    ...inserted,
    requestStatus: inserted.requestStatus as SubmissionStatus,
    source: inserted.source as any,
    payloadFormat: inserted.payloadFormat as any,
    sanitizedPayload: inserted.sanitizedPayload as Record<string, unknown>,
  };
}

export async function findSubmissionByIdempotencyKey(
  idempotencyKey: string,
): Promise<AgentGatewaySubmissionRecord | null> {
  const db = getPlatformDb();

  const [submission] = await db
    .select()
    .from(agentGatewaySubmissions)
    .where(eq(agentGatewaySubmissions.idempotencyKey, idempotencyKey))
    .limit(1);

  if (!submission) {
    return null;
  }

  return {
    ...submission,
    requestStatus: submission.requestStatus as SubmissionStatus,
    source: submission.source as any,
    payloadFormat: submission.payloadFormat as any,
    sanitizedPayload: submission.sanitizedPayload as Record<string, unknown>,
  };
}

export async function getSubmissionByCorrelationId(
  correlationId: string,
): Promise<AgentGatewaySubmissionRecord | null> {
  const db = getPlatformDb();

  const [submission] = await db
    .select()
    .from(agentGatewaySubmissions)
    .where(eq(agentGatewaySubmissions.correlationId, correlationId))
    .limit(1);

  if (!submission) {
    return null;
  }

  return {
    ...submission,
    requestStatus: submission.requestStatus as SubmissionStatus,
    source: submission.source as any,
    payloadFormat: submission.payloadFormat as any,
    sanitizedPayload: submission.sanitizedPayload as Record<string, unknown>,
  };
}

export async function updateSubmissionStatus(
  id: string,
  update: {
    requestStatus: SubmissionStatus;
    candidateId?: string;
    errorCode?: string;
    errorMessage?: string;
    processedAt?: Date;
  },
): Promise<AgentGatewaySubmissionRecord | null> {
  const db = getPlatformDb();

  const [updated] = await db
    .update(agentGatewaySubmissions)
    .set({
      ...update,
      updatedAt: new Date(),
    })
    .where(eq(agentGatewaySubmissions.id, id))
    .returning();

  if (!updated) {
    return null;
  }

  return {
    ...updated,
    requestStatus: updated.requestStatus as SubmissionStatus,
    source: updated.source as any,
    payloadFormat: updated.payloadFormat as any,
    sanitizedPayload: updated.sanitizedPayload as Record<string, unknown>,
  };
}
