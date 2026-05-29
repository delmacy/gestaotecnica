import {
  pgSchema,
  text,
  timestamp,
  uuid,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";

export const registrySchema = pgSchema("registry");

export const capabilities = registrySchema.table("capabilities", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const modules = registrySchema.table("modules", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const moduleVersions = registrySchema.table("module_versions", {
  id: uuid("id").primaryKey().defaultRandom(),
  moduleId: uuid("module_id").notNull().references(() => modules.id),
  version: text("version").notNull(),
  configSchema: jsonb("config_schema").notNull().default({}),
  changelog: text("changelog"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const moduleCapabilities = registrySchema.table("module_capabilities", {
  id: uuid("id").primaryKey().defaultRandom(),
  moduleId: uuid("module_id").notNull().references(() => modules.id),
  capabilityId: uuid("capability_id").notNull().references(() => capabilities.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
