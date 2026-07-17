import "dotenv/config";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);
async function run() {
  await sql`CREATE SCHEMA IF NOT EXISTS "workspace"`;
  await sql`CREATE SCHEMA IF NOT EXISTS "workflow"`;
  await sql`CREATE SCHEMA IF NOT EXISTS "identity"`;
  await sql`CREATE SCHEMA IF NOT EXISTS "registry"`;
  await sql`CREATE SCHEMA IF NOT EXISTS "documents"`;
  await sql`CREATE SCHEMA IF NOT EXISTS "storage"`;
  await sql`CREATE SCHEMA IF NOT EXISTS "blueprints"`;
  await sql`CREATE SCHEMA IF NOT EXISTS "builder"`;

  await sql`CREATE TABLE IF NOT EXISTS "builder"."process_candidates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"origin" text DEFAULT 'manual' NOT NULL,
	"proposed_definition" jsonb,
	"evidence" jsonb,
	"created_by_id" uuid DEFAULT '00000000-0000-0000-0000-000000000000' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
  )`;

  process.exit(0);
}
run();
