export type SubmissionStatus = "pending" | "success" | "failed" | "duplicate";

export type PayloadFormat = "canonical" | "legacy" | "invalid";

export type AgentSource =
  | "paperclip"
  | "n8n"
  | "manual_api"
  | "unknown"
  | "legacy";

export interface GatewayReceipt {
  correlationId: string;
  idempotencyKey: string;
  status: SubmissionStatus;
}

export interface AgentGatewaySubmissionRecord {
  id: string;
  workspaceId: string | null;
  correlationId: string;
  idempotencyKey: string;
  requestStatus: SubmissionStatus;
  candidateId: string | null;
  source: AgentSource;
  payloadFormat: PayloadFormat;
  sanitizedPayload: Record<string, unknown>;
  errorCode: string | null;
  errorMessage: string | null;
  receivedAt: Date;
  processedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
