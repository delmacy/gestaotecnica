import {
  pgSchema,
  text,
  timestamp,
  uuid,
  jsonb,
} from "drizzle-orm/pg-core";

export const identitySchema = pgSchema("identity");

export const users = identitySchema.table("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const roles = identitySchema.table("roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id"), // Null for global roles, not null for workspace specific
  key: text("key").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const permissions = identitySchema.table("permissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  roleId: uuid("role_id").notNull().references(() => roles.id),
  action: text("action").notNull(),
  resource: text("resource").notNull(),
  effect: text("effect").notNull().default("allow"),
  condition: jsonb("condition"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
