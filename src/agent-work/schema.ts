import { pgSchema, text, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";

export const agentWorkSchema = pgSchema("agent_work");

export const agentModules = agentWorkSchema.table("agent_modules", {
  key: text("key").primaryKey(),
  classification: text("classification").notNull(),
  description: text("description"),
});

export const agentModulePaths = agentWorkSchema.table("agent_module_paths", {
  id: text("id").primaryKey(),
  moduleKey: text("module_key").notNull().references(() => agentModules.key),
  pathPattern: text("path_pattern").notNull(),
  ownershipType: text("ownership_type").notNull(),
});

export const agentWorkers = agentWorkSchema.table("agent_workers", {
  key: text("key").primaryKey(),
  role: text("role").notNull(),
  status: text("status").notNull(),
});

export const agentContractVersions = agentWorkSchema.table("agent_contract_versions", {
  id: text("id").primaryKey(),
  contractName: text("contract_name").notNull(),
  version: integer("version").notNull(),
  hash: text("hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const agentExecutionWaves = agentWorkSchema.table("agent_execution_waves", {
  key: text("key").primaryKey(),
  title: text("title").notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const agentWorkPackages = agentWorkSchema.table("agent_work_packages", {
  key: text("key").primaryKey(),
  title: text("title").notNull(),
  moduleKey: text("module_key").notNull(),
  laneKey: text("lane_key").notNull(),
  workerRole: text("worker_role").notNull(),
  waveKey: text("wave_key").notNull(),
  packageSize: text("package_size").notNull(),
  priority: integer("priority").notNull(),
  status: text("status").notNull(),
  objective: text("objective").notNull(),
  expectedOutcome: text("expected_outcome").notNull(),
  entryGate: text("entry_gate"),
  exitGate: text("exit_gate"),
  baseBranch: text("base_branch").notNull(),
  baseSha: text("base_sha").notNull(),
  targetBranch: text("target_branch").notNull(),
  integrationBranch: text("integration_branch").notNull(),
  ownedPaths: jsonb("owned_paths").notNull(),
  readOnlyPaths: jsonb("read_only_paths").notNull(),
  forbiddenPaths: jsonb("forbidden_paths").notNull(),
  readFirst: jsonb("read_first").notNull(),
  requiredTests: jsonb("required_tests").notNull(),
  acceptanceCriteria: jsonb("acceptance_criteria").notNull(),
  documentationImpacts: jsonb("documentation_impacts").notNull(),
  integrationRisk: text("integration_risk").notNull(),
  mergeOrder: integer("merge_order").notNull(),
  rollbackNotes: text("rollback_notes"),
  assignedWorkerKey: text("assigned_worker_key"),
  revision: integer("revision").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
});

export const agentPackageTasks = agentWorkSchema.table("agent_package_tasks", {
  id: text("id").primaryKey(),
  packageKey: text("package_key").notNull().references(() => agentWorkPackages.key),
  description: text("description").notNull(),
  order: integer("order").notNull(),
  status: text("status").notNull(),
});

export const agentPackageDependencies = agentWorkSchema.table("agent_package_dependencies", {
  id: text("id").primaryKey(),
  dependentPackageKey: text("dependent_package_key").notNull().references(() => agentWorkPackages.key),
  requiredPackageKey: text("required_package_key").notNull().references(() => agentWorkPackages.key),
  status: text("status").notNull(),
});

export const agentActiveClaims = agentWorkSchema.table("agent_active_claims", {
  id: text("id").primaryKey(),
  packageKey: text("package_key").notNull().references(() => agentWorkPackages.key),
  workerKey: text("worker_key").notNull().references(() => agentWorkers.key),
  claimedAt: timestamp("claimed_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

export const agentClaimHistory = agentWorkSchema.table("agent_claim_history", {
  id: text("id").primaryKey(),
  packageKey: text("package_key").notNull(),
  workerKey: text("worker_key").notNull(),
  action: text("action").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const agentPathClaims = agentWorkSchema.table("agent_path_claims", {
  id: text("id").primaryKey(),
  path: text("path").notNull(),
  packageKey: text("package_key").notNull().references(() => agentWorkPackages.key),
  claimId: text("claim_id").notNull().references(() => agentActiveClaims.id),
});

export const agentCollisionResults = agentWorkSchema.table("agent_collision_results", {
  id: text("id").primaryKey(),
  waveKey: text("wave_key").notNull(),
  packageKey1: text("package_key_1").notNull(),
  packageKey2: text("package_key_2").notNull(),
  status: text("status").notNull(),
  reason: text("reason").notNull(),
});

export const agentWorkEvents = agentWorkSchema.table("agent_work_events", {
  id: text("id").primaryKey(),
  packageKey: text("package_key"),
  workerKey: text("worker_key"),
  eventType: text("event_type").notNull(),
  payload: jsonb("payload").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const agentArtifacts = agentWorkSchema.table("agent_artifacts", {
  id: text("id").primaryKey(),
  packageKey: text("package_key").notNull().references(() => agentWorkPackages.key),
  path: text("path").notNull(),
  hash: text("hash").notNull(),
});

export const agentCommands = agentWorkSchema.table("agent_commands", {
  id: text("id").primaryKey(),
  packageKey: text("package_key").notNull().references(() => agentWorkPackages.key),
  commandString: text("command_string").notNull(),
  executionStatus: text("execution_status").notNull(),
});

export const agentHandoffs = agentWorkSchema.table("agent_handoffs", {
  id: text("id").primaryKey(),
  fromWorkerKey: text("from_worker_key").notNull(),
  toWorkerKey: text("to_worker_key").notNull(),
  packageKey: text("package_key").notNull().references(() => agentWorkPackages.key),
  notes: text("notes"),
});

export const agentDecisions = agentWorkSchema.table("agent_decisions", {
  id: text("id").primaryKey(),
  packageKey: text("package_key").notNull().references(() => agentWorkPackages.key),
  decision: text("decision").notNull(),
  rationale: text("rationale").notNull(),
});

export const agentDocumentationImpacts = agentWorkSchema.table("agent_documentation_impacts", {
  id: text("id").primaryKey(),
  packageKey: text("package_key").notNull().references(() => agentWorkPackages.key),
  docPath: text("doc_path").notNull(),
  impactDescription: text("impact_description").notNull(),
});

export const agentReviews = agentWorkSchema.table("agent_reviews", {
  id: text("id").primaryKey(),
  packageKey: text("package_key").notNull().references(() => agentWorkPackages.key),
  reviewerWorkerKey: text("reviewer_worker_key").notNull(),
  status: text("status").notNull(),
  comments: text("comments"),
});

export const agentActivityReceipts = agentWorkSchema.table("agent_activity_receipts", {
  id: text("id").primaryKey(),
  packageKey: text("package_key").notNull().references(() => agentWorkPackages.key),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const agentIntegrationReceipts = agentWorkSchema.table("agent_integration_receipts", {
  id: text("id").primaryKey(),
  waveKey: text("wave_key").notNull(),
  status: text("status").notNull(),
  log: text("log").notNull(),
});
