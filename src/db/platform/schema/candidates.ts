import { jsonb, pgSchema, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const builderSchema = pgSchema("builder");

export const processCandidates = builderSchema.table("process_candidates", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull().default("draft"),
  origin: text("origin").notNull().default("manual"),
  proposedDefinition: jsonb("proposed_definition").notNull().default({}),
  evidence: jsonb("evidence").notNull().default({}),
  createdById: uuid("created_by_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
