import { jsonb, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { builderSchema } from "./candidates";

export const agentGatewaySubmissions = builderSchema.table(
  "agent_gateway_submissions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id"),
    correlationId: text("correlation_id").notNull().unique(),
    idempotencyKey: text("idempotency_key").notNull().unique(),
    requestStatus: text("request_status").notNull(), // 'pending', 'success', 'failed', 'duplicate'
    candidateId: uuid("candidate_id"), // logical reference to process_candidates.id
    source: text("source").notNull().default("unknown"), // 'paperclip', 'n8n', 'manual_api', 'unknown', 'legacy'
    payloadFormat: text("payload_format").notNull(), // 'canonical', 'legacy', 'invalid'
    sanitizedPayload: jsonb("sanitized_payload").notNull().default({}),
    errorCode: text("error_code"),
    errorMessage: text("error_message"),
    receivedAt: timestamp("received_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    processedAt: timestamp("processed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  }
);
