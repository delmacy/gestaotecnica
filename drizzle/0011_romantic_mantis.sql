CREATE TABLE "automation_run_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"automation_run_id" uuid NOT NULL,
	"level" text DEFAULT 'info' NOT NULL,
	"message" text NOT NULL,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "automation_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"automation_rule_id" uuid NOT NULL,
	"status" text DEFAULT 'queued' NOT NULL,
	"trigger_source" text DEFAULT 'manual' NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp with time zone,
	"duration_ms" integer,
	"request_payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"response_payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"error_message" text,
	"created_by_id" uuid
);
--> statement-breakpoint
ALTER TABLE "automation_run_logs" ADD CONSTRAINT "automation_run_logs_automation_run_id_automation_runs_id_fk" FOREIGN KEY ("automation_run_id") REFERENCES "public"."automation_runs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "automation_runs" ADD CONSTRAINT "automation_runs_automation_rule_id_automation_rules_id_fk" FOREIGN KEY ("automation_rule_id") REFERENCES "public"."automation_rules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "automation_runs" ADD CONSTRAINT "automation_runs_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "automation_run_logs_run_idx" ON "automation_run_logs" USING btree ("automation_run_id");--> statement-breakpoint
CREATE INDEX "automation_run_logs_occurred_at_idx" ON "automation_run_logs" USING btree ("occurred_at");--> statement-breakpoint
CREATE INDEX "automation_runs_rule_idx" ON "automation_runs" USING btree ("automation_rule_id");--> statement-breakpoint
CREATE INDEX "automation_runs_status_idx" ON "automation_runs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "automation_runs_started_at_idx" ON "automation_runs" USING btree ("started_at");