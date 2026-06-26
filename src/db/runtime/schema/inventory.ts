import {
  pgSchema,
  text,
  timestamp,
  uuid,
  integer,
  index,
} from "drizzle-orm/pg-core";
import { workspaces } from "./workspace";
import { suppliers, assets, serviceOrders, acquisitionNeeds, users } from "../../legacy/schema";

export const inventorySchema = pgSchema("inventory");

export const inventoryItemStatusEnum = inventorySchema.enum("inventory_item_status", [
  "available",
  "reserved",
  "low_stock",
  "unavailable",
  "retired",
]);

export const inventoryMovementTypeEnum = inventorySchema.enum("inventory_movement_type", [
  "inbound",
  "outbound",
  "reservation",
  "release",
  "adjustment",
]);

export const inventoryItems = inventorySchema.table(
  "items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id),
    sku: text("sku").notNull(),
    name: text("name").notNull(),
    category: text("category"),
    status: inventoryItemStatusEnum("status").notNull().default("available"),
    quantityOnHand: integer("quantity_on_hand").notNull().default(0),
    minimumQuantity: integer("minimum_quantity").notNull().default(0),
    unit: text("unit").notNull().default("un"),
    location: text("location"),
    lot: text("lot"),
    supplierId: uuid("supplier_id").references(() => suppliers.id),
    assetId: uuid("asset_id").references(() => assets.id),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("inventory_items_workspace_idx").on(table.workspaceId),
    index("inventory_items_sku_idx").on(table.sku),
    index("inventory_items_status_idx").on(table.status),
  ],
);

export const inventoryMovements = inventorySchema.table(
  "movements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id),
    itemId: uuid("item_id").notNull().references(() => inventoryItems.id),
    movementType: inventoryMovementTypeEnum("movement_type").notNull(),
    quantity: integer("quantity").notNull(),
    reason: text("reason"),
    serviceOrderId: uuid("service_order_id").references(() => serviceOrders.id),
    acquisitionNeedId: uuid("acquisition_need_id").references(() => acquisitionNeeds.id),
    performedById: uuid("performed_by_id").references(() => users.id),
    notes: text("notes"),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("inventory_movements_workspace_idx").on(table.workspaceId),
    index("inventory_movements_item_id_idx").on(table.itemId),
    index("inventory_movements_type_idx").on(table.movementType),
    index("inventory_movements_occurred_at_idx").on(table.occurredAt),
  ],
);
