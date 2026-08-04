CREATE SCHEMA IF NOT EXISTS "builder";
--> statement-breakpoint
CREATE TABLE "builder"."workspace_selections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"workspace_id" uuid NOT NULL REFERENCES "workspace"."workspaces"("id"),
	"organization_id" uuid REFERENCES "workspace"."organizations"("id"),
	"selected_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "builder_workspace_selections_user_uidx" ON "builder"."workspace_selections" ("user_id");
--> statement-breakpoint
CREATE INDEX "builder_workspace_selections_workspace_idx" ON "builder"."workspace_selections" ("workspace_id");
--> statement-breakpoint
CREATE INDEX "builder_workspace_selections_org_idx" ON "builder"."workspace_selections" ("organization_id");
