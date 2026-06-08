import { getPlatformDb } from "@/db";
import { agentGatewaySubmissions } from "@/db/platform/schema";
import { desc, eq, or, ilike, and } from "drizzle-orm";
import type { ListGatewaySubmissionsOptions } from "./gateway-receipts.types";
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
    source: inserted.source as import("./agent-gateway.types").AgentSource,
    payloadFormat: inserted.payloadFormat as import("./agent-gateway.types").PayloadFormat,
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
    source: submission.source as import("./agent-gateway.types").AgentSource,
    payloadFormat: submission.payloadFormat as import("./agent-gateway.types").PayloadFormat,
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
    source: submission.source as import("./agent-gateway.types").AgentSource,
    payloadFormat: submission.payloadFormat as import("./agent-gateway.types").PayloadFormat,
    sanitizedPayload: submission.sanitizedPayload as Record<string, unknown>,
  };
}

export async function listGatewaySubmissions(options: ListGatewaySubmissionsOptions = {}): Promise<AgentGatewaySubmissionRecord[]> {
  const db = getPlatformDb();

  const conditions = [];

  if (options.status) {
    conditions.push(eq(agentGatewaySubmissions.requestStatus, options.status));
  }

  if (options.source) {
    conditions.push(eq(agentGatewaySubmissions.source, options.source));
  }

  if (options.payloadFormat) {
    conditions.push(eq(agentGatewaySubmissions.payloadFormat, options.payloadFormat));
  }

  if (options.search) {
    const searchTerm = `%${options.search}%`;
    const searchCondition = or(
      ilike(agentGatewaySubmissions.correlationId, searchTerm),
      ilike(agentGatewaySubmissions.idempotencyKey, searchTerm)
    );
    conditions.push(searchCondition);
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const submissions = await db
    .select()
    .from(agentGatewaySubmissions)
    .where(whereClause)
    .orderBy(desc(agentGatewaySubmissions.receivedAt))
    .limit(options.limit ?? 100)
    .offset(options.offset ?? 0);

  return submissions.map((sub: any) => ({
    ...sub,
    requestStatus: sub.requestStatus as SubmissionStatus,
    source: sub.source as import("./agent-gateway.types").AgentSource,
    payloadFormat: sub.payloadFormat as import("./agent-gateway.types").PayloadFormat,
    sanitizedPayload: sub.sanitizedPayload as Record<string, unknown>,
  }));
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
    source: updated.source as import("./agent-gateway.types").AgentSource,
    payloadFormat: updated.payloadFormat as import("./agent-gateway.types").PayloadFormat,
    sanitizedPayload: updated.sanitizedPayload as Record<string, unknown>,
  };
}
