CREATE TABLE "workflow"."flow_definitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"definition" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"is_active" text DEFAULT 'true' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workflow"."outbox_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"event_log_id" uuid NOT NULL,
	"topic" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"last_error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"processed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "workspace"."dynamic_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"entity_key" text NOT NULL,
	"data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workspace"."entity_definitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workspace"."field_definitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entity_id" uuid NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workspace"."organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "organizations_key_unique" UNIQUE("key")
);
--> statement-breakpoint
ALTER TABLE "asset_type_definitions" DROP CONSTRAINT "asset_type_definitions_workspace_id_workspaces_id_fk";
--> statement-breakpoint
ALTER TABLE "business_role_definitions" DROP CONSTRAINT "business_role_definitions_workspace_id_workspaces_id_fk";
--> statement-breakpoint
ALTER TABLE "document_template_definitions" DROP CONSTRAINT "document_template_definitions_workspace_id_workspaces_id_fk";
--> statement-breakpoint
ALTER TABLE "flow_runs" DROP CONSTRAINT "flow_runs_trigger_event_id_event_logs_id_fk";
--> statement-breakpoint
ALTER TABLE "flow_runs" DROP CONSTRAINT "flow_runs_workspace_id_workspaces_id_fk";
--> statement-breakpoint
ALTER TABLE "integration_commands" DROP CONSTRAINT "integration_commands_workspace_id_workspaces_id_fk";
--> statement-breakpoint
ALTER TABLE "report_template_definitions" DROP CONSTRAINT "report_template_definitions_workspace_id_workspaces_id_fk";
--> statement-breakpoint
ALTER TABLE "schedule_type_definitions" DROP CONSTRAINT "schedule_type_definitions_workspace_id_workspaces_id_fk";
--> statement-breakpoint
ALTER TABLE "service_order_type_definitions" DROP CONSTRAINT "service_order_type_definitions_workspace_id_workspaces_id_fk";
--> statement-breakpoint
ALTER TABLE "sla_policies" DROP CONSTRAINT "sla_policies_workspace_id_workspaces_id_fk";
--> statement-breakpoint
ALTER TABLE "user_role_assignments" DROP CONSTRAINT "user_role_assignments_workspace_id_workspaces_id_fk";
--> statement-breakpoint
ALTER TABLE "work_item_type_definitions" DROP CONSTRAINT "work_item_type_definitions_workspace_id_workspaces_id_fk";
--> statement-breakpoint
ALTER TABLE "workflow_instances" DROP CONSTRAINT "workflow_instances_workspace_id_workspaces_id_fk";
--> statement-breakpoint
ALTER TABLE "workflow_templates" DROP CONSTRAINT "workflow_templates_workspace_id_workspaces_id_fk";
--> statement-breakpoint
ALTER TABLE "workspace_module_configs" DROP CONSTRAINT "workspace_module_configs_workspace_id_workspaces_id_fk";
--> statement-breakpoint
ALTER TABLE "workspace_queues" DROP CONSTRAINT "workspace_queues_workspace_id_workspaces_id_fk";
--> statement-breakpoint
ALTER TABLE "workflow"."events" DROP CONSTRAINT "events_actor_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "workflow"."events" ADD COLUMN "entity_type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "workflow"."events" ADD COLUMN "entity_id" uuid;--> statement-breakpoint
ALTER TABLE "workflow"."events" ADD COLUMN "actor_type" text;--> statement-breakpoint
ALTER TABLE "workflow"."events" ADD COLUMN "source" text;--> statement-breakpoint
ALTER TABLE "workflow"."events" ADD COLUMN "correlation_id" text;--> statement-breakpoint
ALTER TABLE "workflow"."events" ADD COLUMN "causation_id" text;--> statement-breakpoint
ALTER TABLE "workflow"."forms" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "workflow"."process_versions" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "workspace"."workspaces" ADD COLUMN "organization_id" uuid;--> statement-breakpoint
ALTER TABLE "workspace"."workspaces" ADD COLUMN "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "workspace"."workspaces" ADD COLUMN "adaptation_key" text;--> statement-breakpoint
ALTER TABLE "workflow"."flow_definitions" ADD CONSTRAINT "flow_definitions_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspace"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow"."outbox_events" ADD CONSTRAINT "outbox_events_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspace"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow"."outbox_events" ADD CONSTRAINT "outbox_events_event_log_id_events_id_fk" FOREIGN KEY ("event_log_id") REFERENCES "workflow"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace"."dynamic_records" ADD CONSTRAINT "dynamic_records_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspace"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace"."entity_definitions" ADD CONSTRAINT "entity_definitions_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspace"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace"."field_definitions" ADD CONSTRAINT "field_definitions_entity_id_entity_definitions_id_fk" FOREIGN KEY ("entity_id") REFERENCES "workspace"."entity_definitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "flow_definitions_workspace_key_uidx" ON "workflow"."flow_definitions" USING btree ("workspace_id","key");--> statement-breakpoint
CREATE INDEX "flow_definitions_workspace_idx" ON "workflow"."flow_definitions" USING btree ("workspace_id");--> statement-breakpoint
CREATE UNIQUE INDEX "entity_definitions_workspace_key_uidx" ON "workspace"."entity_definitions" USING btree ("workspace_id","key");--> statement-breakpoint
CREATE INDEX "entity_definitions_workspace_idx" ON "workspace"."entity_definitions" USING btree ("workspace_id");--> statement-breakpoint
ALTER TABLE "asset_type_definitions" ADD CONSTRAINT "asset_type_definitions_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspace"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_role_definitions" ADD CONSTRAINT "business_role_definitions_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspace"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_template_definitions" ADD CONSTRAINT "document_template_definitions_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspace"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flow_runs" ADD CONSTRAINT "flow_runs_trigger_event_id_events_id_fk" FOREIGN KEY ("trigger_event_id") REFERENCES "workflow"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flow_runs" ADD CONSTRAINT "flow_runs_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspace"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "integration_commands" ADD CONSTRAINT "integration_commands_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspace"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_template_definitions" ADD CONSTRAINT "report_template_definitions_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspace"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedule_type_definitions" ADD CONSTRAINT "schedule_type_definitions_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspace"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_order_type_definitions" ADD CONSTRAINT "service_order_type_definitions_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspace"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sla_policies" ADD CONSTRAINT "sla_policies_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspace"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_role_assignments" ADD CONSTRAINT "user_role_assignments_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspace"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_item_type_definitions" ADD CONSTRAINT "work_item_type_definitions_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspace"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow_instances" ADD CONSTRAINT "workflow_instances_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspace"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow_templates" ADD CONSTRAINT "workflow_templates_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspace"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_module_configs" ADD CONSTRAINT "workspace_module_configs_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspace"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_queues" ADD CONSTRAINT "workspace_queues_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspace"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace"."workspaces" ADD CONSTRAINT "workspaces_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "workspace"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "forms_workspace_key_uidx" ON "workflow"."forms" USING btree ("workspace_id","key");--> statement-breakpoint
CREATE INDEX "forms_workspace_idx" ON "workflow"."forms" USING btree ("workspace_id");--> statement-breakpoint
CREATE UNIQUE INDEX "process_definitions_workspace_key_uidx" ON "workflow"."process_definitions" USING btree ("workspace_id","key");--> statement-breakpoint
CREATE INDEX "process_definitions_workspace_idx" ON "workflow"."process_definitions" USING btree ("workspace_id");--> statement-breakpoint
CREATE UNIQUE INDEX "process_versions_definition_version_uidx" ON "workflow"."process_versions" USING btree ("process_definition_id","version");--> statement-breakpoint
CREATE INDEX "process_versions_definition_idx" ON "workflow"."process_versions" USING btree ("process_definition_id");