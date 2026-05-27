CREATE TABLE "service_order_stages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_order_id" uuid NOT NULL,
	"title" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_order_targets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_order_id" uuid NOT NULL,
	"target_type" text NOT NULL,
	"target_id" uuid,
	"asset_id" uuid,
	"work_item_id" uuid,
	"title" text NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_order_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_order_id" uuid NOT NULL,
	"stage_id" uuid,
	"title" text NOT NULL,
	"description" text,
	"status" text DEFAULT 'open' NOT NULL,
	"assigned_technician_profile_id" uuid,
	"due_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "service_order_stages" ADD CONSTRAINT "service_order_stages_service_order_id_service_orders_id_fk" FOREIGN KEY ("service_order_id") REFERENCES "public"."service_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_order_targets" ADD CONSTRAINT "service_order_targets_service_order_id_service_orders_id_fk" FOREIGN KEY ("service_order_id") REFERENCES "public"."service_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_order_targets" ADD CONSTRAINT "service_order_targets_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_order_targets" ADD CONSTRAINT "service_order_targets_work_item_id_work_items_id_fk" FOREIGN KEY ("work_item_id") REFERENCES "public"."work_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_order_tasks" ADD CONSTRAINT "service_order_tasks_service_order_id_service_orders_id_fk" FOREIGN KEY ("service_order_id") REFERENCES "public"."service_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_order_tasks" ADD CONSTRAINT "service_order_tasks_stage_id_service_order_stages_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."service_order_stages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_order_tasks" ADD CONSTRAINT "service_order_tasks_assigned_technician_profile_id_technician_profiles_id_fk" FOREIGN KEY ("assigned_technician_profile_id") REFERENCES "public"."technician_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "service_order_stages_order_id_idx" ON "service_order_stages" USING btree ("service_order_id");--> statement-breakpoint
CREATE INDEX "service_order_stages_status_idx" ON "service_order_stages" USING btree ("status");--> statement-breakpoint
CREATE INDEX "service_order_targets_order_id_idx" ON "service_order_targets" USING btree ("service_order_id");--> statement-breakpoint
CREATE INDEX "service_order_targets_asset_id_idx" ON "service_order_targets" USING btree ("asset_id");--> statement-breakpoint
CREATE INDEX "service_order_targets_work_item_id_idx" ON "service_order_targets" USING btree ("work_item_id");--> statement-breakpoint
CREATE INDEX "service_order_tasks_order_id_idx" ON "service_order_tasks" USING btree ("service_order_id");--> statement-breakpoint
CREATE INDEX "service_order_tasks_stage_id_idx" ON "service_order_tasks" USING btree ("stage_id");--> statement-breakpoint
CREATE INDEX "service_order_tasks_status_idx" ON "service_order_tasks" USING btree ("status");