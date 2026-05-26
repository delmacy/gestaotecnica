CREATE TYPE "public"."audit_status" AS ENUM('planned', 'in_progress', 'completed', 'requires_action', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."contract_status" AS ENUM('draft', 'active', 'expiring', 'expired', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."finding_severity" AS ENUM('low', 'medium', 'high', 'critical');--> statement-breakpoint
CREATE TYPE "public"."finding_status" AS ENUM('open', 'in_progress', 'mitigated', 'accepted', 'closed');--> statement-breakpoint
CREATE TYPE "public"."inventory_item_status" AS ENUM('available', 'reserved', 'low_stock', 'unavailable', 'retired');--> statement-breakpoint
CREATE TYPE "public"."inventory_movement_type" AS ENUM('inbound', 'outbound', 'reservation', 'release', 'adjustment');--> statement-breakpoint
CREATE TYPE "public"."supplier_status" AS ENUM('prospect', 'active', 'under_review', 'suspended', 'inactive');--> statement-breakpoint
CREATE TABLE "compliance_audits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"area" text,
	"status" "audit_status" DEFAULT 'planned' NOT NULL,
	"priority" "priority" DEFAULT 'medium' NOT NULL,
	"owner_team_id" uuid,
	"asset_id" uuid,
	"planned_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"summary" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "compliance_findings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"audit_id" uuid NOT NULL,
	"title" text NOT NULL,
	"severity" "finding_severity" DEFAULT 'medium' NOT NULL,
	"status" "finding_status" DEFAULT 'open' NOT NULL,
	"responsible_team_id" uuid,
	"due_at" timestamp with time zone,
	"description" text,
	"corrective_action" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sku" text NOT NULL,
	"name" text NOT NULL,
	"category" text,
	"status" "inventory_item_status" DEFAULT 'available' NOT NULL,
	"quantity_on_hand" integer DEFAULT 0 NOT NULL,
	"minimum_quantity" integer DEFAULT 0 NOT NULL,
	"unit" text DEFAULT 'un' NOT NULL,
	"location" text,
	"supplier_id" uuid,
	"asset_id" uuid,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "inventory_items_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
CREATE TABLE "inventory_movements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item_id" uuid NOT NULL,
	"movement_type" "inventory_movement_type" NOT NULL,
	"quantity" integer NOT NULL,
	"service_order_id" uuid,
	"acquisition_need_id" uuid,
	"performed_by_id" uuid,
	"notes" text,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "supplier_contracts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"supplier_id" uuid NOT NULL,
	"title" text NOT NULL,
	"status" "contract_status" DEFAULT 'draft' NOT NULL,
	"contract_number" text,
	"starts_at" timestamp with time zone,
	"ends_at" timestamp with time zone,
	"value_cents" integer,
	"scope" text,
	"owner_team_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "suppliers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"document_number" text,
	"contact_name" text,
	"contact_email" text,
	"contact_phone" text,
	"status" "supplier_status" DEFAULT 'prospect' NOT NULL,
	"category" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "compliance_audits" ADD CONSTRAINT "compliance_audits_owner_team_id_teams_id_fk" FOREIGN KEY ("owner_team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compliance_audits" ADD CONSTRAINT "compliance_audits_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compliance_findings" ADD CONSTRAINT "compliance_findings_audit_id_compliance_audits_id_fk" FOREIGN KEY ("audit_id") REFERENCES "public"."compliance_audits"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compliance_findings" ADD CONSTRAINT "compliance_findings_responsible_team_id_teams_id_fk" FOREIGN KEY ("responsible_team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_item_id_inventory_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."inventory_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_service_order_id_service_orders_id_fk" FOREIGN KEY ("service_order_id") REFERENCES "public"."service_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_acquisition_need_id_acquisition_needs_id_fk" FOREIGN KEY ("acquisition_need_id") REFERENCES "public"."acquisition_needs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_performed_by_id_users_id_fk" FOREIGN KEY ("performed_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_contracts" ADD CONSTRAINT "supplier_contracts_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_contracts" ADD CONSTRAINT "supplier_contracts_owner_team_id_teams_id_fk" FOREIGN KEY ("owner_team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "compliance_audits_status_idx" ON "compliance_audits" USING btree ("status");--> statement-breakpoint
CREATE INDEX "compliance_audits_asset_id_idx" ON "compliance_audits" USING btree ("asset_id");--> statement-breakpoint
CREATE INDEX "compliance_findings_audit_id_idx" ON "compliance_findings" USING btree ("audit_id");--> statement-breakpoint
CREATE INDEX "compliance_findings_status_idx" ON "compliance_findings" USING btree ("status");--> statement-breakpoint
CREATE INDEX "compliance_findings_severity_idx" ON "compliance_findings" USING btree ("severity");--> statement-breakpoint
CREATE INDEX "inventory_items_sku_idx" ON "inventory_items" USING btree ("sku");--> statement-breakpoint
CREATE INDEX "inventory_items_status_idx" ON "inventory_items" USING btree ("status");--> statement-breakpoint
CREATE INDEX "inventory_items_supplier_id_idx" ON "inventory_items" USING btree ("supplier_id");--> statement-breakpoint
CREATE INDEX "inventory_movements_item_id_idx" ON "inventory_movements" USING btree ("item_id");--> statement-breakpoint
CREATE INDEX "inventory_movements_type_idx" ON "inventory_movements" USING btree ("movement_type");--> statement-breakpoint
CREATE INDEX "inventory_movements_occurred_at_idx" ON "inventory_movements" USING btree ("occurred_at");--> statement-breakpoint
CREATE INDEX "supplier_contracts_supplier_id_idx" ON "supplier_contracts" USING btree ("supplier_id");--> statement-breakpoint
CREATE INDEX "supplier_contracts_status_idx" ON "supplier_contracts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "suppliers_name_idx" ON "suppliers" USING btree ("name");--> statement-breakpoint
CREATE INDEX "suppliers_status_idx" ON "suppliers" USING btree ("status");