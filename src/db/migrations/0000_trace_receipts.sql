CREATE SCHEMA IF NOT EXISTS "traceability";

CREATE TABLE IF NOT EXISTS "traceability"."receipts" (
	"id" text PRIMARY KEY NOT NULL,
	"workspace_id" uuid NOT NULL,
	"subject_type" text NOT NULL,
	"subject_id" text NOT NULL,
	"correlation_id" text NOT NULL,
	"previous_receipt_id" text,
	"causation_id" text,
	"data" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

DO $$ BEGIN
 ALTER TABLE "traceability"."receipts" ADD CONSTRAINT "receipts_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspace"."workspaces"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE INDEX IF NOT EXISTS "idx_trace_receipts_workspace_id" ON "traceability"."receipts" USING btree ("workspace_id");
CREATE INDEX IF NOT EXISTS "idx_trace_receipts_correlation_id" ON "traceability"."receipts" USING btree ("correlation_id");
CREATE INDEX IF NOT EXISTS "idx_trace_receipts_subject" ON "traceability"."receipts" USING btree ("subject_type","subject_id");
