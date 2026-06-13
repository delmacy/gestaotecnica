import { pgSchema, text, integer, timestamp, jsonb, boolean, unique } from "drizzle-orm/pg-core";

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
  allowedRole: text("allowed_role"),
  changeRequestRequired: boolean("change_request_required").default(false),
  integrationRisk: text("integration_risk"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [unique().on(t.moduleKey, t.pathPattern)]);

export const agentWorkers = agentWorkSchema.table("agent_workers", {
  key: text("key").primaryKey(),
  role: text("role").notNull(),
  status: text("status").notNull(),
  moduleKey: text("module_key"),
  name: text("name").notNull(),
  maxActiveClaims: integer("max_active_claims").default(1).notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const agentContractVersions = agentWorkSchema.table("agent_contract_versions", {
  id: text("id").primaryKey(),
  contractName: text("contract_name").notNull(),
  version: text("version").notNull(), // major.minor.patch
  status: text("status").notNull(),
  ownerModuleKey: text("owner_module_key").notNull(),
  consumers: jsonb("consumers").notNull(),
  contentPath: text("content_path").notNull(),
  compatibility: text("compatibility"),
  supersedes: text("supersedes"),
  effectiveFrom: timestamp("effective_from"),
  hash: text("hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const agentExecutionWaves = agentWorkSchema.table("agent_execution_waves", {
  key: text("key").primaryKey(),
  title: text("title").notNull(),
  status: text("status").notNull(),
  objective: text("objective").notNull(),
  baseBranch: text("base_branch").notNull(),
  baseSha: text("base_sha").notNull(),
  integrationBranch: text("integration_branch").notNull(),
  entryGate: text("entry_gate"),
  exitGate: text("exit_gate"),
  mergePolicy: text("merge_policy"),
  rollbackPlan: text("rollback_plan"),
  revision: integer("revision").default(1).notNull(),
  startedAt: timestamp("started_at"),
  finishedAt: timestamp("finished_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
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

  blockedReason: text("blocked_reason"),
  securityGate: text("security_gate"),
  tenancyGate: text("tenancy_gate"),
  migrationGate: text("migration_gate"),
  contractsConsumed: jsonb("contracts_consumed").notNull(),
  contractsProduced: jsonb("contracts_produced").notNull(),
  publicContractsChanged: jsonb("public_contracts_changed").notNull(),
  knownConsumers: jsonb("known_consumers").notNull(),
  schemaImpacts: jsonb("schema_impacts").notNull(),
  reviewBudget: jsonb("review_budget").notNull(),
  createdBy: text("created_by").notNull(),

  revision: integer("revision").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
});

export const agentPackageTasks = agentWorkSchema.table("agent_package_tasks", {
  id: text("id").primaryKey(),
  packageKey: text("package_key").notNull().references(() => agentWorkPackages.key),
  key: text("key").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  order: integer("order").notNull(),
  status: text("status").notNull(),
  taskType: text("task_type").notNull(),
  acceptanceCriteria: jsonb("acceptance_criteria").notNull(),
  expectedArtifacts: jsonb("expected_artifacts").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [unique().on(t.packageKey, t.key)]);

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
  resourceKey: text("resource_key"), // For claims on specific resources
  claimTokenHash: text("claim_token_hash").notNull(),
  heartbeatAt: timestamp("heartbeat_at").defaultNow().notNull(),
  status: text("status").notNull(),
  baseSha: text("base_sha").notNull(),
  claimedAt: timestamp("claimed_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [unique().on(t.packageKey)]);

export const agentClaimHistory = agentWorkSchema.table("agent_claim_history", {
  id: text("id").primaryKey(),
  packageKey: text("package_key").notNull(),
  workerKey: text("worker_key").notNull(),
  action: text("action").notNull(),

  claimedAt: timestamp("claimed_at"),
  heartbeatAt: timestamp("heartbeat_at"),
  expiresAt: timestamp("expires_at"),
  releasedAt: timestamp("released_at"),
  releaseReason: text("release_reason"),
  eventType: text("event_type"),

  timestamp: timestamp("timestamp").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const agentPathClaims = agentWorkSchema.table("agent_path_claims", {
  id: text("id").primaryKey(),
  path: text("path").notNull(),
  packageKey: text("package_key").notNull().references(() => agentWorkPackages.key),
  claimId: text("claim_id").notNull().references(() => agentActiveClaims.id),

  waveKey: text("wave_key").notNull(),
  workerKey: text("worker_key").notNull(),
  pathPattern: text("path_pattern").notNull(),
  ownershipMode: text("ownership_mode").notNull(),
  claimedAt: timestamp("claimed_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  status: text("status").notNull(),
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

  waveKey: text("wave_key"),
  taskKey: text("task_key"),
  actorKey: text("actor_key"),
  message: text("message"),
  correlationId: text("correlation_id"),
  causationId: text("causation_id"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Artifacts, Commands, etc omitted for brevity but can be added back if needed
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
  path: text("path").notNull(),
  baseSha: text("base_sha").notNull(),
  headSha: text("head_sha").notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const agentIntegrationReceipts = agentWorkSchema.table("agent_integration_receipts", {
  id: text("id").primaryKey(),
  waveKey: text("wave_key").notNull(),
  status: text("status").notNull(),
  log: text("log").notNull(),
  path: text("path").notNull(),
  baseSha: text("base_sha").notNull(),
  headSha: text("head_sha").notNull(),
});

export const agentReviewPackages = agentWorkSchema.table("agent_review_packages", {
  id: text("id").primaryKey(),
  key: text("key").notNull(),
  workPackageKey: text("work_package_key").notNull().references(() => agentWorkPackages.key),
  moduleKey: text("module_key").notNull(),
  laneKey: text("lane_key").notNull(),
  waveKey: text("wave_key").notNull(),
  pullRequest: text("pull_request"),
  baseSha: text("base_sha").notNull(),
  headSha: text("head_sha").notNull(),
  status: text("status").notNull(),
  objective: text("objective").notNull(),
  integrationRisk: text("integration_risk").notNull(),

  changedFiles: jsonb("changed_files").notNull(),
  productionFiles: jsonb("production_files").notNull(),
  testFiles: jsonb("test_files").notNull(),
  documentationFiles: jsonb("documentation_files").notNull(),
  migrationFiles: jsonb("migration_files").notNull(),
  generatedFiles: jsonb("generated_files").notNull(),
  lockfiles: jsonb("lockfiles").notNull(),
  changedLinesExcludingGenerated: integer("changed_lines_excluding_generated").notNull(),

  contractsConsumed: jsonb("contracts_consumed").notNull(),
  contractsProduced: jsonb("contracts_produced").notNull(),
  publicContractsChanged: jsonb("public_contracts_changed").notNull(),
  knownConsumers: jsonb("known_consumers").notNull(),
  directDependencies: jsonb("direct_dependencies").notNull(),

  reviewTypesRequired: jsonb("review_types_required").notNull(),
  reviewBudget: jsonb("review_budget").notNull(),
  scopeCheckResult: text("scope_check_result").notNull(),
  scopeExceededReasons: jsonb("scope_exceeded_reasons"),

  assignedReviewerKey: text("assigned_reviewer_key"),

  revision: integer("revision").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
});

export const agentReviewClaims = agentWorkSchema.table("agent_review_claims", {
  id: text("id").primaryKey(),
  reviewPackageKey: text("review_package_key").notNull().references(() => agentReviewPackages.key),
  reviewerKey: text("reviewer_key").notNull().references(() => agentWorkers.key),
  reviewType: text("review_type").notNull(),
  status: text("status").notNull(),
  claimTokenHash: text("claim_token_hash").notNull(),
  claimedAt: timestamp("claimed_at").defaultNow().notNull(),
  heartbeatAt: timestamp("heartbeat_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  releasedAt: timestamp("released_at"),
  releaseReason: text("release_reason"),
});
