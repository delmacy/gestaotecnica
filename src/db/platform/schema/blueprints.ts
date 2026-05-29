import {
  pgSchema,
  text,
  timestamp,
  uuid,
  jsonb,
} from "drizzle-orm/pg-core";

export const blueprintsSchema = pgSchema("blueprints");

export const blueprints = blueprintsSchema.table("blueprints", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const blueprintVersions = blueprintsSchema.table("blueprint_versions", {
  id: uuid("id").primaryKey().defaultRandom(),
  blueprintId: uuid("blueprint_id").notNull().references(() => blueprints.id),
  version: text("version").notNull(),
  definition: jsonb("definition").notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
