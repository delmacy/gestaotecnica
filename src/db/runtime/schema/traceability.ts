import {
  pgSchema,
  text,
  timestamp,
  uuid,
  jsonb,
} from "drizzle-orm/pg-core";
import { workspaces } from "./workspace";

export const traceabilitySchema = pgSchema("traceability");

export const traceReceipts = traceabilitySchema.table("receipts", {
  id: text("id").primaryKey(), // Canonical ID
  workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id),
  subjectType: text("subject_type").notNull(),
  subjectId: text("subject_id").notNull(),
  correlationId: text("correlation_id").notNull(),
  previousReceiptId: text("previous_receipt_id"),
  causationId: text("causation_id"),
  data: jsonb("data").notNull(), // Validated TraceReceipt payload
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
