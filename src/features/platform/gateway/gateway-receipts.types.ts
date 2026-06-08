import type { AgentSource, PayloadFormat, SubmissionStatus } from "./agent-gateway.types";

export interface ListGatewaySubmissionsOptions {
  status?: SubmissionStatus;
  source?: AgentSource;
  payloadFormat?: PayloadFormat;
  search?: string;
  limit?: number;
  offset?: number;
}
