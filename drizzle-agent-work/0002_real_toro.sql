CREATE TABLE "agent_work"."agent_operational_artifacts" (
	"id" text PRIMARY KEY NOT NULL,
	"wave_key" text NOT NULL,
	"artifact_type" text NOT NULL,
	"artifact_key" text NOT NULL,
	"status" text NOT NULL,
	"content" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "agent_operational_artifacts_wave_key_artifact_type_artifact_key_unique" UNIQUE("wave_key","artifact_type","artifact_key")
);
--> statement-breakpoint
CREATE TABLE "agent_work"."agent_review_claim_history" (
	"id" text PRIMARY KEY NOT NULL,
	"review_package_key" text NOT NULL,
	"reviewer_key" text NOT NULL,
	"review_type" text NOT NULL,
	"action" text NOT NULL,
	"details" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "agent_work"."agent_review_kits" (
	"id" text PRIMARY KEY NOT NULL,
	"review_package_key" text NOT NULL,
	"review_type" text NOT NULL,
	"content" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "agent_review_kits_review_package_key_review_type_unique" UNIQUE("review_package_key","review_type")
);
--> statement-breakpoint
CREATE TABLE "agent_work"."agent_review_receipts" (
	"id" text PRIMARY KEY NOT NULL,
	"review_package_key" text NOT NULL,
	"review_type" text NOT NULL,
	"reviewer_key" text NOT NULL,
	"decision" text NOT NULL,
	"content" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "agent_review_receipts_review_package_key_review_type_unique" UNIQUE("review_package_key","review_type")
);
--> statement-breakpoint
ALTER TABLE "agent_work"."agent_review_kits" ADD CONSTRAINT "agent_review_kits_review_package_key_agent_review_packages_key_fk" FOREIGN KEY ("review_package_key") REFERENCES "agent_work"."agent_review_packages"("key") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agent_work"."agent_review_receipts" ADD CONSTRAINT "agent_review_receipts_review_package_key_agent_review_packages_key_fk" FOREIGN KEY ("review_package_key") REFERENCES "agent_work"."agent_review_packages"("key") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "agent_review_claims_active_type_unique" ON "agent_work"."agent_review_claims" USING btree ("review_package_key","review_type") WHERE "agent_review_claims"."status" = 'active';
