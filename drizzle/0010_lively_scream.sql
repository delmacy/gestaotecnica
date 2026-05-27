CREATE TABLE "technician_unavailabilities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"technician_profile_id" uuid NOT NULL,
	"reason" text NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workforce_allocations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"technician_profile_id" uuid NOT NULL,
	"team_id" uuid,
	"service_order_id" uuid,
	"work_item_id" uuid,
	"schedule_id" uuid,
	"allocation_type" text DEFAULT 'service_order' NOT NULL,
	"status" text DEFAULT 'planned' NOT NULL,
	"starts_at" timestamp with time zone,
	"ends_at" timestamp with time zone,
	"effort_minutes" integer,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "technician_unavailabilities" ADD CONSTRAINT "technician_unavailabilities_technician_profile_id_technician_profiles_id_fk" FOREIGN KEY ("technician_profile_id") REFERENCES "public"."technician_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workforce_allocations" ADD CONSTRAINT "workforce_allocations_technician_profile_id_technician_profiles_id_fk" FOREIGN KEY ("technician_profile_id") REFERENCES "public"."technician_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workforce_allocations" ADD CONSTRAINT "workforce_allocations_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workforce_allocations" ADD CONSTRAINT "workforce_allocations_service_order_id_service_orders_id_fk" FOREIGN KEY ("service_order_id") REFERENCES "public"."service_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workforce_allocations" ADD CONSTRAINT "workforce_allocations_work_item_id_work_items_id_fk" FOREIGN KEY ("work_item_id") REFERENCES "public"."work_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workforce_allocations" ADD CONSTRAINT "workforce_allocations_schedule_id_schedules_id_fk" FOREIGN KEY ("schedule_id") REFERENCES "public"."schedules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "technician_unavailabilities_technician_idx" ON "technician_unavailabilities" USING btree ("technician_profile_id");--> statement-breakpoint
CREATE INDEX "technician_unavailabilities_starts_at_idx" ON "technician_unavailabilities" USING btree ("starts_at");--> statement-breakpoint
CREATE INDEX "workforce_allocations_technician_idx" ON "workforce_allocations" USING btree ("technician_profile_id");--> statement-breakpoint
CREATE INDEX "workforce_allocations_team_idx" ON "workforce_allocations" USING btree ("team_id");--> statement-breakpoint
CREATE INDEX "workforce_allocations_service_order_idx" ON "workforce_allocations" USING btree ("service_order_id");--> statement-breakpoint
CREATE INDEX "workforce_allocations_schedule_idx" ON "workforce_allocations" USING btree ("schedule_id");--> statement-breakpoint
CREATE INDEX "workforce_allocations_status_idx" ON "workforce_allocations" USING btree ("status");