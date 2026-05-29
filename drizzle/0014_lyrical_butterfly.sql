CREATE SCHEMA "blueprints";
--> statement-breakpoint
CREATE SCHEMA "registry";
--> statement-breakpoint
CREATE SCHEMA "identity";
--> statement-breakpoint
CREATE SCHEMA "workflow";
--> statement-breakpoint
CREATE SCHEMA "workspace";
--> statement-breakpoint
CREATE TABLE "blueprints"."blueprint_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"blueprint_id" uuid NOT NULL,
	"version" text NOT NULL,
	"definition" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blueprints"."blueprints" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"category" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "blueprints_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "registry"."capabilities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "capabilities_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "registry"."module_capabilities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"module_id" uuid NOT NULL,
	"capability_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "registry"."module_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"module_id" uuid NOT NULL,
	"version" text NOT NULL,
	"config_schema" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"changelog" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "registry"."modules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "modules_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "identity"."permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role_id" uuid NOT NULL,
	"action" text NOT NULL,
	"resource" text NOT NULL,
	"effect" text DEFAULT 'allow' NOT NULL,
	"condition" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "identity"."roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "identity"."users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "workflow"."actions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"process_version_id" uuid NOT NULL,
	"transition_id" uuid,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"type" text DEFAULT 'manual' NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workflow"."events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"instance_id" uuid,
	"event_type" text NOT NULL,
	"actor_id" uuid,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workflow"."process_definitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"blueprint_key" text,
	"blueprint_version" text,
	"is_active" text DEFAULT 'true' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workflow"."process_instances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"process_version_id" uuid NOT NULL,
	"current_state_id" uuid,
	"status" text DEFAULT 'active' NOT NULL,
	"created_by_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workflow"."process_payloads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"instance_id" uuid NOT NULL,
	"workspace_id" uuid NOT NULL,
	"schema_version" text DEFAULT '1.0' NOT NULL,
	"data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workflow"."process_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"process_definition_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"definition" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workflow"."states" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"process_version_id" uuid NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"is_initial" text DEFAULT 'false' NOT NULL,
	"is_final" text DEFAULT 'false' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workflow"."transitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"process_version_id" uuid NOT NULL,
	"from_state_id" uuid,
	"to_state_id" uuid NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"trigger" text DEFAULT 'action' NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workspace"."workspace_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workspace"."workspaces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "workspaces_key_unique" UNIQUE("key")
);
--> statement-breakpoint
ALTER TABLE "blueprints"."blueprint_versions" ADD CONSTRAINT "blueprint_versions_blueprint_id_blueprints_id_fk" FOREIGN KEY ("blueprint_id") REFERENCES "blueprints"."blueprints"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registry"."module_capabilities" ADD CONSTRAINT "module_capabilities_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "registry"."modules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registry"."module_capabilities" ADD CONSTRAINT "module_capabilities_capability_id_capabilities_id_fk" FOREIGN KEY ("capability_id") REFERENCES "registry"."capabilities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registry"."module_versions" ADD CONSTRAINT "module_versions_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "registry"."modules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "identity"."permissions" ADD CONSTRAINT "permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "identity"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow"."actions" ADD CONSTRAINT "actions_process_version_id_process_versions_id_fk" FOREIGN KEY ("process_version_id") REFERENCES "workflow"."process_versions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow"."actions" ADD CONSTRAINT "actions_transition_id_transitions_id_fk" FOREIGN KEY ("transition_id") REFERENCES "workflow"."transitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow"."events" ADD CONSTRAINT "events_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspace"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow"."events" ADD CONSTRAINT "events_instance_id_process_instances_id_fk" FOREIGN KEY ("instance_id") REFERENCES "workflow"."process_instances"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow"."events" ADD CONSTRAINT "events_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "identity"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow"."process_definitions" ADD CONSTRAINT "process_definitions_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspace"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow"."process_instances" ADD CONSTRAINT "process_instances_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspace"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow"."process_instances" ADD CONSTRAINT "process_instances_process_version_id_process_versions_id_fk" FOREIGN KEY ("process_version_id") REFERENCES "workflow"."process_versions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow"."process_instances" ADD CONSTRAINT "process_instances_current_state_id_states_id_fk" FOREIGN KEY ("current_state_id") REFERENCES "workflow"."states"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow"."process_instances" ADD CONSTRAINT "process_instances_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "identity"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow"."process_payloads" ADD CONSTRAINT "process_payloads_instance_id_process_instances_id_fk" FOREIGN KEY ("instance_id") REFERENCES "workflow"."process_instances"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow"."process_payloads" ADD CONSTRAINT "process_payloads_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspace"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow"."process_versions" ADD CONSTRAINT "process_versions_process_definition_id_process_definitions_id_fk" FOREIGN KEY ("process_definition_id") REFERENCES "workflow"."process_definitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow"."states" ADD CONSTRAINT "states_process_version_id_process_versions_id_fk" FOREIGN KEY ("process_version_id") REFERENCES "workflow"."process_versions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow"."transitions" ADD CONSTRAINT "transitions_process_version_id_process_versions_id_fk" FOREIGN KEY ("process_version_id") REFERENCES "workflow"."process_versions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow"."transitions" ADD CONSTRAINT "transitions_from_state_id_states_id_fk" FOREIGN KEY ("from_state_id") REFERENCES "workflow"."states"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow"."transitions" ADD CONSTRAINT "transitions_to_state_id_states_id_fk" FOREIGN KEY ("to_state_id") REFERENCES "workflow"."states"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace"."workspace_members" ADD CONSTRAINT "workspace_members_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspace"."workspaces"("id") ON DELETE no action ON UPDATE no action;