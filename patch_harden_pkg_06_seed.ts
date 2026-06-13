import { createAgentWorkDb } from "./src/agent-work/db";
import {
  agentModules,
  agentWorkers,
  agentExecutionWaves,
  agentWorkPackages,
  agentPackageTasks
} from "./src/agent-work/schema";
import { sql } from "drizzle-orm";

async function seed() {
  const db = createAgentWorkDb();

  // Seed modules
  await db.insert(agentModules).values([
    { key: "shared-contracts", classification: "core", description: "Shared contracts module" },
    { key: "runtime", classification: "core", description: "Runtime module" },
    { key: "events", classification: "core", description: "Events module" },
    { key: "operations-docs", classification: "docs", description: "Operations docs module" },
  ]).onConflictDoNothing();

  // Seed workers
  await db.insert(agentWorkers).values([
    { key: "jules-dev-shared-contracts-01", name: "Jules Dev Shared", role: "developer", status: "active", moduleKey: "shared-contracts" },
    { key: "jules-dev-runtime-01", name: "Jules Dev Runtime", role: "developer", status: "active", moduleKey: "runtime" },
    { key: "jules-dev-events-01", name: "Jules Dev Events", role: "developer", status: "active", moduleKey: "events" },
    { key: "jules-dev-operations-docs-01", name: "Jules Dev Docs", role: "documentator", status: "active", moduleKey: "operations-docs" },
    { key: "jules-reviewer-01", name: "Jules Reviewer", role: "reviewer", status: "active" },
    { key: "jules-integrator-01", name: "Jules Integrator", role: "integrator", status: "active" },
  ]).onConflictDoNothing();

  // Seed wave
  const waveKey = "WAVE-01-FOUNDATION";
  await db.insert(agentExecutionWaves).values({
    key: waveKey,
    title: "Wave 01 Foundation",
    status: "planned",
    objective: "Establish foundation",
    baseBranch: "main",
    baseSha: "1234567890123456789012345678901234567890",
    integrationBranch: "integration/WAVE-01",
  }).onConflictDoNothing();

  const basePkg = {
    waveKey,
    status: "ready",
    laneKey: "main",
    packageSize: "M",
    priority: 1,
    baseBranch: "main",
    baseSha: "1234567890123456789012345678901234567890",
    targetBranch: "main",
    integrationBranch: "integration/WAVE-01",
    readOnlyPaths: [],
    forbiddenPaths: [],
    readFirst: ["AGENTS.md"],
    requiredTests: ["test:unit"],
    acceptanceCriteria: ["All tests pass"],
    documentationImpacts: ["docs/API.md"],
    integrationRisk: "low",
    mergeOrder: 1,
    createdBy: "system",
    contractsConsumed: [],
    contractsProduced: [],
    publicContractsChanged: [],
    knownConsumers: [],
    schemaImpacts: [],
    reviewBudget: { production_files: 20 },
  };

  // Seed packages
  await db.insert(agentWorkPackages).values([
    {
      ...basePkg,
      key: "PKG-SHARED-CONTRACTS-001",
      title: "Shared Contracts",
      moduleKey: "shared-contracts",
      workerRole: "developer",
      objective: "Create shared contracts",
      expectedOutcome: "Contracts created",
      ownedPaths: ["src/shared/contracts/**"],
    },
    {
      ...basePkg,
      key: "PKG-RUNTIME-TYPES-MAPPERS-001",
      title: "Runtime Types Mappers",
      moduleKey: "runtime",
      workerRole: "developer",
      objective: "Create types mappers",
      expectedOutcome: "Mappers created",
      ownedPaths: ["src/features/workflow/runtime/types/**"],
    },
    {
      ...basePkg,
      key: "PKG-RUNTIME-TENANCY-001",
      title: "Runtime Tenancy",
      moduleKey: "runtime",
      workerRole: "developer",
      objective: "Implement tenancy",
      expectedOutcome: "Tenancy implemented",
      ownedPaths: ["src/features/workflow/runtime/repositories/**"],
      mergeOrder: 2,
    },
    {
      ...basePkg,
      key: "PKG-EVENT-TYPES-MAPPERS-001",
      title: "Event Types Mappers",
      moduleKey: "events",
      workerRole: "developer",
      objective: "Create event mappers",
      expectedOutcome: "Event mappers created",
      ownedPaths: ["src/features/workflow/runtime/events/**"],
    },
    {
      ...basePkg,
      key: "PKG-OPERATION-DOCS-FOUNDATION-001",
      title: "Operation Docs Foundation",
      moduleKey: "operations-docs",
      workerRole: "documentator",
      objective: "Create docs foundation",
      expectedOutcome: "Docs foundation created",
      ownedPaths: ["docs/agent-work/**"],
    }
  ]).onConflictDoNothing();

  const pkgs = await db.select().from(agentWorkPackages);
  for (const pkg of pkgs) {
      await db.insert(agentPackageTasks).values([
          {
             id: crypto.randomUUID(),
             packageKey: pkg.key,
             key: `${pkg.key}-T01`,
             title: "Task 1",
             description: "Task 1",
             order: 1,
             status: "pending",
             taskType: "implementation",
             acceptanceCriteria: ["AC 1"],
             expectedArtifacts: ["file 1"],
          },
          {
             id: crypto.randomUUID(),
             packageKey: pkg.key,
             key: `${pkg.key}-T02`,
             title: "Task 2",
             description: "Task 2",
             order: 2,
             status: "pending",
             taskType: "implementation",
             acceptanceCriteria: ["AC 2"],
             expectedArtifacts: ["file 2"],
          },
          {
             id: crypto.randomUUID(),
             packageKey: pkg.key,
             key: `${pkg.key}-T03`,
             title: "Task 3",
             description: "Task 3",
             order: 3,
             status: "pending",
             taskType: "implementation",
             acceptanceCriteria: ["AC 3"],
             expectedArtifacts: ["file 3"],
          }
      ]).onConflictDoNothing();
  }

  console.log("Seeds added");
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
