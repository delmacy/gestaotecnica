CREATE TYPE "public"."automation_status" AS ENUM('draft', 'active', 'paused', 'failed', 'retired');--> statement-breakpoint
CREATE TYPE "public"."resource_need_status" AS ENUM('identified', 'prioritized', 'approved', 'in_progress', 'fulfilled', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."skill_proficiency" AS ENUM('basic', 'intermediate', 'advanced', 'expert');--> statement-breakpoint
CREATE TYPE "public"."training_status" AS ENUM('planned', 'in_progress', 'completed', 'expired', 'cancelled');--> statement-breakpoint
CREATE TABLE "automation_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"trigger_type" text NOT NULL,
	"status" "automation_status" DEFAULT 'draft' NOT NULL,
	"provider" text,
	"endpoint_url" text,
	"schedule_expression" text,
	"description" text,
	"last_run_at" timestamp with time zone,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resource_needs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"category" text,
	"status" "resource_need_status" DEFAULT 'identified' NOT NULL,
	"priority" "priority" DEFAULT 'medium' NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"justification" text,
	"asset_id" uuid,
	"project_id" uuid,
	"acquisition_need_id" uuid,
	"owner_team_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skill_catalog" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"category" text,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "technician_skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"technician_profile_id" uuid NOT NULL,
	"skill_id" uuid NOT NULL,
	"proficiency" "skill_proficiency" DEFAULT 'basic' NOT NULL,
	"certified_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "training_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"technician_profile_id" uuid,
	"skill_id" uuid,
	"title" text NOT NULL,
	"provider" text,
	"status" "training_status" DEFAULT 'planned' NOT NULL,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "resource_needs" ADD CONSTRAINT "resource_needs_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource_needs" ADD CONSTRAINT "resource_needs_project_id_technical_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."technical_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource_needs" ADD CONSTRAINT "resource_needs_acquisition_need_id_acquisition_needs_id_fk" FOREIGN KEY ("acquisition_need_id") REFERENCES "public"."acquisition_needs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource_needs" ADD CONSTRAINT "resource_needs_owner_team_id_teams_id_fk" FOREIGN KEY ("owner_team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "technician_skills" ADD CONSTRAINT "technician_skills_technician_profile_id_technician_profiles_id_fk" FOREIGN KEY ("technician_profile_id") REFERENCES "public"."technician_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "technician_skills" ADD CONSTRAINT "technician_skills_skill_id_skill_catalog_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skill_catalog"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_records" ADD CONSTRAINT "training_records_technician_profile_id_technician_profiles_id_fk" FOREIGN KEY ("technician_profile_id") REFERENCES "public"."technician_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_records" ADD CONSTRAINT "training_records_skill_id_skill_catalog_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skill_catalog"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "automation_rules_status_idx" ON "automation_rules" USING btree ("status");--> statement-breakpoint
CREATE INDEX "automation_rules_trigger_type_idx" ON "automation_rules" USING btree ("trigger_type");--> statement-breakpoint
CREATE INDEX "resource_needs_status_idx" ON "resource_needs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "resource_needs_asset_id_idx" ON "resource_needs" USING btree ("asset_id");--> statement-breakpoint
CREATE INDEX "resource_needs_project_id_idx" ON "resource_needs" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "skill_catalog_name_idx" ON "skill_catalog" USING btree ("name");--> statement-breakpoint
CREATE INDEX "skill_catalog_category_idx" ON "skill_catalog" USING btree ("category");--> statement-breakpoint
CREATE INDEX "technician_skills_technician_id_idx" ON "technician_skills" USING btree ("technician_profile_id");--> statement-breakpoint
CREATE INDEX "technician_skills_skill_id_idx" ON "technician_skills" USING btree ("skill_id");--> statement-breakpoint
CREATE INDEX "training_records_status_idx" ON "training_records" USING btree ("status");--> statement-breakpoint
CREATE INDEX "training_records_technician_id_idx" ON "training_records" USING btree ("technician_profile_id");--> statement-breakpoint
CREATE INDEX "training_records_skill_id_idx" ON "training_records" USING btree ("skill_id");