CREATE TABLE "agent_work"."agent_review_claims" (
	"id" text PRIMARY KEY NOT NULL,
	"review_package_key" text NOT NULL,
	"reviewer_key" text NOT NULL,
	"review_type" text NOT NULL,
	"status" text NOT NULL,
	"claim_token_hash" text NOT NULL,
	"claimed_at" timestamp DEFAULT now() NOT NULL,
	"heartbeat_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"released_at" timestamp,
	"release_reason" text
);
--> statement-breakpoint
CREATE TABLE "agent_work"."agent_review_packages" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"work_package_key" text NOT NULL,
	"module_key" text NOT NULL,
	"lane_key" text NOT NULL,
	"wave_key" text NOT NULL,
	"pull_request" text,
	"base_sha" text NOT NULL,
	"head_sha" text NOT NULL,
	"status" text NOT NULL,
	"objective" text NOT NULL,
	"integration_risk" text NOT NULL,
	"changed_files" jsonb NOT NULL,
	"production_files" jsonb NOT NULL,
	"test_files" jsonb NOT NULL,
	"documentation_files" jsonb NOT NULL,
	"migration_files" jsonb NOT NULL,
	"generated_files" jsonb NOT NULL,
	"lockfiles" jsonb NOT NULL,
	"changed_lines_excluding_generated" integer NOT NULL,
	"contracts_consumed" jsonb NOT NULL,
	"contracts_produced" jsonb NOT NULL,
	"public_contracts_changed" jsonb NOT NULL,
	"known_consumers" jsonb NOT NULL,
	"direct_dependencies" jsonb NOT NULL,
	"review_types_required" jsonb NOT NULL,
	"review_budget" jsonb NOT NULL,
	"scope_check_result" text NOT NULL,
	"scope_exceeded_reasons" jsonb,
	"assigned_reviewer_key" text,
	"revision" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"started_at" timestamp,
	"completed_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "agent_work"."agent_contract_versions" ALTER COLUMN "version" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_active_claims" ADD COLUMN "resource_key" text;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_active_claims" ADD COLUMN "claim_token_hash" text NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_active_claims" ADD COLUMN "heartbeat_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_active_claims" ADD COLUMN "status" text NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_active_claims" ADD COLUMN "base_sha" text NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_active_claims" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_activity_receipts" ADD COLUMN "path" text NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_activity_receipts" ADD COLUMN "base_sha" text NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_activity_receipts" ADD COLUMN "head_sha" text NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_activity_receipts" ADD COLUMN "status" text NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_claim_history" ADD COLUMN "claimed_at" timestamp;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_claim_history" ADD COLUMN "heartbeat_at" timestamp;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_claim_history" ADD COLUMN "expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_claim_history" ADD COLUMN "released_at" timestamp;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_claim_history" ADD COLUMN "release_reason" text;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_claim_history" ADD COLUMN "event_type" text;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_claim_history" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_contract_versions" ADD COLUMN "status" text NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_contract_versions" ADD COLUMN "owner_module_key" text NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_contract_versions" ADD COLUMN "consumers" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_contract_versions" ADD COLUMN "content_path" text NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_contract_versions" ADD COLUMN "compatibility" text;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_contract_versions" ADD COLUMN "supersedes" text;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_contract_versions" ADD COLUMN "effective_from" timestamp;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_execution_waves" ADD COLUMN "objective" text NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_execution_waves" ADD COLUMN "base_branch" text NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_execution_waves" ADD COLUMN "base_sha" text NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_execution_waves" ADD COLUMN "integration_branch" text NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_execution_waves" ADD COLUMN "entry_gate" text;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_execution_waves" ADD COLUMN "exit_gate" text;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_execution_waves" ADD COLUMN "merge_policy" text;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_execution_waves" ADD COLUMN "rollback_plan" text;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_execution_waves" ADD COLUMN "revision" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_execution_waves" ADD COLUMN "started_at" timestamp;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_execution_waves" ADD COLUMN "finished_at" timestamp;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_execution_waves" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_integration_receipts" ADD COLUMN "path" text NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_integration_receipts" ADD COLUMN "base_sha" text NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_integration_receipts" ADD COLUMN "head_sha" text NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_module_paths" ADD COLUMN "allowed_role" text;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_module_paths" ADD COLUMN "change_request_required" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_module_paths" ADD COLUMN "integration_risk" text;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_module_paths" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_module_paths" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_module_paths" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_package_tasks" ADD COLUMN "key" text NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_package_tasks" ADD COLUMN "title" text NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_package_tasks" ADD COLUMN "task_type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_package_tasks" ADD COLUMN "acceptance_criteria" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_package_tasks" ADD COLUMN "expected_artifacts" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_package_tasks" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_package_tasks" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_path_claims" ADD COLUMN "wave_key" text NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_path_claims" ADD COLUMN "worker_key" text NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_path_claims" ADD COLUMN "path_pattern" text NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_path_claims" ADD COLUMN "ownership_mode" text NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_path_claims" ADD COLUMN "claimed_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_path_claims" ADD COLUMN "expires_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_path_claims" ADD COLUMN "status" text NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_work_events" ADD COLUMN "wave_key" text;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_work_events" ADD COLUMN "task_key" text;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_work_events" ADD COLUMN "actor_key" text;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_work_events" ADD COLUMN "message" text;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_work_events" ADD COLUMN "correlation_id" text;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_work_events" ADD COLUMN "causation_id" text;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_work_packages" ADD COLUMN "blocked_reason" text;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_work_packages" ADD COLUMN "security_gate" text;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_work_packages" ADD COLUMN "tenancy_gate" text;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_work_packages" ADD COLUMN "migration_gate" text;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_work_packages" ADD COLUMN "contracts_consumed" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_work_packages" ADD COLUMN "contracts_produced" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_work_packages" ADD COLUMN "public_contracts_changed" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_work_packages" ADD COLUMN "known_consumers" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_work_packages" ADD COLUMN "schema_impacts" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_work_packages" ADD COLUMN "review_budget" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_work_packages" ADD COLUMN "created_by" text NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_workers" ADD COLUMN "module_key" text;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_workers" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_workers" ADD COLUMN "max_active_claims" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_workers" ADD COLUMN "metadata" jsonb;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_workers" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_workers" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_review_claims" ADD CONSTRAINT "agent_review_claims_review_package_key_agent_review_packages_key_fk" FOREIGN KEY ("review_package_key") REFERENCES "agent_work"."agent_review_packages"("key") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_review_claims" ADD CONSTRAINT "agent_review_claims_reviewer_key_agent_workers_key_fk" FOREIGN KEY ("reviewer_key") REFERENCES "agent_work"."agent_workers"("key") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_review_packages" ADD CONSTRAINT "agent_review_packages_work_package_key_agent_work_packages_key_fk" FOREIGN KEY ("work_package_key") REFERENCES "agent_work"."agent_work_packages"("key") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_active_claims" ADD CONSTRAINT "agent_active_claims_package_key_unique" UNIQUE("package_key");--> statement-breakpoint
ALTER TABLE "agent_work"."agent_module_paths" ADD CONSTRAINT "agent_module_paths_module_key_path_pattern_unique" UNIQUE("module_key","path_pattern");--> statement-breakpoint
ALTER TABLE "agent_work"."agent_package_tasks" ADD CONSTRAINT "agent_package_tasks_package_key_key_unique" UNIQUE("package_key","key");