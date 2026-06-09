import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";

// 1. agent_domains
export const agentDomains = pgTable("agent_domains", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").unique().notNull(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull().default("platform"),
  isCore: boolean("is_core").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// 2. jules_workers
export const julesWorkers = pgTable("jules_workers", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").unique().notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  domainKey: text("domain_key").notNull(),
  scope: text("scope"),
  description: text("description"),
  status: text("status").notNull().default("active"),
  maxActiveClaims: integer("max_active_claims").notNull().default(1),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// 3. agent_work_jobs
export const agentWorkJobs = pgTable("agent_work_jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").unique().notNull(),
  title: text("title").notNull(),
  summary: text("summary"),
  description: text("description").notNull(),
  domainKey: text("domain_key").notNull(),
  role: text("role").notNull(),
  status: text("status").notNull().default("planned"),
  priority: text("priority").notNull().default("medium"),
  phaseKey: text("phase_key"),
  parentJobKey: text("parent_job_key"),
  sourceType: text("source_type").notNull().default("manual"),
  sourcePath: text("source_path"),
  sourceHash: text("source_hash"),
  promptSummary: text("prompt_summary"),
  instructionsMd: text("instructions_md"),
  allowedPaths: jsonb("allowed_paths").notNull().default([]),
  forbiddenPaths: jsonb("forbidden_paths").notNull().default([]),
  acceptanceCriteria: jsonb("acceptance_criteria").notNull().default([]),
  expectedOutputs: jsonb("expected_outputs").notNull().default([]),
  blockingReason: text("blocking_reason"),
  githubIssue: text("github_issue"),
  githubPr: text("github_pr"),
  branchName: text("branch_name"),
  createdBy: text("created_by").notNull().default("system"),
  assignedTo: text("assigned_to"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  startedAt: timestamp("started_at", { withTimezone: true }),
  readyForReviewAt: timestamp("ready_for_review_at", { withTimezone: true }),
  finishedAt: timestamp("finished_at", { withTimezone: true }),
});

// 4. agent_task_boxes
export const agentTaskBoxes = pgTable("agent_task_boxes", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobKey: text("job_key").notNull(),
  key: text("key").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("planned"),
  sortOrder: integer("sort_order").notNull().default(0),
  isRequired: boolean("is_required").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// 5. agent_work_tasks
export const agentWorkTasks = pgTable("agent_work_tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobKey: text("job_key").notNull(),
  boxKey: text("box_key").notNull(),
  key: text("key").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  taskType: text("task_type").notNull().default("implementation"),
  status: text("status").notNull().default("planned"),
  priority: text("priority").notNull().default("medium"),
  sortOrder: integer("sort_order").notNull().default(0),
  assignedWorkerKey: text("assigned_worker_key"),
  allowedPaths: jsonb("allowed_paths").notNull().default([]),
  forbiddenPaths: jsonb("forbidden_paths").notNull().default([]),
  acceptanceCriteria: jsonb("acceptance_criteria").notNull().default([]),
  expectedArtifacts: jsonb("expected_artifacts").notNull().default([]),
  blockingReason: text("blocking_reason"),
  sourcePath: text("source_path"),
  sourceAnchor: text("source_anchor"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  startedAt: timestamp("started_at", { withTimezone: true }),
  finishedAt: timestamp("finished_at", { withTimezone: true }),
});

// 6. agent_work_task_dependencies
export const agentWorkTaskDependencies = pgTable("agent_work_task_dependencies", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobKey: text("job_key").notNull(),
  taskKey: text("task_key").notNull(),
  dependsOnTaskKey: text("depends_on_task_key").notNull(),
  dependencyType: text("dependency_type").notNull().default("blocks"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// 7. agent_work_job_dependencies
export const agentWorkJobDependencies = pgTable("agent_work_job_dependencies", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobKey: text("job_key").notNull(),
  dependsOnJobKey: text("depends_on_job_key").notNull(),
  dependencyType: text("dependency_type").notNull().default("blocks"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// 8. agent_work_claims
export const agentWorkClaims = pgTable("agent_work_claims", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobKey: text("job_key").notNull(),
  taskKey: text("task_key"),
  workerKey: text("worker_key").notNull(),
  claimStatus: text("claim_status").notNull().default("active"),
  claimedAt: timestamp("claimed_at", { withTimezone: true }).notNull().defaultNow(),
  releasedAt: timestamp("released_at", { withTimezone: true }),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  notes: text("notes"),
});

// 9. agent_work_events
export const agentWorkEvents = pgTable("agent_work_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobKey: text("job_key").notNull(),
  taskKey: text("task_key"),
  eventType: text("event_type").notNull(),
  actorKey: text("actor_key").notNull(),
  message: text("message").notNull(),
  payload: jsonb("payload").notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// 10. agent_work_artifacts
export const agentWorkArtifacts = pgTable("agent_work_artifacts", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobKey: text("job_key").notNull(),
  taskKey: text("task_key"),
  artifactType: text("artifact_type").notNull(),
  path: text("path").notNull(),
  description: text("description"),
  changeType: text("change_type"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// 11. agent_work_commands
export const agentWorkCommands = pgTable("agent_work_commands", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobKey: text("job_key").notNull(),
  taskKey: text("task_key"),
  command: text("command").notNull(),
  status: text("status").notNull(),
  outputSummary: text("output_summary"),
  errorSummary: text("error_summary"),
  executedAt: timestamp("executed_at", { withTimezone: true }).notNull().defaultNow(),
});

// 12. agent_work_handoffs
export const agentWorkHandoffs = pgTable("agent_work_handoffs", {
  id: uuid("id").primaryKey().defaultRandom(),
  fromJobKey: text("from_job_key").notNull(),
  toJobKey: text("to_job_key"),
  fromTaskKey: text("from_task_key"),
  toTaskKey: text("to_task_key"),
  fromWorkerKey: text("from_worker_key").notNull(),
  toWorkerKey: text("to_worker_key"),
  summary: text("summary").notNull(),
  requiredAction: text("required_action"),
  status: text("status").notNull().default("open"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
});

// 13. agent_work_decisions
export const agentWorkDecisions = pgTable("agent_work_decisions", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobKey: text("job_key"),
  taskKey: text("task_key"),
  decisionKey: text("decision_key").unique().notNull(),
  title: text("title").notNull(),
  decision: text("decision").notNull(),
  rationale: text("rationale"),
  status: text("status").notNull().default("active"),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  supersededBy: text("superseded_by"),
});

// 14. agent_markdown_sources
export const agentMarkdownSources = pgTable("agent_markdown_sources", {
  id: uuid("id").primaryKey().defaultRandom(),
  sourcePath: text("source_path").unique().notNull(),
  sourceType: text("source_type").notNull(),
  sourceHash: text("source_hash").notNull(),
  title: text("title"),
  importedStatus: text("imported_status").notNull().default("pending"),
  importedAt: timestamp("imported_at", { withTimezone: true }),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
  createdJobKey: text("created_job_key"),
  notes: text("notes"),
});

// 15. agent_markdown_imports
export const agentMarkdownImports = pgTable("agent_markdown_imports", {
  id: uuid("id").primaryKey().defaultRandom(),
  importKey: text("import_key").unique().notNull(),
  status: text("status").notNull().default("started"),
  sourceGlob: text("source_glob").notNull(),
  filesSeen: integer("files_seen").notNull().default(0),
  filesImported: integer("files_imported").notNull().default(0),
  filesSkipped: integer("files_skipped").notNull().default(0),
  filesFailed: integer("files_failed").notNull().default(0),
  summary: text("summary"),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  finishedAt: timestamp("finished_at", { withTimezone: true }),
});

// 16. agent_work_dumps
export const agentWorkDumps = pgTable("agent_work_dumps", {
  id: uuid("id").primaryKey().defaultRandom(),
  dumpKey: text("dump_key").unique().notNull(),
  path: text("path").notNull(),
  generatedAt: timestamp("generated_at", { withTimezone: true }).notNull().defaultNow(),
  summary: text("summary"),
  contentHash: text("content_hash"),
  jobCount: integer("job_count").notNull().default(0),
  taskCount: integer("task_count").notNull().default(0),
  blockedCount: integer("blocked_count").notNull().default(0),
  readyCount: integer("ready_count").notNull().default(0),
});
