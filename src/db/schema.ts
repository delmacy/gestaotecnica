import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const userStatusEnum = pgEnum("user_status", ["active", "inactive"]);

export const technicianLevelEnum = pgEnum("technician_level", [
  "trainee",
  "pleno",
  "especialista",
  "supervisor",
]);

export const workItemTypeEnum = pgEnum("work_item_type", [
  "incidente",
  "solicitacao",
  "vistoria",
  "manutencao",
  "pendencia_turno",
  "atividade_planejada",
  "administrativo",
]);

export const workItemStatusEnum = pgEnum("work_item_status", [
  "draft",
  "open",
  "triaged",
  "planned",
  "in_progress",
  "blocked",
  "resolved",
  "cancelled",
]);

export const priorityEnum = pgEnum("priority", [
  "low",
  "medium",
  "high",
  "critical",
]);

export const serviceOrderStatusEnum = pgEnum("service_order_status", [
  "draft",
  "open",
  "assigned",
  "in_progress",
  "waiting_review",
  "completed",
  "approved",
  "cancelled",
]);

export const assetStatusEnum = pgEnum("asset_status", [
  "active",
  "inactive",
  "maintenance",
  "decommissioned",
]);

export const shiftStatusEnum = pgEnum("shift_status", [
  "open",
  "review",
  "closed",
]);

export const scheduleTypeEnum = pgEnum("schedule_type", [
  "expediente",
  "plantao",
  "sobreaviso",
  "ausencia",
]);

export const scheduleStatusEnum = pgEnum("schedule_status", [
  "planned",
  "confirmed",
  "cancelled",
  "completed",
]);

export const documentStatusEnum = pgEnum("document_status", [
  "draft",
  "prepared_by_secretary",
  "waiting_technician_review",
  "waiting_supervisor_approval",
  "approved",
  "signed",
  "exported_to_legacy",
  "archived",
  "returned_for_correction",
]);

export const legacySyncStatusEnum = pgEnum("legacy_sync_status", [
  "pending",
  "prepared",
  "exported",
  "confirmed",
  "failed",
]);

export const planningStatusEnum = pgEnum("planning_status", [
  "draft",
  "proposed",
  "approved",
  "in_progress",
  "completed",
  "cancelled",
]);

export const acquisitionStatusEnum = pgEnum("acquisition_status", [
  "identified",
  "justified",
  "requested",
  "approved",
  "ordered",
  "received",
  "cancelled",
]);

export const skillProficiencyEnum = pgEnum("skill_proficiency", [
  "basic",
  "intermediate",
  "advanced",
  "expert",
]);

export const trainingStatusEnum = pgEnum("training_status", [
  "planned",
  "in_progress",
  "completed",
  "expired",
  "cancelled",
]);

export const resourceNeedStatusEnum = pgEnum("resource_need_status", [
  "identified",
  "prioritized",
  "approved",
  "in_progress",
  "fulfilled",
  "cancelled",
]);

export const automationStatusEnum = pgEnum("automation_status", [
  "draft",
  "active",
  "paused",
  "failed",
  "retired",
]);

export const supplierStatusEnum = pgEnum("supplier_status", [
  "prospect",
  "active",
  "under_review",
  "suspended",
  "inactive",
]);

export const contractStatusEnum = pgEnum("contract_status", [
  "draft",
  "active",
  "expiring",
  "expired",
  "cancelled",
]);

export const inventoryItemStatusEnum = pgEnum("inventory_item_status", [
  "available",
  "reserved",
  "low_stock",
  "unavailable",
  "retired",
]);

export const inventoryMovementTypeEnum = pgEnum("inventory_movement_type", [
  "inbound",
  "outbound",
  "reservation",
  "release",
  "adjustment",
]);

export const auditStatusEnum = pgEnum("audit_status", [
  "planned",
  "in_progress",
  "completed",
  "requires_action",
  "cancelled",
]);

export const findingSeverityEnum = pgEnum("finding_severity", [
  "low",
  "medium",
  "high",
  "critical",
]);

export const findingStatusEnum = pgEnum("finding_status", [
  "open",
  "in_progress",
  "mitigated",
  "accepted",
  "closed",
]);

export const workspaces = pgTable(
  "workspaces",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    key: text("key").notNull(),
    name: text("name").notNull(),
    adaptationKey: text("adaptation_key").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    metadata: jsonb("metadata").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("workspaces_key_uidx").on(table.key),
    index("workspaces_active_idx").on(table.isActive),
  ],
);

export const workspaceModuleConfigs = pgTable(
  "workspace_module_configs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id),
    moduleKey: text("module_key").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    layer: text("layer").notNull().default("module"),
    status: text("status").notNull().default("planned"),
    isEnabled: boolean("is_enabled").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    config: jsonb("config").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("workspace_module_configs_workspace_module_uidx").on(
      table.workspaceId,
      table.moduleKey,
    ),
    index("workspace_module_configs_workspace_idx").on(table.workspaceId),
  ],
);

export const workItemTypeDefinitions = pgTable(
  "work_item_type_definitions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id),
    key: text("key").notNull(),
    label: text("label").notNull(),
    description: text("description"),
    defaultPriority: priorityEnum("default_priority").notNull().default("medium"),
    defaultQueue: text("default_queue"),
    canGenerateServiceOrder: boolean("can_generate_service_order")
      .notNull()
      .default(true),
    canAppearInShiftLog: boolean("can_appear_in_shift_log").notNull().default(false),
    isActive: boolean("is_active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    config: jsonb("config").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("work_item_type_definitions_workspace_key_uidx").on(
      table.workspaceId,
      table.key,
    ),
    index("work_item_type_definitions_workspace_idx").on(table.workspaceId),
  ],
);

export const serviceOrderTypeDefinitions = pgTable(
  "service_order_type_definitions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id),
    key: text("key").notNull(),
    label: text("label").notNull(),
    description: text("description"),
    requiresAsset: boolean("requires_asset").notNull().default(false),
    requiresTimeEntry: boolean("requires_time_entry").notNull().default(true),
    requiresEvidence: boolean("requires_evidence").notNull().default(false),
    requiresSupervisorApproval: boolean("requires_supervisor_approval")
      .notNull()
      .default(false),
    isActive: boolean("is_active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    config: jsonb("config").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("service_order_type_definitions_workspace_key_uidx").on(
      table.workspaceId,
      table.key,
    ),
    index("service_order_type_definitions_workspace_idx").on(table.workspaceId),
  ],
);

export const assetTypeDefinitions = pgTable(
  "asset_type_definitions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id),
    key: text("key").notNull(),
    label: text("label").notNull(),
    tracksMaintenance: boolean("tracks_maintenance").notNull().default(true),
    tracksLocation: boolean("tracks_location").notNull().default(true),
    isActive: boolean("is_active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    config: jsonb("config").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("asset_type_definitions_workspace_key_uidx").on(
      table.workspaceId,
      table.key,
    ),
    index("asset_type_definitions_workspace_idx").on(table.workspaceId),
  ],
);

export const scheduleTypeDefinitions = pgTable(
  "schedule_type_definitions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id),
    key: text("key").notNull(),
    label: text("label").notNull(),
    description: text("description"),
    requiresShiftLog: boolean("requires_shift_log").notNull().default(false),
    receivesTickets: jsonb("receives_tickets").notNull().default(false),
    receivesServiceOrders: jsonb("receives_service_orders").notNull().default(false),
    allowsOverlap: boolean("allows_overlap").notNull().default(true),
    isActive: boolean("is_active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    config: jsonb("config").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("schedule_type_definitions_workspace_key_uidx").on(
      table.workspaceId,
      table.key,
    ),
    index("schedule_type_definitions_workspace_idx").on(table.workspaceId),
  ],
);

export const businessRoleDefinitions = pgTable(
  "business_role_definitions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id),
    key: text("key").notNull(),
    label: text("label").notNull(),
    legacyLevel: text("legacy_level"),
    canExecuteServiceOrder: boolean("can_execute_service_order")
      .notNull()
      .default(false),
    requiresSupervision: boolean("requires_supervision").notNull().default(false),
    canApprove: boolean("can_approve").notNull().default(false),
    canAssignServiceOrder: boolean("can_assign_service_order").notNull().default(false),
    canReviewShiftLog: boolean("can_review_shift_log").notNull().default(false),
    canValidateTechnicalWork: boolean("can_validate_technical_work")
      .notNull()
      .default(false),
    canPrepareDocuments: boolean("can_prepare_documents").notNull().default(false),
    canReviewCompleteness: boolean("can_review_completeness").notNull().default(false),
    canPlanMaintenance: boolean("can_plan_maintenance").notNull().default(false),
    canManageAcquisitions: boolean("can_manage_acquisitions").notNull().default(false),
    isActive: boolean("is_active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    config: jsonb("config").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("business_role_definitions_workspace_key_uidx").on(
      table.workspaceId,
      table.key,
    ),
    index("business_role_definitions_workspace_idx").on(table.workspaceId),
  ],
);

export const workspaceQueues = pgTable(
  "workspace_queues",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id),
    key: text("key").notNull(),
    label: text("label").notNull(),
    description: text("description"),
    isActive: boolean("is_active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    config: jsonb("config").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("workspace_queues_workspace_key_uidx").on(
      table.workspaceId,
      table.key,
    ),
    index("workspace_queues_workspace_idx").on(table.workspaceId),
  ],
);

export const workflowTemplates = pgTable(
  "workflow_templates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id),
    key: text("key").notNull(),
    label: text("label").notNull(),
    target: text("target").notNull(),
    states: jsonb("states").notNull().default([]),
    isActive: boolean("is_active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    config: jsonb("config").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("workflow_templates_workspace_key_uidx").on(
      table.workspaceId,
      table.key,
    ),
    index("workflow_templates_workspace_idx").on(table.workspaceId),
  ],
);

export const workflowInstances = pgTable(
  "workflow_instances",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id),
    workflowTemplateId: uuid("workflow_template_id").notNull().references(() => workflowTemplates.id),
    targetType: text("target_type").notNull(),
    targetId: uuid("target_id").notNull(),
    currentState: text("current_state").notNull(),
    status: text("status").notNull().default("active"),
    snapshot: jsonb("snapshot").notNull().default({}),
    startedById: uuid("started_by_id").references(() => users.id),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("workflow_instances_workspace_idx").on(table.workspaceId),
    index("workflow_instances_template_idx").on(table.workflowTemplateId),
    index("workflow_instances_target_idx").on(table.targetType, table.targetId),
    index("workflow_instances_status_idx").on(table.status),
  ],
);

export const workflowTransitions = pgTable(
  "workflow_transitions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workflowInstanceId: uuid("workflow_instance_id").notNull().references(() => workflowInstances.id),
    fromState: text("from_state").notNull(),
    toState: text("to_state").notNull(),
    actorId: uuid("actor_id").references(() => users.id),
    note: text("note"),
    payload: jsonb("payload").notNull().default({}),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("workflow_transitions_instance_idx").on(table.workflowInstanceId),
    index("workflow_transitions_occurred_at_idx").on(table.occurredAt),
  ],
);

export const reportTemplateDefinitions = pgTable(
  "report_template_definitions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id),
    key: text("key").notNull(),
    label: text("label").notNull(),
    target: text("target").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    config: jsonb("config").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("report_template_definitions_workspace_key_uidx").on(
      table.workspaceId,
      table.key,
    ),
    index("report_template_definitions_workspace_idx").on(table.workspaceId),
  ],
);

export const documentTemplateDefinitions = pgTable(
  "document_template_definitions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id),
    key: text("key").notNull(),
    label: text("label").notNull(),
    target: text("target").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    config: jsonb("config").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("document_template_definitions_workspace_key_uidx").on(
      table.workspaceId,
      table.key,
    ),
    index("document_template_definitions_workspace_idx").on(table.workspaceId),
  ],
);

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    status: userStatusEnum("status").notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("users_email_idx").on(table.email)],
);

export const authAccounts = pgTable(
  "auth_accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id),
    passwordHash: text("password_hash").notNull(),
    passwordSalt: text("password_salt").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("auth_accounts_user_id_uidx").on(table.userId),
    index("auth_accounts_active_idx").on(table.isActive),
  ],
);

export const authSessions = pgTable(
  "auth_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("auth_sessions_token_hash_uidx").on(table.tokenHash),
    index("auth_sessions_user_id_idx").on(table.userId),
    index("auth_sessions_expires_at_idx").on(table.expiresAt),
  ],
);

export const permissionDefinitions = pgTable(
  "permission_definitions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    key: text("key").notNull(),
    moduleKey: text("module_key").notNull(),
    action: text("action").notNull(),
    label: text("label").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("permission_definitions_key_uidx").on(table.key),
    index("permission_definitions_module_idx").on(table.moduleKey),
  ],
);

export const rolePermissionGrants = pgTable(
  "role_permission_grants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    roleId: uuid("role_id").notNull().references(() => businessRoleDefinitions.id),
    permissionId: uuid("permission_id")
      .notNull()
      .references(() => permissionDefinitions.id),
    isAllowed: boolean("is_allowed").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("role_permission_grants_role_permission_uidx").on(
      table.roleId,
      table.permissionId,
    ),
    index("role_permission_grants_role_idx").on(table.roleId),
  ],
);

export const userRoleAssignments = pgTable(
  "user_role_assignments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id),
    workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id),
    roleId: uuid("role_id").notNull().references(() => businessRoleDefinitions.id),
    assignedAt: timestamp("assigned_at", { withTimezone: true }).notNull().defaultNow(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
  },
  (table) => [
    index("user_role_assignments_user_idx").on(table.userId),
    index("user_role_assignments_workspace_idx").on(table.workspaceId),
  ],
);

export const teams = pgTable("teams", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const technicianProfiles = pgTable(
  "technician_profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id),
    teamId: uuid("team_id").references(() => teams.id),
    level: technicianLevelEnum("level").notNull().default("trainee"),
    registrationCode: text("registration_code"),
    specialty: text("specialty"),
    isAvailable: boolean("is_available").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("technician_profiles_user_id_idx").on(table.userId),
    index("technician_profiles_team_id_idx").on(table.teamId),
  ],
);

export const assets = pgTable(
  "assets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: text("code").notNull().unique(),
    name: text("name").notNull(),
    type: text("type").notNull(),
    status: assetStatusEnum("status").notNull().default("active"),
    criticality: priorityEnum("criticality").notNull().default("medium"),
    location: text("location"),
    description: text("description"),
    metadata: jsonb("metadata").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("assets_code_idx").on(table.code),
    index("assets_status_idx").on(table.status),
  ],
);

export const workItems = pgTable(
  "work_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description"),
    type: workItemTypeEnum("type").notNull().default("solicitacao"),
    status: workItemStatusEnum("status").notNull().default("open"),
    priority: priorityEnum("priority").notNull().default("medium"),
    requesterName: text("requester_name"),
    requesterContact: text("requester_contact"),
    assetId: uuid("asset_id").references(() => assets.id),
    assignedTeamId: uuid("assigned_team_id").references(() => teams.id),
    createdById: uuid("created_by_id").references(() => users.id),
    payload: jsonb("payload").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("work_items_status_idx").on(table.status),
    index("work_items_priority_idx").on(table.priority),
    index("work_items_asset_id_idx").on(table.assetId),
  ],
);

export const serviceOrders = pgTable(
  "service_orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workItemId: uuid("work_item_id").references(() => workItems.id),
    assetId: uuid("asset_id").references(() => assets.id),
    code: text("code").notNull().unique(),
    title: text("title").notNull(),
    type: text("type").notNull().default("manutencao"),
    objective: text("objective"),
    status: serviceOrderStatusEnum("status").notNull().default("open"),
    priority: priorityEnum("priority").notNull().default("medium"),
    openedById: uuid("opened_by_id").references(() => users.id),
    approvedById: uuid("approved_by_id").references(() => users.id),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("service_orders_code_idx").on(table.code),
    index("service_orders_status_idx").on(table.status),
    index("service_orders_work_item_id_idx").on(table.workItemId),
    index("service_orders_asset_id_idx").on(table.assetId),
  ],
);

export const serviceOrderStages = pgTable(
  "service_order_stages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serviceOrderId: uuid("service_order_id").notNull().references(() => serviceOrders.id),
    title: text("title").notNull(),
    status: text("status").notNull().default("pending"),
    position: integer("position").notNull().default(0),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("service_order_stages_order_id_idx").on(table.serviceOrderId),
    index("service_order_stages_status_idx").on(table.status),
  ],
);

export const serviceOrderTasks = pgTable(
  "service_order_tasks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serviceOrderId: uuid("service_order_id").notNull().references(() => serviceOrders.id),
    stageId: uuid("stage_id").references(() => serviceOrderStages.id),
    title: text("title").notNull(),
    description: text("description"),
    status: text("status").notNull().default("open"),
    assignedTechnicianProfileId: uuid("assigned_technician_profile_id").references(() => technicianProfiles.id),
    dueAt: timestamp("due_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("service_order_tasks_order_id_idx").on(table.serviceOrderId),
    index("service_order_tasks_stage_id_idx").on(table.stageId),
    index("service_order_tasks_status_idx").on(table.status),
  ],
);

export const serviceOrderTargets = pgTable(
  "service_order_targets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serviceOrderId: uuid("service_order_id").notNull().references(() => serviceOrders.id),
    targetType: text("target_type").notNull(),
    targetId: uuid("target_id"),
    assetId: uuid("asset_id").references(() => assets.id),
    workItemId: uuid("work_item_id").references(() => workItems.id),
    title: text("title").notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("service_order_targets_order_id_idx").on(table.serviceOrderId),
    index("service_order_targets_asset_id_idx").on(table.assetId),
    index("service_order_targets_work_item_id_idx").on(table.workItemId),
  ],
);

export const serviceOrderAssignments = pgTable(
  "service_order_assignments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serviceOrderId: uuid("service_order_id").notNull().references(() => serviceOrders.id),
    technicianProfileId: uuid("technician_profile_id")
      .notNull()
      .references(() => technicianProfiles.id),
    role: text("role").notNull().default("executor"),
    assignedAt: timestamp("assigned_at", { withTimezone: true }).notNull().defaultNow(),
    releasedAt: timestamp("released_at", { withTimezone: true }),
  },
  (table) => [
    index("service_order_assignments_order_id_idx").on(table.serviceOrderId),
    index("service_order_assignments_technician_id_idx").on(table.technicianProfileId),
  ],
);

export const timeEntries = pgTable(
  "time_entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serviceOrderId: uuid("service_order_id").notNull().references(() => serviceOrders.id),
    technicianProfileId: uuid("technician_profile_id")
      .notNull()
      .references(() => technicianProfiles.id),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull(),
    endedAt: timestamp("ended_at", { withTimezone: true }),
    durationMinutes: integer("duration_minutes"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("time_entries_order_id_idx").on(table.serviceOrderId),
    index("time_entries_technician_id_idx").on(table.technicianProfileId),
  ],
);

export const evidences = pgTable(
  "evidences",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serviceOrderId: uuid("service_order_id").references(() => serviceOrders.id),
    workItemId: uuid("work_item_id").references(() => workItems.id),
    assetId: uuid("asset_id").references(() => assets.id),
    title: text("title").notNull(),
    description: text("description"),
    fileUrl: text("file_url"),
    mimeType: text("mime_type"),
    createdById: uuid("created_by_id").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("evidences_service_order_id_idx").on(table.serviceOrderId),
    index("evidences_work_item_id_idx").on(table.workItemId),
    index("evidences_asset_id_idx").on(table.assetId),
  ],
);

export const shifts = pgTable("shifts", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  status: shiftStatusEnum("status").notNull().default("open"),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull(),
  endedAt: timestamp("ended_at", { withTimezone: true }),
  openedById: uuid("opened_by_id").references(() => users.id),
  closedById: uuid("closed_by_id").references(() => users.id),
  summary: text("summary"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const shiftLogEntries = pgTable(
  "shift_log_entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    shiftId: uuid("shift_id").notNull().references(() => shifts.id),
    workItemId: uuid("work_item_id").references(() => workItems.id),
    serviceOrderId: uuid("service_order_id").references(() => serviceOrders.id),
    assetId: uuid("asset_id").references(() => assets.id),
    title: text("title").notNull(),
    description: text("description"),
    isPending: boolean("is_pending").notNull().default(false),
    createdById: uuid("created_by_id").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("shift_log_entries_shift_id_idx").on(table.shiftId),
    index("shift_log_entries_order_id_idx").on(table.serviceOrderId),
  ],
);

export const eventLogs = pgTable(
  "event_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventType: text("event_type").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: uuid("entity_id"),
    actorId: uuid("actor_id").references(() => users.id),
    workItemId: uuid("work_item_id").references(() => workItems.id),
    serviceOrderId: uuid("service_order_id").references(() => serviceOrders.id),
    assetId: uuid("asset_id").references(() => assets.id),
    payload: jsonb("payload").notNull().default({}),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("event_logs_event_type_idx").on(table.eventType),
    index("event_logs_entity_idx").on(table.entityType, table.entityId),
    index("event_logs_occurred_at_idx").on(table.occurredAt),
  ],
);

export const reports = pgTable("reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  type: text("type").notNull().default("operational_summary"),
  periodStart: timestamp("period_start", { withTimezone: true }),
  periodEnd: timestamp("period_end", { withTimezone: true }),
  generatedById: uuid("generated_by_id").references(() => users.id),
  payload: jsonb("payload").notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const entityComments = pgTable(
  "entity_comments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    entityType: text("entity_type").notNull(),
    entityId: uuid("entity_id").notNull(),
    body: text("body").notNull(),
    createdById: uuid("created_by_id").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("entity_comments_entity_idx").on(table.entityType, table.entityId),
    index("entity_comments_created_by_idx").on(table.createdById),
  ],
);

export const entityAttachments = pgTable(
  "entity_attachments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    entityType: text("entity_type").notNull(),
    entityId: uuid("entity_id").notNull(),
    title: text("title").notNull(),
    fileUrl: text("file_url").notNull(),
    mimeType: text("mime_type"),
    createdById: uuid("created_by_id").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("entity_attachments_entity_idx").on(table.entityType, table.entityId),
    index("entity_attachments_created_by_idx").on(table.createdById),
  ],
);

export const queueItems = pgTable(
  "queue_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    queueId: uuid("queue_id").notNull().references(() => workspaceQueues.id),
    entityType: text("entity_type").notNull(),
    entityId: uuid("entity_id").notNull(),
    status: text("status").notNull().default("open"),
    priority: priorityEnum("priority").notNull().default("medium"),
    assignedToId: uuid("assigned_to_id").references(() => users.id),
    dueAt: timestamp("due_at", { withTimezone: true }),
    payload: jsonb("payload").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("queue_items_queue_idx").on(table.queueId),
    index("queue_items_entity_idx").on(table.entityType, table.entityId),
    index("queue_items_status_idx").on(table.status),
  ],
);

export const slaPolicies = pgTable(
  "sla_policies",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id),
    key: text("key").notNull(),
    label: text("label").notNull(),
    targetEntityType: text("target_entity_type").notNull(),
    priority: priorityEnum("priority").notNull().default("medium"),
    responseMinutes: integer("response_minutes").notNull().default(240),
    resolutionMinutes: integer("resolution_minutes").notNull().default(1440),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("sla_policies_workspace_key_uidx").on(table.workspaceId, table.key),
    index("sla_policies_workspace_idx").on(table.workspaceId),
  ],
);

export const schedules = pgTable(
  "schedules",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    technicianProfileId: uuid("technician_profile_id").references(
      () => technicianProfiles.id,
    ),
    teamId: uuid("team_id").references(() => teams.id),
    title: text("title").notNull(),
    type: scheduleTypeEnum("type").notNull().default("expediente"),
    status: scheduleStatusEnum("status").notNull().default("planned"),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true }).notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("schedules_technician_id_idx").on(table.technicianProfileId),
    index("schedules_team_id_idx").on(table.teamId),
    index("schedules_period_idx").on(table.startsAt, table.endsAt),
  ],
);

export const workforceAllocations = pgTable(
  "workforce_allocations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    technicianProfileId: uuid("technician_profile_id")
      .notNull()
      .references(() => technicianProfiles.id),
    teamId: uuid("team_id").references(() => teams.id),
    serviceOrderId: uuid("service_order_id").references(() => serviceOrders.id),
    workItemId: uuid("work_item_id").references(() => workItems.id),
    scheduleId: uuid("schedule_id").references(() => schedules.id),
    allocationType: text("allocation_type").notNull().default("service_order"),
    status: text("status").notNull().default("planned"),
    startsAt: timestamp("starts_at", { withTimezone: true }),
    endsAt: timestamp("ends_at", { withTimezone: true }),
    effortMinutes: integer("effort_minutes"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("workforce_allocations_technician_idx").on(table.technicianProfileId),
    index("workforce_allocations_team_idx").on(table.teamId),
    index("workforce_allocations_service_order_idx").on(table.serviceOrderId),
    index("workforce_allocations_schedule_idx").on(table.scheduleId),
    index("workforce_allocations_status_idx").on(table.status),
  ],
);

export const technicianUnavailabilities = pgTable(
  "technician_unavailabilities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    technicianProfileId: uuid("technician_profile_id")
      .notNull()
      .references(() => technicianProfiles.id),
    reason: text("reason").notNull(),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("technician_unavailabilities_technician_idx").on(table.technicianProfileId),
    index("technician_unavailabilities_starts_at_idx").on(table.startsAt),
  ],
);

export const technicalDocuments = pgTable(
  "technical_documents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    documentType: text("document_type").notNull().default("technical_report"),
    status: documentStatusEnum("status").notNull().default("draft"),
    serviceOrderId: uuid("service_order_id").references(() => serviceOrders.id),
    workItemId: uuid("work_item_id").references(() => workItems.id),
    assetId: uuid("asset_id").references(() => assets.id),
    content: text("content"),
    preparedById: uuid("prepared_by_id").references(() => users.id),
    reviewedById: uuid("reviewed_by_id").references(() => users.id),
    approvedById: uuid("approved_by_id").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("technical_documents_status_idx").on(table.status),
    index("technical_documents_service_order_id_idx").on(table.serviceOrderId),
    index("technical_documents_work_item_id_idx").on(table.workItemId),
  ],
);

export const legacyRecords = pgTable(
  "legacy_records",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    systemName: text("system_name").notNull(),
    protocolNumber: text("protocol_number"),
    externalRecordId: text("external_record_id"),
    externalStatus: text("external_status"),
    syncStatus: legacySyncStatusEnum("sync_status").notNull().default("pending"),
    serviceOrderId: uuid("service_order_id").references(() => serviceOrders.id),
    workItemId: uuid("work_item_id").references(() => workItems.id),
    assetId: uuid("asset_id").references(() => assets.id),
    documentId: uuid("document_id").references(() => technicalDocuments.id),
    exportedAt: timestamp("exported_at", { withTimezone: true }),
    notes: text("notes"),
    payload: jsonb("payload").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("legacy_records_sync_status_idx").on(table.syncStatus),
    index("legacy_records_service_order_id_idx").on(table.serviceOrderId),
    index("legacy_records_document_id_idx").on(table.documentId),
  ],
);

export const integrationPlugins = pgTable(
  "integration_plugins",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    key: text("key").notNull(),
    name: text("name").notNull(),
    provider: text("provider"),
    status: text("status").notNull().default("active"),
    baseUrl: text("base_url"),
    secretRef: text("secret_ref"),
    capabilities: jsonb("capabilities").notNull().default([]),
    config: jsonb("config").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("integration_plugins_key_uidx").on(table.key),
    index("integration_plugins_status_idx").on(table.status),
  ],
);

export const integrationWebhookEvents = pgTable(
  "integration_webhook_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    pluginId: uuid("plugin_id").references(() => integrationPlugins.id),
    pluginKey: text("plugin_key"),
    direction: text("direction").notNull().default("inbound"),
    eventType: text("event_type").notNull(),
    targetModule: text("target_module"),
    status: text("status").notNull().default("received"),
    source: text("source"),
    payload: jsonb("payload").notNull().default({}),
    receivedAt: timestamp("received_at", { withTimezone: true }).notNull().defaultNow(),
    processedAt: timestamp("processed_at", { withTimezone: true }),
    errorMessage: text("error_message"),
  },
  (table) => [
    index("integration_webhook_events_plugin_idx").on(table.pluginId),
    index("integration_webhook_events_type_idx").on(table.eventType),
    index("integration_webhook_events_status_idx").on(table.status),
    index("integration_webhook_events_received_at_idx").on(table.receivedAt),
  ],
);

export const maintenancePlans = pgTable(
  "maintenance_plans",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    status: planningStatusEnum("status").notNull().default("draft"),
    priority: priorityEnum("priority").notNull().default("medium"),
    assetId: uuid("asset_id").references(() => assets.id),
    ownerTeamId: uuid("owner_team_id").references(() => teams.id),
    periodStart: timestamp("period_start", { withTimezone: true }),
    periodEnd: timestamp("period_end", { withTimezone: true }),
    objective: text("objective"),
    checklist: jsonb("checklist").notNull().default([]),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("maintenance_plans_status_idx").on(table.status),
    index("maintenance_plans_asset_id_idx").on(table.assetId),
  ],
);

export const technicalProjects = pgTable(
  "technical_projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    status: planningStatusEnum("status").notNull().default("draft"),
    priority: priorityEnum("priority").notNull().default("medium"),
    sponsor: text("sponsor"),
    assetId: uuid("asset_id").references(() => assets.id),
    workItemId: uuid("work_item_id").references(() => workItems.id),
    startsAt: timestamp("starts_at", { withTimezone: true }),
    targetEndsAt: timestamp("target_ends_at", { withTimezone: true }),
    objective: text("objective"),
    scope: text("scope"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("technical_projects_status_idx").on(table.status),
    index("technical_projects_asset_id_idx").on(table.assetId),
  ],
);

export const acquisitionNeeds = pgTable(
  "acquisition_needs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    status: acquisitionStatusEnum("status").notNull().default("identified"),
    priority: priorityEnum("priority").notNull().default("medium"),
    quantity: integer("quantity").notNull().default(1),
    estimatedCostCents: integer("estimated_cost_cents"),
    justification: text("justification"),
    assetId: uuid("asset_id").references(() => assets.id),
    serviceOrderId: uuid("service_order_id").references(() => serviceOrders.id),
    projectId: uuid("project_id").references(() => technicalProjects.id),
    requestedById: uuid("requested_by_id").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("acquisition_needs_status_idx").on(table.status),
    index("acquisition_needs_asset_id_idx").on(table.assetId),
    index("acquisition_needs_project_id_idx").on(table.projectId),
  ],
);

export const skillCatalog = pgTable(
  "skill_catalog",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    category: text("category"),
    description: text("description"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("skill_catalog_name_idx").on(table.name),
    index("skill_catalog_category_idx").on(table.category),
  ],
);

export const technicianSkills = pgTable(
  "technician_skills",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    technicianProfileId: uuid("technician_profile_id")
      .notNull()
      .references(() => technicianProfiles.id),
    skillId: uuid("skill_id").notNull().references(() => skillCatalog.id),
    proficiency: skillProficiencyEnum("proficiency").notNull().default("basic"),
    certifiedAt: timestamp("certified_at", { withTimezone: true }),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("technician_skills_technician_id_idx").on(table.technicianProfileId),
    index("technician_skills_skill_id_idx").on(table.skillId),
  ],
);

export const trainingRecords = pgTable(
  "training_records",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    technicianProfileId: uuid("technician_profile_id").references(
      () => technicianProfiles.id,
    ),
    skillId: uuid("skill_id").references(() => skillCatalog.id),
    title: text("title").notNull(),
    provider: text("provider"),
    status: trainingStatusEnum("status").notNull().default("planned"),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("training_records_status_idx").on(table.status),
    index("training_records_technician_id_idx").on(table.technicianProfileId),
    index("training_records_skill_id_idx").on(table.skillId),
  ],
);

export const resourceNeeds = pgTable(
  "resource_needs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    category: text("category"),
    status: resourceNeedStatusEnum("status").notNull().default("identified"),
    priority: priorityEnum("priority").notNull().default("medium"),
    quantity: integer("quantity").notNull().default(1),
    justification: text("justification"),
    assetId: uuid("asset_id").references(() => assets.id),
    projectId: uuid("project_id").references(() => technicalProjects.id),
    acquisitionNeedId: uuid("acquisition_need_id").references(() => acquisitionNeeds.id),
    ownerTeamId: uuid("owner_team_id").references(() => teams.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("resource_needs_status_idx").on(table.status),
    index("resource_needs_asset_id_idx").on(table.assetId),
    index("resource_needs_project_id_idx").on(table.projectId),
  ],
);

export const automationRules = pgTable(
  "automation_rules",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    triggerType: text("trigger_type").notNull(),
    status: automationStatusEnum("status").notNull().default("draft"),
    provider: text("provider"),
    endpointUrl: text("endpoint_url"),
    scheduleExpression: text("schedule_expression"),
    description: text("description"),
    lastRunAt: timestamp("last_run_at", { withTimezone: true }),
    payload: jsonb("payload").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("automation_rules_status_idx").on(table.status),
    index("automation_rules_trigger_type_idx").on(table.triggerType),
  ],
);

export const automationRuns = pgTable(
  "automation_runs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    automationRuleId: uuid("automation_rule_id").notNull().references(() => automationRules.id),
    status: text("status").notNull().default("queued"),
    triggerSource: text("trigger_source").notNull().default("manual"),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
    finishedAt: timestamp("finished_at", { withTimezone: true }),
    durationMs: integer("duration_ms"),
    requestPayload: jsonb("request_payload").notNull().default({}),
    responsePayload: jsonb("response_payload").notNull().default({}),
    errorMessage: text("error_message"),
    createdById: uuid("created_by_id").references(() => users.id),
  },
  (table) => [
    index("automation_runs_rule_idx").on(table.automationRuleId),
    index("automation_runs_status_idx").on(table.status),
    index("automation_runs_started_at_idx").on(table.startedAt),
  ],
);

export const automationRunLogs = pgTable(
  "automation_run_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    automationRunId: uuid("automation_run_id").notNull().references(() => automationRuns.id),
    level: text("level").notNull().default("info"),
    message: text("message").notNull(),
    payload: jsonb("payload").notNull().default({}),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("automation_run_logs_run_idx").on(table.automationRunId),
    index("automation_run_logs_occurred_at_idx").on(table.occurredAt),
  ],
);

export const suppliers = pgTable(
  "suppliers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    documentNumber: text("document_number"),
    contactName: text("contact_name"),
    contactEmail: text("contact_email"),
    contactPhone: text("contact_phone"),
    status: supplierStatusEnum("status").notNull().default("prospect"),
    category: text("category"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("suppliers_name_idx").on(table.name),
    index("suppliers_status_idx").on(table.status),
  ],
);

export const supplierContracts = pgTable(
  "supplier_contracts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    supplierId: uuid("supplier_id").notNull().references(() => suppliers.id),
    title: text("title").notNull(),
    status: contractStatusEnum("status").notNull().default("draft"),
    contractNumber: text("contract_number"),
    startsAt: timestamp("starts_at", { withTimezone: true }),
    endsAt: timestamp("ends_at", { withTimezone: true }),
    valueCents: integer("value_cents"),
    scope: text("scope"),
    ownerTeamId: uuid("owner_team_id").references(() => teams.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("supplier_contracts_supplier_id_idx").on(table.supplierId),
    index("supplier_contracts_status_idx").on(table.status),
  ],
);

export const inventoryItems = pgTable(
  "inventory_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sku: text("sku").notNull().unique(),
    name: text("name").notNull(),
    category: text("category"),
    status: inventoryItemStatusEnum("status").notNull().default("available"),
    quantityOnHand: integer("quantity_on_hand").notNull().default(0),
    minimumQuantity: integer("minimum_quantity").notNull().default(0),
    unit: text("unit").notNull().default("un"),
    location: text("location"),
    supplierId: uuid("supplier_id").references(() => suppliers.id),
    assetId: uuid("asset_id").references(() => assets.id),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("inventory_items_sku_idx").on(table.sku),
    index("inventory_items_status_idx").on(table.status),
    index("inventory_items_supplier_id_idx").on(table.supplierId),
  ],
);

export const inventoryMovements = pgTable(
  "inventory_movements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    itemId: uuid("item_id").notNull().references(() => inventoryItems.id),
    movementType: inventoryMovementTypeEnum("movement_type").notNull(),
    quantity: integer("quantity").notNull(),
    serviceOrderId: uuid("service_order_id").references(() => serviceOrders.id),
    acquisitionNeedId: uuid("acquisition_need_id").references(() => acquisitionNeeds.id),
    performedById: uuid("performed_by_id").references(() => users.id),
    notes: text("notes"),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("inventory_movements_item_id_idx").on(table.itemId),
    index("inventory_movements_type_idx").on(table.movementType),
    index("inventory_movements_occurred_at_idx").on(table.occurredAt),
  ],
);

export const complianceAudits = pgTable(
  "compliance_audits",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    area: text("area"),
    status: auditStatusEnum("status").notNull().default("planned"),
    priority: priorityEnum("priority").notNull().default("medium"),
    ownerTeamId: uuid("owner_team_id").references(() => teams.id),
    assetId: uuid("asset_id").references(() => assets.id),
    plannedAt: timestamp("planned_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    summary: text("summary"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("compliance_audits_status_idx").on(table.status),
    index("compliance_audits_asset_id_idx").on(table.assetId),
  ],
);

export const complianceFindings = pgTable(
  "compliance_findings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    auditId: uuid("audit_id").notNull().references(() => complianceAudits.id),
    title: text("title").notNull(),
    severity: findingSeverityEnum("severity").notNull().default("medium"),
    status: findingStatusEnum("status").notNull().default("open"),
    responsibleTeamId: uuid("responsible_team_id").references(() => teams.id),
    dueAt: timestamp("due_at", { withTimezone: true }),
    description: text("description"),
    correctiveAction: text("corrective_action"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("compliance_findings_audit_id_idx").on(table.auditId),
    index("compliance_findings_status_idx").on(table.status),
    index("compliance_findings_severity_idx").on(table.severity),
  ],
);
