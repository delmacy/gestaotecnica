CREATE SCHEMA "governance";
--> statement-breakpoint
CREATE TABLE "governance"."approval_policies" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "workspace_id" uuid NOT NULL REFERENCES "workspace"."workspaces"("id"),
  "key" text NOT NULL,
  "name" text NOT NULL,
  "description" text,
  "status" text DEFAULT 'draft' NOT NULL,
  "scope" jsonb NOT NULL,
  "requirement" jsonb NOT NULL,
  "metadata" jsonb,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "governance"."approval_decisions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "workspace_id" uuid NOT NULL REFERENCES "workspace"."workspaces"("id"),
  "subject_type" text NOT NULL,
  "subject_id" uuid NOT NULL,
  "subject_version" text NOT NULL,
  "decision" text NOT NULL,
  "actor_type" text NOT NULL,
  "actor_id" text NOT NULL,
  "policy_id" uuid REFERENCES "governance"."approval_policies"("id"),
  "justification" text,
  "approved_content_hash" jsonb,
  "metadata" jsonb,
  "decided_at" timestamp with time zone NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "approval_policies_workspace_key_uidx" ON "governance"."approval_policies" ("workspace_id", "key");
--> statement-breakpoint
CREATE INDEX "approval_policies_workspace_idx" ON "governance"."approval_policies" ("workspace_id");
--> statement-breakpoint
CREATE INDEX "approval_decisions_workspace_idx" ON "governance"."approval_decisions" ("workspace_id");
--> statement-breakpoint
CREATE INDEX "approval_decisions_subject_idx" ON "governance"."approval_decisions" ("subject_type", "subject_id");
--> statement-breakpoint
CREATE INDEX "approval_decisions_policy_idx" ON "governance"."approval_decisions" ("policy_id");
