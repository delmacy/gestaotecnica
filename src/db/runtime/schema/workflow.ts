import {
  pgSchema,
  text,
  timestamp,
  uuid,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";
import { workspaces } from "./workspace";
import { usersTable as users } from "./identity";

export const workflowSchema = pgSchema("workflow");

export const processDefinitions = workflowSchema.table("process_definitions", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id),
  key: text("key").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  blueprintKey: text("blueprint_key"),
  blueprintVersion: text("blueprint_version"),
  isActive: text("is_active").notNull().default("true"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const flowDefinitions = workflowSchema.table("flow_definitions", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id),
  key: text("key").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  definition: jsonb("definition").notNull().default({}),
  isActive: text("is_active").notNull().default("true"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const processVersions = workflowSchema.table("process_versions", {
  id: uuid("id").primaryKey().defaultRandom(),
  processDefinitionId: uuid("process_definition_id").notNull().references(() => processDefinitions.id),
  version: integer("version").notNull(),
  definition: jsonb("definition").notNull().default({}),
  status: text("status").notNull().default("draft"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const states = workflowSchema.table("states", {
  id: uuid("id").primaryKey().defaultRandom(),
  processVersionId: uuid("process_version_id").notNull().references(() => processVersions.id),
  key: text("key").notNull(),
  name: text("name").notNull(),
  config: jsonb("config").notNull().default({}),
  isInitial: text("is_initial").notNull().default("false"),
  isFinal: text("is_final").notNull().default("false"),
});

export const transitions = workflowSchema.table("transitions", {
  id: uuid("id").primaryKey().defaultRandom(),
  processVersionId: uuid("process_version_id").notNull().references(() => processVersions.id),
  fromStateId: uuid("from_state_id").references(() => states.id),
  toStateId: uuid("to_state_id").notNull().references(() => states.id),
  key: text("key").notNull(),
  name: text("name").notNull(),
  trigger: text("trigger").notNull().default("action"),
  config: jsonb("config").notNull().default({}),
});

export const actions = workflowSchema.table("actions", {
  id: uuid("id").primaryKey().defaultRandom(),
  processVersionId: uuid("process_version_id").notNull().references(() => processVersions.id),
  transitionId: uuid("transition_id").references(() => transitions.id),
  key: text("key").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull().default("manual"),
  config: jsonb("config").notNull().default({}),
});

export const processInstances = workflowSchema.table("process_instances", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id),
  processVersionId: uuid("process_version_id").notNull().references(() => processVersions.id),
  currentStateId: uuid("current_state_id").references(() => states.id),
  status: text("status").notNull().default("active"),
  createdById: uuid("created_by_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const processPayloads = workflowSchema.table("process_payloads", {
  id: uuid("id").primaryKey().defaultRandom(),
  instanceId: uuid("instance_id").notNull().references(() => processInstances.id),
  workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id),
  schema_version: text("schema_version").notNull().default("1.0"),
  data: jsonb("data").notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const events = workflowSchema.table("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id),
  eventType: text("event_type").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: uuid("entity_id"),
  actorType: text("actor_type"),
  actorId: uuid("actor_id"),
  source: text("source"),
  correlationId: text("correlation_id"),
  causationId: text("causation_id"),
  payload: jsonb("payload").notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Form and Field Definitions
export const fieldDefinitions = workflowSchema.table("field_definitions", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id),
  key: text("key").notNull(),
  label: text("label").notNull(),
  type: text("type").notNull(),
  config: jsonb("config").notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const forms = workflowSchema.table("forms", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id),
  key: text("key").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const formFields = workflowSchema.table("form_fields", {
  id: uuid("id").primaryKey().defaultRandom(),
  formId: uuid("form_id").notNull().references(() => forms.id),
  fieldDefinitionId: uuid("field_definition_id").notNull().references(() => fieldDefinitions.id),
  sortOrder: integer("sort_order").notNull().default(0),
  isRequired: text("is_required").notNull().default("false"),
  config: jsonb("config").notNull().default({}),
});

// Action Registry and Executions
export const actionRegistry = workflowSchema.table("action_registry", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id),
  key: text("key").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  inputSchema: jsonb("input_schema").notNull().default({}),
  outputSchema: jsonb("output_schema").notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const actionExecutions = workflowSchema.table("action_executions", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id),
  instanceId: uuid("instance_id").notNull().references(() => processInstances.id),
  actionKey: text("action_key").notNull(),
  actorId: uuid("actor_id").references(() => users.id),
  inputPayload: jsonb("input_payload").notNull().default({}),
  outputPayload: jsonb("output_payload").notNull().default({}),
  status: text("status").notNull().default("completed"),
  error: text("error"),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  finishedAt: timestamp("finished_at", { withTimezone: true }),
});


export const outboxEvents = workflowSchema.table("outbox_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id),
  eventLogId: uuid("event_log_id").notNull().references(() => events.id),
  topic: text("topic").notNull(),
  status: text("status").notNull().default("pending"),
  payload: jsonb("payload").notNull().default({}),
  attempts: integer("attempts").notNull().default(0),
  lastError: text("last_error"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  processedAt: timestamp("processed_at", { withTimezone: true }),
});
