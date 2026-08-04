import { uuid, timestamp, uniqueIndex, index } from "drizzle-orm/pg-core";
import { builderSchema } from "@/db/platform/schema/candidates";
import { workspaces, organizations } from "./workspace";

/**
 * Durable Builder workspace selection.
 *
 * Persists the workspace currently selected by an authenticated Builder so it
 * survives reload across Builder, admin and runtime routes. One active
 * selection per authenticated user (userId is resolved from the session by the
 * domain/contract layer — never trusted from a client payload).
 *
 * scope: builder schema | tenant-scoped via workspace_membership enforced by
 * the persistence use cases in src/lib/builder-persistence.ts.
 */
export const builderWorkspaceSelections = builderSchema.table(
  "workspace_selections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id),
    organizationId: uuid("organization_id").references(() => organizations.id),
    selectedAt: timestamp("selected_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("builder_workspace_selections_user_uidx").on(table.userId),
    index("builder_workspace_selections_workspace_idx").on(table.workspaceId),
    index("builder_workspace_selections_org_idx").on(table.organizationId),
  ],
);
