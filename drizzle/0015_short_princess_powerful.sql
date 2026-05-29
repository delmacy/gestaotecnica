CREATE TABLE "workflow"."action_executions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"instance_id" uuid NOT NULL,
	"action_key" text NOT NULL,
	"actor_id" uuid,
	"input_payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"output_payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" text DEFAULT 'completed' NOT NULL,
	"error" text,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "workflow"."action_registry" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"input_schema" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"output_schema" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workflow"."field_definitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"key" text NOT NULL,
	"label" text NOT NULL,
	"type" text NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workflow"."form_fields" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form_id" uuid NOT NULL,
	"field_definition_id" uuid NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_required" text DEFAULT 'false' NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workflow"."forms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "workflow"."action_executions" ADD CONSTRAINT "action_executions_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspace"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow"."action_executions" ADD CONSTRAINT "action_executions_instance_id_process_instances_id_fk" FOREIGN KEY ("instance_id") REFERENCES "workflow"."process_instances"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow"."action_executions" ADD CONSTRAINT "action_executions_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "identity"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow"."action_registry" ADD CONSTRAINT "action_registry_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspace"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow"."field_definitions" ADD CONSTRAINT "field_definitions_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspace"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow"."form_fields" ADD CONSTRAINT "form_fields_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "workflow"."forms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow"."form_fields" ADD CONSTRAINT "form_fields_field_definition_id_field_definitions_id_fk" FOREIGN KEY ("field_definition_id") REFERENCES "workflow"."field_definitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow"."forms" ADD CONSTRAINT "forms_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspace"."workspaces"("id") ON DELETE no action ON UPDATE no action;