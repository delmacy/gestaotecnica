CREATE TABLE "integration_plugins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"provider" text,
	"status" text DEFAULT 'active' NOT NULL,
	"base_url" text,
	"secret_ref" text,
	"capabilities" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "integration_webhook_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plugin_id" uuid,
	"plugin_key" text,
	"direction" text DEFAULT 'inbound' NOT NULL,
	"event_type" text NOT NULL,
	"target_module" text,
	"status" text DEFAULT 'received' NOT NULL,
	"source" text,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL,
	"processed_at" timestamp with time zone,
	"error_message" text
);
--> statement-breakpoint
ALTER TABLE "integration_webhook_events" ADD CONSTRAINT "integration_webhook_events_plugin_id_integration_plugins_id_fk" FOREIGN KEY ("plugin_id") REFERENCES "public"."integration_plugins"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "integration_plugins_key_uidx" ON "integration_plugins" USING btree ("key");--> statement-breakpoint
CREATE INDEX "integration_plugins_status_idx" ON "integration_plugins" USING btree ("status");--> statement-breakpoint
CREATE INDEX "integration_webhook_events_plugin_idx" ON "integration_webhook_events" USING btree ("plugin_id");--> statement-breakpoint
CREATE INDEX "integration_webhook_events_type_idx" ON "integration_webhook_events" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "integration_webhook_events_status_idx" ON "integration_webhook_events" USING btree ("status");--> statement-breakpoint
CREATE INDEX "integration_webhook_events_received_at_idx" ON "integration_webhook_events" USING btree ("received_at");