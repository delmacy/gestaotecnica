CREATE SCHEMA IF NOT EXISTS "agent_work";
--> statement-breakpoint
CREATE TABLE "agent_work"."agent_active_claims" (
	"id" text PRIMARY KEY NOT NULL,
	"package_key" text NOT NULL,
	"worker_key" text NOT NULL,
	"claimed_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "agent_work"."agent_activity_receipts" (
	"id" text PRIMARY KEY NOT NULL,
	"package_key" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "agent_work"."agent_artifacts" (
	"id" text PRIMARY KEY NOT NULL,
	"package_key" text NOT NULL,
	"path" text NOT NULL,
	"hash" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "agent_work"."agent_claim_history" (
	"id" text PRIMARY KEY NOT NULL,
	"package_key" text NOT NULL,
	"worker_key" text NOT NULL,
	"action" text NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "agent_work"."agent_collision_results" (
	"id" text PRIMARY KEY NOT NULL,
	"wave_key" text NOT NULL,
	"package_key_1" text NOT NULL,
	"package_key_2" text NOT NULL,
	"status" text NOT NULL,
	"reason" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "agent_work"."agent_commands" (
	"id" text PRIMARY KEY NOT NULL,
	"package_key" text NOT NULL,
	"command_string" text NOT NULL,
	"execution_status" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "agent_work"."agent_contract_versions" (
	"id" text PRIMARY KEY NOT NULL,
	"contract_name" text NOT NULL,
	"version" integer NOT NULL,
	"hash" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "agent_work"."agent_decisions" (
	"id" text PRIMARY KEY NOT NULL,
	"package_key" text NOT NULL,
	"decision" text NOT NULL,
	"rationale" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "agent_work"."agent_documentation_impacts" (
	"id" text PRIMARY KEY NOT NULL,
	"package_key" text NOT NULL,
	"doc_path" text NOT NULL,
	"impact_description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "agent_work"."agent_execution_waves" (
	"key" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"status" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "agent_work"."agent_handoffs" (
	"id" text PRIMARY KEY NOT NULL,
	"from_worker_key" text NOT NULL,
	"to_worker_key" text NOT NULL,
	"package_key" text NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "agent_work"."agent_integration_receipts" (
	"id" text PRIMARY KEY NOT NULL,
	"wave_key" text NOT NULL,
	"status" text NOT NULL,
	"log" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "agent_work"."agent_module_paths" (
	"id" text PRIMARY KEY NOT NULL,
	"module_key" text NOT NULL,
	"path_pattern" text NOT NULL,
	"ownership_type" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "agent_work"."agent_modules" (
	"key" text PRIMARY KEY NOT NULL,
	"classification" text NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "agent_work"."agent_package_dependencies" (
	"id" text PRIMARY KEY NOT NULL,
	"dependent_package_key" text NOT NULL,
	"required_package_key" text NOT NULL,
	"status" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "agent_work"."agent_package_tasks" (
	"id" text PRIMARY KEY NOT NULL,
	"package_key" text NOT NULL,
	"description" text NOT NULL,
	"order" integer NOT NULL,
	"status" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "agent_work"."agent_path_claims" (
	"id" text PRIMARY KEY NOT NULL,
	"path" text NOT NULL,
	"package_key" text NOT NULL,
	"claim_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "agent_work"."agent_reviews" (
	"id" text PRIMARY KEY NOT NULL,
	"package_key" text NOT NULL,
	"reviewer_worker_key" text NOT NULL,
	"status" text NOT NULL,
	"comments" text
);
--> statement-breakpoint
CREATE TABLE "agent_work"."agent_work_events" (
	"id" text PRIMARY KEY NOT NULL,
	"package_key" text,
	"worker_key" text,
	"event_type" text NOT NULL,
	"payload" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "agent_work"."agent_work_packages" (
	"key" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"module_key" text NOT NULL,
	"lane_key" text NOT NULL,
	"worker_role" text NOT NULL,
	"wave_key" text NOT NULL,
	"package_size" text NOT NULL,
	"priority" integer NOT NULL,
	"status" text NOT NULL,
	"objective" text NOT NULL,
	"expected_outcome" text NOT NULL,
	"entry_gate" text,
	"exit_gate" text,
	"base_branch" text NOT NULL,
	"base_sha" text NOT NULL,
	"target_branch" text NOT NULL,
	"integration_branch" text NOT NULL,
	"owned_paths" jsonb NOT NULL,
	"read_only_paths" jsonb NOT NULL,
	"forbidden_paths" jsonb NOT NULL,
	"read_first" jsonb NOT NULL,
	"required_tests" jsonb NOT NULL,
	"acceptance_criteria" jsonb NOT NULL,
	"documentation_impacts" jsonb NOT NULL,
	"integration_risk" text NOT NULL,
	"merge_order" integer NOT NULL,
	"rollback_notes" text,
	"assigned_worker_key" text,
	"revision" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"started_at" timestamp,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "agent_work"."agent_workers" (
	"key" text PRIMARY KEY NOT NULL,
	"role" text NOT NULL,
	"status" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "agent_work"."agent_active_claims" ADD CONSTRAINT "agent_active_claims_package_key_agent_work_packages_key_fk" FOREIGN KEY ("package_key") REFERENCES "agent_work"."agent_work_packages"("key") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_active_claims" ADD CONSTRAINT "agent_active_claims_worker_key_agent_workers_key_fk" FOREIGN KEY ("worker_key") REFERENCES "agent_work"."agent_workers"("key") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_activity_receipts" ADD CONSTRAINT "agent_activity_receipts_package_key_agent_work_packages_key_fk" FOREIGN KEY ("package_key") REFERENCES "agent_work"."agent_work_packages"("key") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_artifacts" ADD CONSTRAINT "agent_artifacts_package_key_agent_work_packages_key_fk" FOREIGN KEY ("package_key") REFERENCES "agent_work"."agent_work_packages"("key") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_commands" ADD CONSTRAINT "agent_commands_package_key_agent_work_packages_key_fk" FOREIGN KEY ("package_key") REFERENCES "agent_work"."agent_work_packages"("key") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_decisions" ADD CONSTRAINT "agent_decisions_package_key_agent_work_packages_key_fk" FOREIGN KEY ("package_key") REFERENCES "agent_work"."agent_work_packages"("key") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_documentation_impacts" ADD CONSTRAINT "agent_documentation_impacts_package_key_agent_work_packages_key_fk" FOREIGN KEY ("package_key") REFERENCES "agent_work"."agent_work_packages"("key") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_handoffs" ADD CONSTRAINT "agent_handoffs_package_key_agent_work_packages_key_fk" FOREIGN KEY ("package_key") REFERENCES "agent_work"."agent_work_packages"("key") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_module_paths" ADD CONSTRAINT "agent_module_paths_module_key_agent_modules_key_fk" FOREIGN KEY ("module_key") REFERENCES "agent_work"."agent_modules"("key") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_package_dependencies" ADD CONSTRAINT "agent_package_dependencies_dependent_package_key_agent_work_packages_key_fk" FOREIGN KEY ("dependent_package_key") REFERENCES "agent_work"."agent_work_packages"("key") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_package_dependencies" ADD CONSTRAINT "agent_package_dependencies_required_package_key_agent_work_packages_key_fk" FOREIGN KEY ("required_package_key") REFERENCES "agent_work"."agent_work_packages"("key") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_package_tasks" ADD CONSTRAINT "agent_package_tasks_package_key_agent_work_packages_key_fk" FOREIGN KEY ("package_key") REFERENCES "agent_work"."agent_work_packages"("key") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_path_claims" ADD CONSTRAINT "agent_path_claims_package_key_agent_work_packages_key_fk" FOREIGN KEY ("package_key") REFERENCES "agent_work"."agent_work_packages"("key") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_path_claims" ADD CONSTRAINT "agent_path_claims_claim_id_agent_active_claims_id_fk" FOREIGN KEY ("claim_id") REFERENCES "agent_work"."agent_active_claims"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_reviews" ADD CONSTRAINT "agent_reviews_package_key_agent_work_packages_key_fk" FOREIGN KEY ("package_key") REFERENCES "agent_work"."agent_work_packages"("key") ON DELETE no action ON UPDATE no action;
