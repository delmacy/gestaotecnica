CREATE SCHEMA IF NOT EXISTS "builder";

ALTER TABLE "process_candidates" SET SCHEMA "builder";

ALTER TABLE "builder"."process_candidates"
  ALTER COLUMN "id" TYPE uuid USING "id"::uuid,
  ALTER COLUMN "id" SET DEFAULT gen_random_uuid(),
  ALTER COLUMN "workspace_id" TYPE uuid USING "workspace_id"::uuid,
  ALTER COLUMN "name" TYPE text,
  ALTER COLUMN "created_at" TYPE timestamp with time zone USING "created_at" AT TIME ZONE 'UTC',
  ALTER COLUMN "updated_at" TYPE timestamp with time zone USING "updated_at" AT TIME ZONE 'UTC';

ALTER TABLE "builder"."process_candidates"
  RENAME COLUMN "metadata" TO "evidence";

ALTER TABLE "builder"."process_candidates"
  ALTER COLUMN "evidence" SET DEFAULT '{}'::jsonb,
  ALTER COLUMN "evidence" SET NOT NULL;

ALTER TABLE "builder"."process_candidates"
  ADD COLUMN "proposed_definition" jsonb DEFAULT '{}'::jsonb NOT NULL,
  ADD COLUMN "created_by_id" uuid;
