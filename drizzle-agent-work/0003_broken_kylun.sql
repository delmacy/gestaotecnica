DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'agent_review_packages_key_unique'
      AND conrelid = 'agent_work.agent_review_packages'::regclass
  ) THEN
    ALTER TABLE "agent_work"."agent_review_packages"
      ADD CONSTRAINT "agent_review_packages_key_unique" UNIQUE("key");
  END IF;
END $$;
