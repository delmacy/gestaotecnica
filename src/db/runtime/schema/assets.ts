import {
  pgSchema,
  text,
  timestamp,
  uuid,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { workspaces } from "../workspace";
import { users } from "../identity";

export const assetsSchema = pgSchema("assets_module");

export const assets = assetsSchema.table(
  "assets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id),
    code: text("code").notNull(),
    name: text("name").notNull(),
    category: text("category").notNull(),
    status: text("status").notNull().default("active"),
    location: text("location"),
    responsibleId: uuid("responsible_id").references(() => users.id),
    metadata: jsonb("metadata").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("assets_workspace_code_uidx").on(table.workspaceId, table.code),
    index("assets_workspace_idx").on(table.workspaceId),
    index("assets_status_idx").on(table.status),
    index("assets_category_idx").on(table.category),
  ],
);

export const assetHistory = assetsSchema.table(
  "asset_history",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    assetId: uuid("asset_id")
      .notNull()
      .references(() => assets.id),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id),
    action: text("action").notNull(),
    previousStatus: text("previous_status"),
    newStatus: text("new_status"),
    changedById: uuid("changed_by_id").references(() => users.id),
    payload: jsonb("payload").notNull().default({}),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("asset_history_asset_idx").on(table.assetId),
    index("asset_history_workspace_idx").on(table.workspaceId),
  ],
);
