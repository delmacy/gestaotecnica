import { getAgentWorkDb } from "../db";
import {
  agentExecutionWaves,
  agentModules,
  agentPackageDependencies,
  agentPackageTasks,
  agentWorkers,
  agentWorkPackages,
} from "../schema";

const reviewBudget = {
  production_files: 20,
  total_changed_files: 35,
  changed_lines_excluding_generated: 1500,
  public_contracts_changed: 3,
  modules_touched: 1,
};

const packageDefinitions = [
  {
    key: "PKG-SHARED-CONTRACTS-001",
    title: "Shared Contracts",
    moduleKey: "shared-contracts",
    workerRole: "module_worker",
    ownedPaths: ["src/platform/contracts/**"],
    readOnlyPaths: ["docs/ARCHITECTURE.md", "docs/DEVELOPMENT_RULES.md"],
    readFirst: ["docs/ARCHITECTURE.md", "docs/DEVELOPMENT_RULES.md", "docs/modules/MODULE_PUBLIC_CONTRACT_INDEX.md"],
    requiredTests: ["npm run test:unit -- --test-name-pattern=contract", "npm run build"],
    acceptanceCriteria: ["Shared schemas expose stable exported types", "Contract validation rejects invalid canonical payloads"],
    documentationImpacts: ["docs/modules/MODULE_PUBLIC_CONTRACT_INDEX.md"],
    contractsConsumed: [],
    contractsProduced: ["platform-shared-contracts"],
    publicContractsChanged: ["platform-shared-contracts"],
    objective: "Define canonical shared schemas used by Wave 01 packages",
    expectedOutcome: "Validated shared contracts with stable exports",
    tasks: [
      ["Inventory shared contract exports", "Document every shared export consumed by Wave 01", ["docs/modules/MODULE_PUBLIC_CONTRACT_INDEX.md"]],
      ["Implement canonical shared schemas", "Create typed schemas at the owned contract paths", ["src/platform/contracts/index.ts"]],
      ["Verify invalid and valid payloads", "Add focused contract validation tests", ["tests/unit/shared-contracts.test.ts"]],
      ["Record contract compatibility", "Document produced contracts and consumers", ["docs/modules/MODULE_PUBLIC_CONTRACT_INDEX.md"]],
    ],
  },
  {
    key: "PKG-RUNTIME-TYPES-MAPPERS-001",
    title: "Runtime Types and Mappers",
    moduleKey: "runtime-engine",
    workerRole: "module_worker",
    ownedPaths: ["src/platform/workflows/runtime/types/**", "src/platform/workflows/runtime/mappers/**"],
    readOnlyPaths: ["src/platform/contracts/**", "docs/runtime/RUNTIME_CANONICAL_CONTRACT.md"],
    readFirst: ["docs/runtime/RUNTIME_CANONICAL_CONTRACT.md", "docs/runtime/RUNTIME_PAYLOAD_CONTRACT.md", "src/platform/contracts/index.ts"],
    requiredTests: ["npm run test:unit -- --test-name-pattern=runtime", "npm run build"],
    acceptanceCriteria: ["Runtime mappers preserve canonical identifiers", "Mapper tests cover valid and rejected payloads"],
    documentationImpacts: ["docs/runtime/RUNTIME_CANONICAL_CONTRACT.md"],
    contractsConsumed: ["platform-shared-contracts"],
    contractsProduced: ["runtime-type-mappers"],
    publicContractsChanged: ["runtime-type-mappers"],
    objective: "Implement runtime types and mappers against shared contracts",
    expectedOutcome: "Runtime payloads map deterministically to canonical types",
    tasks: [
      ["Map canonical runtime identifiers", "Implement deterministic runtime identifier mapping", ["src/platform/workflows/runtime/mappers/identifiers.ts"]],
      ["Define runtime mapper input types", "Define typed mapper boundaries", ["src/platform/workflows/runtime/types/mappers.ts"]],
      ["Test runtime mapper behavior", "Verify mapping and rejection behavior", ["tests/unit/runtime-mappers.test.ts"]],
      ["Update runtime contract mapping", "Record mapper compatibility and public exports", ["docs/runtime/RUNTIME_CANONICAL_CONTRACT.md"]],
    ],
  },
  {
    key: "PKG-RUNTIME-TENANCY-001",
    title: "Runtime Tenancy",
    moduleKey: "runtime-engine",
    workerRole: "module_worker",
    ownedPaths: ["src/platform/workflows/runtime/tenancy/**"],
    readOnlyPaths: ["src/platform/workflows/runtime/types/**", "docs/runtime/RUNTIME_TENANCY_SECURITY_CONTRACT.md"],
    readFirst: ["docs/runtime/RUNTIME_TENANCY_SECURITY_CONTRACT.md", "docs/runtime/RUNTIME_CANONICAL_CONTRACT.md"],
    requiredTests: ["npm run test:unit -- --test-name-pattern=tenancy", "npm run build"],
    acceptanceCriteria: ["Every runtime tenancy mapper requires workspace_id", "Cross-workspace inputs are rejected"],
    documentationImpacts: ["docs/runtime/RUNTIME_TENANCY_SECURITY_CONTRACT.md"],
    contractsConsumed: ["runtime-type-mappers"],
    contractsProduced: ["runtime-tenancy-mappers"],
    publicContractsChanged: [],
    objective: "Apply workspace tenancy rules to runtime mapper boundaries",
    expectedOutcome: "Runtime mapping rejects missing or divergent workspace context",
    tasks: [
      ["Define tenancy mapper boundary", "Require workspace context on tenancy inputs", ["src/platform/workflows/runtime/tenancy/types.ts"]],
      ["Implement workspace validation", "Reject missing and divergent workspace identifiers", ["src/platform/workflows/runtime/tenancy/validate.ts"]],
      ["Test tenancy isolation", "Cover allowed and denied workspace mappings", ["tests/unit/runtime-tenancy.test.ts"]],
      ["Document tenancy enforcement", "Record mapper tenancy guarantees", ["docs/runtime/RUNTIME_TENANCY_SECURITY_CONTRACT.md"]],
    ],
  },
  {
    key: "PKG-EVENT-TYPES-MAPPERS-001",
    title: "Event Types and Mappers",
    moduleKey: "events-receipts",
    workerRole: "module_worker",
    ownedPaths: ["src/platform/events/types/**", "src/platform/events/mappers/**"],
    readOnlyPaths: ["src/platform/contracts/**", "docs/events/EVENT_CANONICAL_ENVELOPE.md"],
    readFirst: ["docs/events/EVENT_CANONICAL_ENVELOPE.md", "docs/events/EVENT_TYPE_TAXONOMY.md", "src/platform/contracts/index.ts"],
    requiredTests: ["npm run test:unit -- --test-name-pattern=event", "npm run build"],
    acceptanceCriteria: ["Event mapper emits canonical envelope fields", "Event mapper preserves correlation and causation identifiers"],
    documentationImpacts: ["docs/events/EVENT_CANONICAL_ENVELOPE.md"],
    contractsConsumed: ["platform-shared-contracts"],
    contractsProduced: ["event-type-mappers"],
    publicContractsChanged: ["event-type-mappers"],
    objective: "Implement event types and canonical envelope mappers",
    expectedOutcome: "Events map to the canonical envelope without losing trace identifiers",
    tasks: [
      ["Define event mapper types", "Type the canonical event mapper boundary", ["src/platform/events/types/mappers.ts"]],
      ["Implement canonical envelope mapping", "Map events while preserving trace identifiers", ["src/platform/events/mappers/canonical-envelope.ts"]],
      ["Test event mapping", "Verify required envelope and trace fields", ["tests/unit/event-mappers.test.ts"]],
      ["Update event contract index", "Record public event mapper exports", ["docs/events/EVENT_CANONICAL_ENVELOPE.md"]],
    ],
  },
  {
    key: "PKG-OPERATION-DOCS-FOUNDATION-001",
    title: "Operation Docs Foundation",
    moduleKey: "documentation-governance",
    workerRole: "documentator",
    ownedPaths: ["docs/agent-work/**"],
    readOnlyPaths: ["src/agent-work/**", "docs/00-current/WORK_BOARD.md"],
    readFirst: ["docs/agent-work/JULES_BOOTSTRAP.md", "docs/agent-work/WAVE_EXECUTION_POLICY.md", "docs/agent-work/DEFINITION_OF_DONE.md"],
    requiredTests: ["npm run agent-work -- db:check", "npm run build"],
    acceptanceCriteria: ["Bootstrap documentation names real commands and artifacts", "Wave policy documents stop and rollback conditions"],
    documentationImpacts: ["docs/agent-work/JULES_BOOTSTRAP.md", "docs/agent-work/WAVE_EXECUTION_POLICY.md"],
    contractsConsumed: ["platform-shared-contracts", "runtime-type-mappers", "event-type-mappers"],
    contractsProduced: ["wave-01-operation-docs"],
    publicContractsChanged: [],
    objective: "Document the executable Wave 01 worker and review flow",
    expectedOutcome: "Operators can bootstrap, stop, review, and roll back Wave 01",
    tasks: [
      ["Verify bootstrap commands", "Document executable worker bootstrap commands", ["docs/agent-work/JULES_BOOTSTRAP.md"]],
      ["Document stop conditions", "Record lease, collision, and dependency stop conditions", ["docs/agent-work/WAVE_EXECUTION_POLICY.md"]],
      ["Document review handoff", "Record Review Kit and Receipt handoff", ["docs/agent-work/JULES_REVIEWER_PLAYBOOK.md"]],
      ["Document rollback order", "Record package rollback order and ownership", ["docs/agent-work/WAVE_INTEGRATION_POLICY.md"]],
    ],
  },
] as const;

export async function seedWave01(baseSha: string) {
  if (!baseSha || !/^[0-9a-f]{40}$/i.test(baseSha) || ["1234567890123456789012345678901234567890"].includes(baseSha)) {
    throw new Error("A valid real base SHA must be provided.");
  }
  const db = getAgentWorkDb();
  await db.insert(agentModules).values([
    { key: "shared-contracts", classification: "shared", description: "Shared public contracts" },
    { key: "runtime-engine", classification: "platform", description: "Runtime engine" },
    { key: "events-receipts", classification: "platform", description: "Events and receipts" },
    { key: "documentation-governance", classification: "governance", description: "Operational documentation" },
  ]).onConflictDoNothing();
  await db.insert(agentWorkers).values([
    { key: "jules-dev-shared-contracts-01", name: "Dev Shared Contracts", role: "module_worker", moduleKey: "shared-contracts", status: "active", maxActiveClaims: 1 },
    { key: "jules-dev-runtime-types-01", name: "Dev Runtime Types", role: "module_worker", moduleKey: "runtime-engine", status: "active", maxActiveClaims: 1 },
    { key: "jules-dev-events-01", name: "Dev Events", role: "module_worker", moduleKey: "events-receipts", status: "active", maxActiveClaims: 1 },
    { key: "jules-documentator-01", name: "Documentator", role: "documentator", moduleKey: "documentation-governance", status: "active", maxActiveClaims: 1 },
    ...["module", "contract", "security", "tenancy", "migration", "documentation", "integration"].map((type) => ({
      key: `jules-reviewer-${type}-01`, name: `Reviewer ${type}`, role: "reviewer", status: "active", maxActiveClaims: 4, metadata: { reviewTypes: [type] },
    })),
    { key: "jules-integrator-01", name: "Integrator", role: "integrator", status: "active", maxActiveClaims: 1 },
    { key: "jules-coordinator-01", name: "Coordinator", role: "coordinator", status: "active", maxActiveClaims: 1 },
  ]).onConflictDoNothing();
  await db.insert(agentExecutionWaves).values({
    key: "WAVE-01-FOUNDATION", title: "Foundation Wave", status: "planned", objective: "Prove safe parallel foundation work",
    baseBranch: "main", baseSha, integrationBranch: "integration/wave-01", rollbackPlan: "Release claims and revert packages in reverse merge order",
  }).onConflictDoNothing();

  for (const [index, definition] of packageDefinitions.entries()) {
    await db.insert(agentWorkPackages).values({
      ...definition, laneKey: `lane-${index + 1}`, waveKey: "WAVE-01-FOUNDATION", packageSize: "M", priority: index + 1,
      status: definition.key === "PKG-RUNTIME-TENANCY-001" ? "blocked" : "ready", baseBranch: "main", baseSha,
      targetBranch: `wave-01/${definition.key.toLowerCase()}`, integrationBranch: "integration/wave-01", forbiddenPaths: [],
      integrationRisk: definition.key.includes("TENANCY") ? "high" : "medium", mergeOrder: index + 1,
      knownConsumers: [], schemaImpacts: [], reviewBudget, rollbackNotes: `Revert ${definition.key} before its consumers`,
      createdBy: "AGENT-FACTORY-OPERATIONAL-PROOF-001",
      blockedReason: definition.key === "PKG-RUNTIME-TENANCY-001" ? "Depends on PKG-RUNTIME-TYPES-MAPPERS-001" : null,
      tenancyGate: definition.key === "PKG-RUNTIME-TENANCY-001" ? "required" : null,
    }).onConflictDoNothing();
    await db.insert(agentPackageTasks).values(definition.tasks.map(([title, description, artifacts], taskIndex) => ({
      id: `${definition.key}-TASK-${taskIndex + 1}`, key: `TASK-${taskIndex + 1}`, packageKey: definition.key, title, description,
      order: taskIndex + 1, status: "pending", taskType: title.toLowerCase().includes("test") ? "test" : "implementation",
      acceptanceCriteria: [definition.acceptanceCriteria[Math.min(taskIndex, definition.acceptanceCriteria.length - 1)]], expectedArtifacts: artifacts,
    }))).onConflictDoNothing();
  }
  await db.insert(agentPackageDependencies).values({
    id: "DEP-RUNTIME-TENANCY-TYPES", dependentPackageKey: "PKG-RUNTIME-TENANCY-001",
    requiredPackageKey: "PKG-RUNTIME-TYPES-MAPPERS-001", status: "pending",
  }).onConflictDoNothing();
}
