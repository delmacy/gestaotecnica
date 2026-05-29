import {
  pgSchema,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { workspaces } from "./workspace";
import { usersTable as users } from "./identity";
import { processInstances } from "./workflow";

export const notificationsSchema = pgSchema("notifications");

export const notifications = notificationsSchema.table("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id),
  recipientUserId: uuid("recipient_user_id").references(() => users.id),
  recipientRoleId: uuid("recipient_role_id"), // Refers to identity.roles.id
  processInstanceId: uuid("process_instance_id").references(() => processInstances.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("unread"), // unread, read, archived
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  readAt: timestamp("read_at", { withTimezone: true }),
});

export const notificationTemplates = notificationsSchema.table("notification_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id),
  key: text("key").notNull(),
  titleTemplate: text("title_template").notNull(),
  bodyTemplate: text("body_template").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
