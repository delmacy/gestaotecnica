import {
  pgSchema,
  text,
  timestamp,
  uuid,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";
import { workspaces } from "./workspace";

export const integrationsSchema = pgSchema("integrations");

export const externalSystems = integrationsSchema.table("external_systems", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id),
  name: text("name").notNull(),
  key: text("key").notNull(),
  config: jsonb("config").notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const webhooks = integrationsSchema.table("webhooks", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id),
  externalSystemId: uuid("external_system_id").references(() => externalSystems.id),
  url: text("url").notNull(),
  eventType: text("event_type").notNull(),
  status: text("status").notNull().default("active"),
  secret: text("secret"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const webhookDeliveries = integrationsSchema.table("webhook_deliveries", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id),
  webhookId: uuid("webhook_id").notNull().references(() => webhooks.id),
  eventType: text("event_type").notNull(),
  payload: jsonb("payload").notNull().default({}),
  status: text("status").notNull().default("pending"), // pending, processing, delivered, failed, dead_letter
  attempts: integer("attempts").notNull().default(0),
  lastAttemptAt: timestamp("last_attempt_at", { withTimezone: true }),
  nextRetryAt: timestamp("next_retry_at", { withTimezone: true }),
  responseStatus: integer("response_status"),
  responseBody: text("response_body"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  deliveredAt: timestamp("delivered_at", { withTimezone: true }),
});
