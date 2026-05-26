CREATE TYPE "public"."acquisition_status" AS ENUM('identified', 'justified', 'requested', 'approved', 'ordered', 'received', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."planning_status" AS ENUM('draft', 'proposed', 'approved', 'in_progress', 'completed', 'cancelled');--> statement-breakpoint
CREATE TABLE "acquisition_needs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"status" "acquisition_status" DEFAULT 'identified' NOT NULL,
	"priority" "priority" DEFAULT 'medium' NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"estimated_cost_cents" integer,
	"justification" text,
	"asset_id" uuid,
	"service_order_id" uuid,
	"project_id" uuid,
	"requested_by_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "maintenance_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"status" "planning_status" DEFAULT 'draft' NOT NULL,
	"priority" "priority" DEFAULT 'medium' NOT NULL,
	"asset_id" uuid,
	"owner_team_id" uuid,
	"period_start" timestamp with time zone,
	"period_end" timestamp with time zone,
	"objective" text,
	"checklist" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "technical_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"status" "planning_status" DEFAULT 'draft' NOT NULL,
	"priority" "priority" DEFAULT 'medium' NOT NULL,
	"sponsor" text,
	"asset_id" uuid,
	"work_item_id" uuid,
	"starts_at" timestamp with time zone,
	"target_ends_at" timestamp with time zone,
	"objective" text,
	"scope" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "acquisition_needs" ADD CONSTRAINT "acquisition_needs_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "acquisition_needs" ADD CONSTRAINT "acquisition_needs_service_order_id_service_orders_id_fk" FOREIGN KEY ("service_order_id") REFERENCES "public"."service_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "acquisition_needs" ADD CONSTRAINT "acquisition_needs_project_id_technical_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."technical_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "acquisition_needs" ADD CONSTRAINT "acquisition_needs_requested_by_id_users_id_fk" FOREIGN KEY ("requested_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenance_plans" ADD CONSTRAINT "maintenance_plans_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenance_plans" ADD CONSTRAINT "maintenance_plans_owner_team_id_teams_id_fk" FOREIGN KEY ("owner_team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "technical_projects" ADD CONSTRAINT "technical_projects_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "technical_projects" ADD CONSTRAINT "technical_projects_work_item_id_work_items_id_fk" FOREIGN KEY ("work_item_id") REFERENCES "public"."work_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "acquisition_needs_status_idx" ON "acquisition_needs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "acquisition_needs_asset_id_idx" ON "acquisition_needs" USING btree ("asset_id");--> statement-breakpoint
CREATE INDEX "acquisition_needs_project_id_idx" ON "acquisition_needs" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "maintenance_plans_status_idx" ON "maintenance_plans" USING btree ("status");--> statement-breakpoint
CREATE INDEX "maintenance_plans_asset_id_idx" ON "maintenance_plans" USING btree ("asset_id");--> statement-breakpoint
CREATE INDEX "technical_projects_status_idx" ON "technical_projects" USING btree ("status");--> statement-breakpoint
CREATE INDEX "technical_projects_asset_id_idx" ON "technical_projects" USING btree ("asset_id");