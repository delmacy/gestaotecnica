ALTER TABLE "workflow"."events" ADD COLUMN "idempotency_key" text;
CREATE UNIQUE INDEX "events_workspace_idempotency_uidx" ON "workflow"."events" ("workspace_id", "idempotency_key") WHERE "idempotency_key" IS NOT NULL;
