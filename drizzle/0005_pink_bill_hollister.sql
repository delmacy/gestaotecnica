CREATE TABLE "asset_type_definitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"key" text NOT NULL,
	"label" text NOT NULL,
	"tracks_maintenance" boolean DEFAULT true NOT NULL,
	"tracks_location" boolean DEFAULT true NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "business_role_definitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"key" text NOT NULL,
	"label" text NOT NULL,
	"legacy_level" text,
	"can_execute_service_order" boolean DEFAULT false NOT NULL,
	"requires_supervision" boolean DEFAULT false NOT NULL,
	"can_approve" boolean DEFAULT false NOT NULL,
	"can_assign_service_order" boolean DEFAULT false NOT NULL,
	"can_review_shift_log" boolean DEFAULT false NOT NULL,
	"can_validate_technical_work" boolean DEFAULT false NOT NULL,
	"can_prepare_documents" boolean DEFAULT false NOT NULL,
	"can_review_completeness" boolean DEFAULT false NOT NULL,
	"can_plan_maintenance" boolean DEFAULT false NOT NULL,
	"can_manage_acquisitions" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "document_template_definitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"key" text NOT NULL,
	"label" text NOT NULL,
	"target" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "report_template_definitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"key" text NOT NULL,
	"label" text NOT NULL,
	"target" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "schedule_type_definitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"key" text NOT NULL,
	"label" text NOT NULL,
	"description" text,
	"requires_shift_log" boolean DEFAULT false NOT NULL,
	"receives_tickets" jsonb DEFAULT 'false'::jsonb NOT NULL,
	"receives_service_orders" jsonb DEFAULT 'false'::jsonb NOT NULL,
	"allows_overlap" boolean DEFAULT true NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_order_type_definitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"key" text NOT NULL,
	"label" text NOT NULL,
	"description" text,
	"requires_asset" boolean DEFAULT false NOT NULL,
	"requires_time_entry" boolean DEFAULT true NOT NULL,
	"requires_evidence" boolean DEFAULT false NOT NULL,
	"requires_supervisor_approval" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "work_item_type_definitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"key" text NOT NULL,
	"label" text NOT NULL,
	"description" text,
	"default_priority" "priority" DEFAULT 'medium' NOT NULL,
	"default_queue" text,
	"can_generate_service_order" boolean DEFAULT true NOT NULL,
	"can_appear_in_shift_log" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workflow_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"key" text NOT NULL,
	"label" text NOT NULL,
	"target" text NOT NULL,
	"states" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workspace_module_configs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"module_key" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"layer" text DEFAULT 'module' NOT NULL,
	"status" text DEFAULT 'planned' NOT NULL,
	"is_enabled" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workspace_queues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"key" text NOT NULL,
	"label" text NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workspaces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"adaptation_key" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "asset_type_definitions" ADD CONSTRAINT "asset_type_definitions_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_role_definitions" ADD CONSTRAINT "business_role_definitions_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_template_definitions" ADD CONSTRAINT "document_template_definitions_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_template_definitions" ADD CONSTRAINT "report_template_definitions_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedule_type_definitions" ADD CONSTRAINT "schedule_type_definitions_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_order_type_definitions" ADD CONSTRAINT "service_order_type_definitions_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_item_type_definitions" ADD CONSTRAINT "work_item_type_definitions_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow_templates" ADD CONSTRAINT "workflow_templates_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_module_configs" ADD CONSTRAINT "workspace_module_configs_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_queues" ADD CONSTRAINT "workspace_queues_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "asset_type_definitions_workspace_key_uidx" ON "asset_type_definitions" USING btree ("workspace_id","key");--> statement-breakpoint
CREATE INDEX "asset_type_definitions_workspace_idx" ON "asset_type_definitions" USING btree ("workspace_id");--> statement-breakpoint
CREATE UNIQUE INDEX "business_role_definitions_workspace_key_uidx" ON "business_role_definitions" USING btree ("workspace_id","key");--> statement-breakpoint
CREATE INDEX "business_role_definitions_workspace_idx" ON "business_role_definitions" USING btree ("workspace_id");--> statement-breakpoint
CREATE UNIQUE INDEX "document_template_definitions_workspace_key_uidx" ON "document_template_definitions" USING btree ("workspace_id","key");--> statement-breakpoint
CREATE INDEX "document_template_definitions_workspace_idx" ON "document_template_definitions" USING btree ("workspace_id");--> statement-breakpoint
CREATE UNIQUE INDEX "report_template_definitions_workspace_key_uidx" ON "report_template_definitions" USING btree ("workspace_id","key");--> statement-breakpoint
CREATE INDEX "report_template_definitions_workspace_idx" ON "report_template_definitions" USING btree ("workspace_id");--> statement-breakpoint
CREATE UNIQUE INDEX "schedule_type_definitions_workspace_key_uidx" ON "schedule_type_definitions" USING btree ("workspace_id","key");--> statement-breakpoint
CREATE INDEX "schedule_type_definitions_workspace_idx" ON "schedule_type_definitions" USING btree ("workspace_id");--> statement-breakpoint
CREATE UNIQUE INDEX "service_order_type_definitions_workspace_key_uidx" ON "service_order_type_definitions" USING btree ("workspace_id","key");--> statement-breakpoint
CREATE INDEX "service_order_type_definitions_workspace_idx" ON "service_order_type_definitions" USING btree ("workspace_id");--> statement-breakpoint
CREATE UNIQUE INDEX "work_item_type_definitions_workspace_key_uidx" ON "work_item_type_definitions" USING btree ("workspace_id","key");--> statement-breakpoint
CREATE INDEX "work_item_type_definitions_workspace_idx" ON "work_item_type_definitions" USING btree ("workspace_id");--> statement-breakpoint
CREATE UNIQUE INDEX "workflow_templates_workspace_key_uidx" ON "workflow_templates" USING btree ("workspace_id","key");--> statement-breakpoint
CREATE INDEX "workflow_templates_workspace_idx" ON "workflow_templates" USING btree ("workspace_id");--> statement-breakpoint
CREATE UNIQUE INDEX "workspace_module_configs_workspace_module_uidx" ON "workspace_module_configs" USING btree ("workspace_id","module_key");--> statement-breakpoint
CREATE INDEX "workspace_module_configs_workspace_idx" ON "workspace_module_configs" USING btree ("workspace_id");--> statement-breakpoint
CREATE UNIQUE INDEX "workspace_queues_workspace_key_uidx" ON "workspace_queues" USING btree ("workspace_id","key");--> statement-breakpoint
CREATE INDEX "workspace_queues_workspace_idx" ON "workspace_queues" USING btree ("workspace_id");--> statement-breakpoint
CREATE UNIQUE INDEX "workspaces_key_uidx" ON "workspaces" USING btree ("key");--> statement-breakpoint
CREATE INDEX "workspaces_active_idx" ON "workspaces" USING btree ("is_active");