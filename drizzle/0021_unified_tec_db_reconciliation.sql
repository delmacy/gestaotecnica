CREATE SCHEMA IF NOT EXISTS "builder";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "builder"."process_candidates" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "workspace_id" uuid NOT NULL,
  "name" text NOT NULL,
  "description" text,
  "status" text DEFAULT 'draft' NOT NULL,
  "origin" text DEFAULT 'manual' NOT NULL,
  "proposed_definition" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "evidence" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "created_by_id" uuid,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "workspace"."workspaces"
  ADD COLUMN IF NOT EXISTS "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL;
--> statement-breakpoint
ALTER TABLE "workflow"."process_versions"
  ADD COLUMN IF NOT EXISTS "updated_at" timestamp with time zone DEFAULT now() NOT NULL;
