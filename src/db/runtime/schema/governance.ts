import {
  pgSchema,
  text,
  timestamp,
  uuid,
  jsonb,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { workspaces } from "./workspace";

export const governanceSchema = pgSchema("governance");

export const approvalPolicies = governanceSchema.table(
  "approval_policies",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id),
    key: text("key").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    status: text("status").notNull().default("draft"),
    scope: jsonb("scope").notNull(),
    requirement: jsonb("requirement").notNull(),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("approval_policies_workspace_key_uidx").on(table.workspaceId, table.key),
    index("approval_policies_workspace_idx").on(table.workspaceId),
  ],
);

export const approvalDecisions = governanceSchema.table(
  "approval_decisions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id),
    subjectType: text("subject_type").notNull(),
    subjectId: uuid("subject_id").notNull(),
    subjectVersion: text("subject_version").notNull(),
    decision: text("decision").notNull(),
    actorType: text("actor_type").notNull(),
    actorId: text("actor_id").notNull(),
    policyId: uuid("policy_id").references(() => approvalPolicies.id),
    justification: text("justification"),
    approvedContentHash: jsonb("approved_content_hash"),
    metadata: jsonb("metadata"),
    decidedAt: timestamp("decided_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("approval_decisions_workspace_idx").on(table.workspaceId),
    index("approval_decisions_subject_idx").on(table.subjectType, table.subjectId),
    index("approval_decisions_policy_idx").on(table.policyId),
  ],
);
