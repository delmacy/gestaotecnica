CREATE TABLE "flow_action_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"flow_run_id" uuid NOT NULL,
	"action_key" text NOT NULL,
	"status" text DEFAULT 'running' NOT NULL,
	"input_payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"output_payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"error_payload" jsonb,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp with time zone,
	"duration_ms" integer
);
--> statement-breakpoint
CREATE TABLE "flow_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid,
	"flow_key" text NOT NULL,
	"flow_name" text NOT NULL,
	"flow_version" text,
	"trigger_event_id" uuid,
	"trigger_event_type" text NOT NULL,
	"status" text DEFAULT 'running' NOT NULL,
	"correlation_id" text NOT NULL,
	"skipped_reason" text,
	"error_payload" jsonb,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp with time zone,
	"duration_ms" integer
);
--> statement-breakpoint
CREATE TABLE "integration_commands" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid,
	"workspace_key" text NOT NULL,
	"command" text NOT NULL,
	"status" text DEFAULT 'received' NOT NULL,
	"source" text DEFAULT 'integration' NOT NULL,
	"actor_type" text DEFAULT 'api_key' NOT NULL,
	"actor_id" text,
	"idempotency_key" text,
	"correlation_id" text NOT NULL,
	"request_payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"response_payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"error_payload" jsonb,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "outbox_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid,
	"event_log_id" uuid,
	"topic" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"last_error" text,
	"available_at" timestamp with time zone DEFAULT now() NOT NULL,
	"processed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "event_logs" ADD COLUMN "workspace_id" uuid;--> statement-breakpoint
ALTER TABLE "event_logs" ADD COLUMN "actor_type" text;--> statement-breakpoint
ALTER TABLE "event_logs" ADD COLUMN "source" text;--> statement-breakpoint
ALTER TABLE "event_logs" ADD COLUMN "correlation_id" text;--> statement-breakpoint
ALTER TABLE "event_logs" ADD COLUMN "causation_id" text;--> statement-breakpoint
ALTER TABLE "flow_action_runs" ADD CONSTRAINT "flow_action_runs_flow_run_id_flow_runs_id_fk" FOREIGN KEY ("flow_run_id") REFERENCES "public"."flow_runs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flow_runs" ADD CONSTRAINT "flow_runs_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flow_runs" ADD CONSTRAINT "flow_runs_trigger_event_id_event_logs_id_fk" FOREIGN KEY ("trigger_event_id") REFERENCES "public"."event_logs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "integration_commands" ADD CONSTRAINT "integration_commands_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outbox_events" ADD CONSTRAINT "outbox_events_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outbox_events" ADD CONSTRAINT "outbox_events_event_log_id_event_logs_id_fk" FOREIGN KEY ("event_log_id") REFERENCES "public"."event_logs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "flow_action_runs_flow_run_idx" ON "flow_action_runs" USING btree ("flow_run_id");--> statement-breakpoint
CREATE INDEX "flow_action_runs_action_key_idx" ON "flow_action_runs" USING btree ("action_key");--> statement-breakpoint
CREATE INDEX "flow_action_runs_status_idx" ON "flow_action_runs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "flow_runs_workspace_idx" ON "flow_runs" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "flow_runs_flow_key_idx" ON "flow_runs" USING btree ("flow_key");--> statement-breakpoint
CREATE INDEX "flow_runs_status_idx" ON "flow_runs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "flow_runs_correlation_idx" ON "flow_runs" USING btree ("correlation_id");--> statement-breakpoint
CREATE INDEX "flow_runs_trigger_event_idx" ON "flow_runs" USING btree ("trigger_event_id");--> statement-breakpoint
CREATE UNIQUE INDEX "integration_commands_workspace_idempotency_uidx" ON "integration_commands" USING btree ("workspace_key","idempotency_key");--> statement-breakpoint
CREATE INDEX "integration_commands_workspace_idx" ON "integration_commands" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "integration_commands_command_idx" ON "integration_commands" USING btree ("command");--> statement-breakpoint
CREATE INDEX "integration_commands_status_idx" ON "integration_commands" USING btree ("status");--> statement-breakpoint
CREATE INDEX "integration_commands_correlation_idx" ON "integration_commands" USING btree ("correlation_id");--> statement-breakpoint
CREATE INDEX "outbox_events_workspace_idx" ON "outbox_events" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "outbox_events_event_log_idx" ON "outbox_events" USING btree ("event_log_id");--> statement-breakpoint
CREATE INDEX "outbox_events_topic_idx" ON "outbox_events" USING btree ("topic");--> statement-breakpoint
CREATE INDEX "outbox_events_status_idx" ON "outbox_events" USING btree ("status");--> statement-breakpoint
CREATE INDEX "outbox_events_available_at_idx" ON "outbox_events" USING btree ("available_at");--> statement-breakpoint
ALTER TABLE "event_logs" ADD CONSTRAINT "event_logs_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "event_logs_workspace_idx" ON "event_logs" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "event_logs_correlation_idx" ON "event_logs" USING btree ("correlation_id");