import {
  pgSchema,
  text,
  timestamp,
  uuid,
  integer,
} from "drizzle-orm/pg-core";
import { workspaces } from "./workspace";
import { users } from "./identity";

export const storageSchema = pgSchema("storage");

export const objects = storageSchema.table("objects", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id),
  bucket: text("bucket").notNull(),
  objectKey: text("object_key").notNull(),
  fileName: text("file_name").notNull(),
  mimeType: text("mime_type").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  checksumSha256: text("checksum_sha256").notNull(),
  uploadedById: uuid("uploaded_by_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
