CREATE TABLE IF NOT EXISTS "builder"."agent_gateway_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid,
	"correlation_id" text NOT NULL,
	"idempotency_key" text NOT NULL,
	"request_status" text NOT NULL,
	"candidate_id" uuid,
	"source" text DEFAULT 'unknown' NOT NULL,
	"payload_format" text NOT NULL,
	"sanitized_payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"error_code" text,
	"error_message" text,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL,
	"processed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "agent_gateway_submissions_correlation_id_unique" UNIQUE("correlation_id"),
	CONSTRAINT "agent_gateway_submissions_idempotency_key_unique" UNIQUE("idempotency_key")
);
