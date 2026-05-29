import {
  pgSchema,
  text,
  timestamp,
  uuid,
  integer,
} from "drizzle-orm/pg-core";
import { workspaces } from "./workspace";
import { users } from "./identity";
import { processInstances } from "./workflow";
import { objects } from "./storage";

export const documentsSchema = pgSchema("documents");

export const documents = documentsSchema.table("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id),
  title: text("title").notNull(),
  documentType: text("document_type").notNull(),
  status: text("status").notNull().default("draft"),
  currentVersionId: uuid("current_version_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const documentVersions = documentsSchema.table("document_versions", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id),
  documentId: uuid("document_id").notNull().references(() => documents.id),
  storageObjectId: uuid("storage_object_id").notNull().references(() => objects.id),
  versionNumber: integer("version_number").notNull(),
  checksumSha256: text("checksum_sha256").notNull(),
  createdById: uuid("created_by_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const documentLinks = documentsSchema.table("document_links", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id),
  documentId: uuid("document_id").notNull().references(() => documents.id),
  linkedEntityType: text("linked_entity_type").notNull(), // process_instance, asset, etc.
  linkedEntityId: uuid("linked_entity_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const traceReceipts = documentsSchema.table("trace_receipts", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id),
  documentId: uuid("document_id").notNull().references(() => documents.id),
  documentVersionId: uuid("document_version_id").notNull().references(() => documentVersions.id),
  processInstanceId: uuid("process_instance_id").references(() => processInstances.id),
  verificationCode: text("verification_code").notNull().unique(),
  verificationUrl: text("verification_url").notNull(),
  qrPayload: text("qr_payload"),
  checksumSha256: text("checksum_sha256").notNull(),
  status: text("status").notNull().default("active"), // active, revoked, superseded
  createdById: uuid("created_by_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
});
