import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
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
