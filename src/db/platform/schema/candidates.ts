import { pgTable, varchar, timestamp, text, jsonb } from "drizzle-orm/pg-core";

export const processCandidates = pgTable("process_candidates", {
  id: varchar("id").primaryKey(),
  workspaceId: varchar("workspace_id").notNull(),
  name: varchar("name").notNull(),
  description: text("description"),
  status: varchar("status").notNull().default("draft"),
  origin: varchar("origin").notNull().default("manual"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
