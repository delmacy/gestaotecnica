import "dotenv/config";
import postgres from "postgres";

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is required.");

  const sql = postgres(databaseUrl, { max: 1, prepare: false });
  try {
    await sql.begin(async (tx) => {
      await tx`CREATE SCHEMA IF NOT EXISTS builder`;
      await tx`
        CREATE TABLE IF NOT EXISTS builder.process_candidates (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          workspace_id uuid NOT NULL,
          name text NOT NULL,
          description text,
          status text NOT NULL DEFAULT 'draft',
          origin text NOT NULL DEFAULT 'manual',
          proposed_definition jsonb NOT NULL DEFAULT '{}'::jsonb,
          evidence jsonb NOT NULL DEFAULT '{}'::jsonb,
          created_by_id uuid,
          created_at timestamp with time zone NOT NULL DEFAULT now(),
          updated_at timestamp with time zone NOT NULL DEFAULT now()
        )
      `;
      await tx`ALTER TABLE workflow.process_definitions ADD COLUMN IF NOT EXISTS source_candidate_id uuid`;
      await tx`ALTER TABLE workflow.process_definitions ADD COLUMN IF NOT EXISTS created_by_id uuid`;
      await tx`
        ALTER TABLE workspace.workspaces
        ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}'::jsonb
      `;
      await tx`
        ALTER TABLE workflow.process_versions
        ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone NOT NULL DEFAULT now()
      `;
      await tx`
        CREATE UNIQUE INDEX IF NOT EXISTS process_definitions_source_candidate_uidx
        ON workflow.process_definitions (source_candidate_id)
      `;
      await tx`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_constraint
            WHERE conname = 'process_definitions_created_by_id_users_id_fk'
          ) THEN
            ALTER TABLE workflow.process_definitions
            ADD CONSTRAINT process_definitions_created_by_id_users_id_fk
            FOREIGN KEY (created_by_id) REFERENCES identity.users(id);
          END IF;
        END
        $$
      `;
    });
    console.log("Unified test database is ready.");
  } finally {
    await sql.end();
  }
}

main().catch((error) => {
  console.error("Failed to prepare unified test database:", error);
  process.exit(1);
});
