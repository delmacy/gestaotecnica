CREATE TYPE "public"."document_status" AS ENUM('draft', 'prepared_by_secretary', 'waiting_technician_review', 'waiting_supervisor_approval', 'approved', 'signed', 'exported_to_legacy', 'archived', 'returned_for_correction');--> statement-breakpoint
CREATE TYPE "public"."legacy_sync_status" AS ENUM('pending', 'prepared', 'exported', 'confirmed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."schedule_status" AS ENUM('planned', 'confirmed', 'cancelled', 'completed');--> statement-breakpoint
CREATE TYPE "public"."schedule_type" AS ENUM('expediente', 'plantao', 'sobreaviso', 'ausencia');--> statement-breakpoint
CREATE TABLE "legacy_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"system_name" text NOT NULL,
	"protocol_number" text,
	"external_record_id" text,
	"external_status" text,
	"sync_status" "legacy_sync_status" DEFAULT 'pending' NOT NULL,
	"service_order_id" uuid,
	"work_item_id" uuid,
	"asset_id" uuid,
	"document_id" uuid,
	"exported_at" timestamp with time zone,
	"notes" text,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "schedules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"technician_profile_id" uuid,
	"team_id" uuid,
	"title" text NOT NULL,
	"type" "schedule_type" DEFAULT 'expediente' NOT NULL,
	"status" "schedule_status" DEFAULT 'planned' NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "technical_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"document_type" text DEFAULT 'technical_report' NOT NULL,
	"status" "document_status" DEFAULT 'draft' NOT NULL,
	"service_order_id" uuid,
	"work_item_id" uuid,
	"asset_id" uuid,
	"content" text,
	"prepared_by_id" uuid,
	"reviewed_by_id" uuid,
	"approved_by_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "legacy_records" ADD CONSTRAINT "legacy_records_service_order_id_service_orders_id_fk" FOREIGN KEY ("service_order_id") REFERENCES "public"."service_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "legacy_records" ADD CONSTRAINT "legacy_records_work_item_id_work_items_id_fk" FOREIGN KEY ("work_item_id") REFERENCES "public"."work_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "legacy_records" ADD CONSTRAINT "legacy_records_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "legacy_records" ADD CONSTRAINT "legacy_records_document_id_technical_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."technical_documents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_technician_profile_id_technician_profiles_id_fk" FOREIGN KEY ("technician_profile_id") REFERENCES "public"."technician_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "technical_documents" ADD CONSTRAINT "technical_documents_service_order_id_service_orders_id_fk" FOREIGN KEY ("service_order_id") REFERENCES "public"."service_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "technical_documents" ADD CONSTRAINT "technical_documents_work_item_id_work_items_id_fk" FOREIGN KEY ("work_item_id") REFERENCES "public"."work_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "technical_documents" ADD CONSTRAINT "technical_documents_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "technical_documents" ADD CONSTRAINT "technical_documents_prepared_by_id_users_id_fk" FOREIGN KEY ("prepared_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "technical_documents" ADD CONSTRAINT "technical_documents_reviewed_by_id_users_id_fk" FOREIGN KEY ("reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "technical_documents" ADD CONSTRAINT "technical_documents_approved_by_id_users_id_fk" FOREIGN KEY ("approved_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "legacy_records_sync_status_idx" ON "legacy_records" USING btree ("sync_status");--> statement-breakpoint
CREATE INDEX "legacy_records_service_order_id_idx" ON "legacy_records" USING btree ("service_order_id");--> statement-breakpoint
CREATE INDEX "legacy_records_document_id_idx" ON "legacy_records" USING btree ("document_id");--> statement-breakpoint
CREATE INDEX "schedules_technician_id_idx" ON "schedules" USING btree ("technician_profile_id");--> statement-breakpoint
CREATE INDEX "schedules_team_id_idx" ON "schedules" USING btree ("team_id");--> statement-breakpoint
CREATE INDEX "schedules_period_idx" ON "schedules" USING btree ("starts_at","ends_at");--> statement-breakpoint
CREATE INDEX "technical_documents_status_idx" ON "technical_documents" USING btree ("status");--> statement-breakpoint
CREATE INDEX "technical_documents_service_order_id_idx" ON "technical_documents" USING btree ("service_order_id");--> statement-breakpoint
CREATE INDEX "technical_documents_work_item_id_idx" ON "technical_documents" USING btree ("work_item_id");