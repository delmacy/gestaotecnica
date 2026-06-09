import "dotenv/config";
import postgres from "postgres";

async function main() {
  console.log("Starting Agent Work Board schema bootstrap...");

  const databaseUrl = process.env.AGENT_WORK_DATABASE_URL;
  if (!databaseUrl) {
    console.error("AGENT_WORK_DATABASE_URL environment variable is required.");
    process.exit(1);
  }

  const sql = postgres(databaseUrl, { max: 1 });

  try {
    console.log(`Creating schema if not exists: agent_work`);

    await sql`
      CREATE TABLE IF NOT EXISTS "agent_domains" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "key" text UNIQUE NOT NULL,
        "name" text NOT NULL,
        "description" text,
        "category" text NOT NULL DEFAULT 'platform',
        "is_core" boolean NOT NULL DEFAULT false,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" timestamp with time zone NOT NULL DEFAULT now(),
        "updated_at" timestamp with time zone NOT NULL DEFAULT now()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "jules_workers" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "key" text UNIQUE NOT NULL,
        "name" text NOT NULL,
        "role" text NOT NULL,
        "domain_key" text NOT NULL,
        "scope" text,
        "description" text,
        "status" text NOT NULL DEFAULT 'active',
        "max_active_claims" integer NOT NULL DEFAULT 1,
        "created_at" timestamp with time zone NOT NULL DEFAULT now(),
        "updated_at" timestamp with time zone NOT NULL DEFAULT now()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "agent_work_jobs" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "key" text UNIQUE NOT NULL,
        "title" text NOT NULL,
        "summary" text,
        "description" text NOT NULL,
        "domain_key" text NOT NULL,
        "role" text NOT NULL,
        "status" text NOT NULL DEFAULT 'planned',
        "priority" text NOT NULL DEFAULT 'medium',
        "phase_key" text,
        "parent_job_key" text,
        "source_type" text NOT NULL DEFAULT 'manual',
        "source_path" text,
        "source_hash" text,
        "prompt_summary" text,
        "instructions_md" text,
        "allowed_paths" jsonb NOT NULL DEFAULT '[]',
        "forbidden_paths" jsonb NOT NULL DEFAULT '[]',
        "acceptance_criteria" jsonb NOT NULL DEFAULT '[]',
        "expected_outputs" jsonb NOT NULL DEFAULT '[]',
        "blocking_reason" text,
        "github_issue" text,
        "github_pr" text,
        "branch_name" text,
        "created_by" text NOT NULL DEFAULT 'system',
        "assigned_to" text,
        "created_at" timestamp with time zone NOT NULL DEFAULT now(),
        "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
        "started_at" timestamp with time zone,
        "ready_for_review_at" timestamp with time zone,
        "finished_at" timestamp with time zone
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "agent_task_boxes" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "job_key" text NOT NULL,
        "key" text NOT NULL,
        "title" text NOT NULL,
        "description" text,
        "status" text NOT NULL DEFAULT 'planned',
        "sort_order" integer NOT NULL DEFAULT 0,
        "is_required" boolean NOT NULL DEFAULT true,
        "created_at" timestamp with time zone NOT NULL DEFAULT now(),
        "updated_at" timestamp with time zone NOT NULL DEFAULT now()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "agent_work_tasks" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "job_key" text NOT NULL,
        "box_key" text NOT NULL,
        "key" text NOT NULL,
        "title" text NOT NULL,
        "description" text NOT NULL,
        "task_type" text NOT NULL DEFAULT 'implementation',
        "status" text NOT NULL DEFAULT 'planned',
        "priority" text NOT NULL DEFAULT 'medium',
        "sort_order" integer NOT NULL DEFAULT 0,
        "assigned_worker_key" text,
        "allowed_paths" jsonb NOT NULL DEFAULT '[]',
        "forbidden_paths" jsonb NOT NULL DEFAULT '[]',
        "acceptance_criteria" jsonb NOT NULL DEFAULT '[]',
        "expected_artifacts" jsonb NOT NULL DEFAULT '[]',
        "blocking_reason" text,
        "source_path" text,
        "source_anchor" text,
        "created_at" timestamp with time zone NOT NULL DEFAULT now(),
        "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
        "started_at" timestamp with time zone,
        "finished_at" timestamp with time zone
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "agent_work_task_dependencies" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "job_key" text NOT NULL,
        "task_key" text NOT NULL,
        "depends_on_task_key" text NOT NULL,
        "dependency_type" text NOT NULL DEFAULT 'blocks',
        "created_at" timestamp with time zone NOT NULL DEFAULT now()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "agent_work_job_dependencies" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "job_key" text NOT NULL,
        "depends_on_job_key" text NOT NULL,
        "dependency_type" text NOT NULL DEFAULT 'blocks',
        "created_at" timestamp with time zone NOT NULL DEFAULT now()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "agent_work_claims" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "job_key" text NOT NULL,
        "task_key" text,
        "worker_key" text NOT NULL,
        "claim_status" text NOT NULL DEFAULT 'active',
        "claimed_at" timestamp with time zone NOT NULL DEFAULT now(),
        "released_at" timestamp with time zone,
        "expires_at" timestamp with time zone,
        "notes" text
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "agent_work_events" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "job_key" text NOT NULL,
        "task_key" text,
        "event_type" text NOT NULL,
        "actor_key" text NOT NULL,
        "message" text NOT NULL,
        "payload" jsonb NOT NULL DEFAULT '{}',
        "created_at" timestamp with time zone NOT NULL DEFAULT now()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "agent_work_artifacts" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "job_key" text NOT NULL,
        "task_key" text,
        "artifact_type" text NOT NULL,
        "path" text NOT NULL,
        "description" text,
        "change_type" text,
        "created_at" timestamp with time zone NOT NULL DEFAULT now()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "agent_work_commands" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "job_key" text NOT NULL,
        "task_key" text,
        "command" text NOT NULL,
        "status" text NOT NULL,
        "output_summary" text,
        "error_summary" text,
        "executed_at" timestamp with time zone NOT NULL DEFAULT now()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "agent_work_handoffs" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "from_job_key" text NOT NULL,
        "to_job_key" text,
        "from_task_key" text,
        "to_task_key" text,
        "from_worker_key" text NOT NULL,
        "to_worker_key" text,
        "summary" text NOT NULL,
        "required_action" text,
        "status" text NOT NULL DEFAULT 'open',
        "created_at" timestamp with time zone NOT NULL DEFAULT now(),
        "resolved_at" timestamp with time zone
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "agent_work_decisions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "job_key" text,
        "task_key" text,
        "decision_key" text UNIQUE NOT NULL,
        "title" text NOT NULL,
        "decision" text NOT NULL,
        "rationale" text,
        "status" text NOT NULL DEFAULT 'active',
        "created_by" text NOT NULL,
        "created_at" timestamp with time zone NOT NULL DEFAULT now(),
        "superseded_by" text
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "agent_markdown_sources" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "source_path" text UNIQUE NOT NULL,
        "source_type" text NOT NULL,
        "source_hash" text NOT NULL,
        "title" text,
        "imported_status" text NOT NULL DEFAULT 'pending',
        "imported_at" timestamp with time zone,
        "last_seen_at" timestamp with time zone NOT NULL DEFAULT now(),
        "created_job_key" text,
        "notes" text
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "agent_markdown_imports" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "import_key" text UNIQUE NOT NULL,
        "status" text NOT NULL DEFAULT 'started',
        "source_glob" text NOT NULL,
        "files_seen" integer NOT NULL DEFAULT 0,
        "files_imported" integer NOT NULL DEFAULT 0,
        "files_skipped" integer NOT NULL DEFAULT 0,
        "files_failed" integer NOT NULL DEFAULT 0,
        "summary" text,
        "started_at" timestamp with time zone NOT NULL DEFAULT now(),
        "finished_at" timestamp with time zone
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "agent_work_dumps" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "dump_key" text UNIQUE NOT NULL,
        "path" text NOT NULL,
        "generated_at" timestamp with time zone NOT NULL DEFAULT now(),
        "summary" text,
        "content_hash" text,
        "job_count" integer NOT NULL DEFAULT 0,
        "task_count" integer NOT NULL DEFAULT 0,
        "blocked_count" integer NOT NULL DEFAULT 0,
        "ready_count" integer NOT NULL DEFAULT 0
      );
    `;

    console.log("Bootstrap complete.");
  } catch (error) {
    console.error("Error creating schemas:", error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

main();
