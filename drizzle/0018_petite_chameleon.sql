CREATE TABLE "process_candidates" (
	"id" varchar PRIMARY KEY NOT NULL,
	"workspace_id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"status" varchar DEFAULT 'draft' NOT NULL,
	"origin" varchar DEFAULT 'manual' NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
