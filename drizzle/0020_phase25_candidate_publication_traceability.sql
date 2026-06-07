ALTER TABLE "workflow"."process_definitions"
  ADD COLUMN "source_candidate_id" uuid,
  ADD COLUMN "created_by_id" uuid;
--> statement-breakpoint
ALTER TABLE "workflow"."process_definitions"
  ADD CONSTRAINT "process_definitions_created_by_id_users_id_fk"
  FOREIGN KEY ("created_by_id")
  REFERENCES "identity"."users"("id")
  ON DELETE no action
  ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX "process_definitions_source_candidate_uidx"
  ON "workflow"."process_definitions" USING btree ("source_candidate_id");
