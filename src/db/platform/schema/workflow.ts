import { jsonb, pgSchema, text, timestamp, uuid, integer } from "drizzle-orm/pg-core";

export const workflowSchema = pgSchema("workflow");

export const processDefinitions = workflowSchema.table("process_definitions", {
  id: uuid("id").primaryKey().defaultRandom(),

  workspaceId: uuid("workspace_id").notNull(),

  key: text("key").notNull(),
  name: text("name").notNull(),
  description: text("description"),

  status: text("status").notNull().default("draft"),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const processVersions = workflowSchema.table("process_versions", {
  id: uuid("id").primaryKey().defaultRandom(),

  processDefinitionId: uuid("process_definition_id").notNull(),

  version: integer("version").notNull(),

  status: text("status").notNull().default("draft"),

  definitionJson: jsonb("definition_json").notNull(),

  createdBy: uuid("created_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
