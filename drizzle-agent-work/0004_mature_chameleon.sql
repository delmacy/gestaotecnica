ALTER TABLE "agent_work"."agent_review_claims" DROP CONSTRAINT IF EXISTS "agent_review_claims_review_package_key_review_type_unique";--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "agent_review_claims_active_type_unique" ON "agent_work"."agent_review_claims" USING btree ("review_package_key","review_type") WHERE "agent_work"."agent_review_claims"."status" = 'active';
