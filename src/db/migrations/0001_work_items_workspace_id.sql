ALTER TABLE "work_items" ADD COLUMN IF NOT EXISTS "workspace_id" uuid;

DO $$ BEGIN
 ALTER TABLE "work_items" ADD CONSTRAINT "work_items_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspace"."workspaces"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE INDEX IF NOT EXISTS "work_items_workspace_id_idx" ON "work_items" USING btree ("workspace_id");