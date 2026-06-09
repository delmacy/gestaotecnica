DO $$ BEGIN
 CREATE TYPE "public"."access_profile" AS ENUM('builder', 'admin', 'operador');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "access_profile" "access_profile" DEFAULT 'operador' NOT NULL;
