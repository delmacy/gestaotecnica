import { getAgentWorkDb } from "../db";
import { agentWorkers, agentExecutionWaves, agentWorkPackages } from "../schema";

export async function seedInitialData() {
  await getAgentWorkDb().insert(agentWorkers).values([
    { key: "jules-coordinator-01", role: "coordinator", status: "active", name: "Coordinator" },
    { key: "jules-reviewer-01", role: "reviewer", status: "active", name: "Reviewer" },
    { key: "jules-integrator-01", role: "integrator", status: "active", name: "Integrator" },
    { key: "jules-documentator-01", role: "documentator", status: "active", name: "Documentator" },
    { key: "jules-dev-shared-contracts-01", role: "module_worker", status: "active", name: "Dev Shared Contracts" },
    { key: "jules-dev-runtime-01", role: "module_worker", status: "active", name: "Dev Runtime 01" },
    { key: "jules-dev-runtime-02", role: "module_worker", status: "active", name: "Dev Runtime 02" },
    { key: "jules-dev-events-01", role: "module_worker", status: "active", name: "Dev Events 01" },
    { key: "jules-dev-integrations-01", role: "module_worker", status: "active", name: "Dev Integrations 01" },
    { key: "jules-dev-operations-docs-01", role: "documentator", status: "active", name: "Dev Ops Docs 01" },
  ]).onConflictDoNothing();

  await getAgentWorkDb().insert(agentExecutionWaves).values([
    { key: "WAVE-01-FOUNDATION", title: "Foundation Wave", status: "planned", objective: "Foundation", baseBranch: "main", baseSha: "latest", integrationBranch: "integration/wave-01" },
    { key: "WAVE-02-CONSISTENCY", title: "Consistency Wave", status: "planned", objective: "Consistency", baseBranch: "main", baseSha: "latest", integrationBranch: "integration/wave-02" },
    { key: "WAVE-03-CONTROLLED-EXECUTION", title: "Execution Wave", status: "planned", objective: "Execution", baseBranch: "main", baseSha: "latest", integrationBranch: "integration/wave-03" },
  ]).onConflictDoNothing();

  await getAgentWorkDb().insert(agentWorkPackages).values([
    {
      key: "PKG-SHARED-CONTRACTS-001",
      title: "Shared Contracts",
      moduleKey: "shared-contracts",
      laneKey: "lane1",
      workerRole: "module_worker",
      waveKey: "WAVE-01-FOUNDATION",
      packageSize: "M",
      priority: 1,
      status: "planned",
      objective: "Define basic type schemas",
      expectedOutcome: "Zod schemas for base concepts",
      baseBranch: "main",
      baseSha: "latest",
      targetBranch: "feat/shared-contracts",
      integrationBranch: "integration/wave-01",
      ownedPaths: ["src/shared/contracts/**"],
      readOnlyPaths: [],
      forbiddenPaths: [],
      readFirst: [],
      requiredTests: [],
      acceptanceCriteria: [],
      documentationImpacts: [],
      integrationRisk: "low",
      mergeOrder: 1,
      contractsConsumed: [],
      contractsProduced: [],
      publicContractsChanged: [],
      knownConsumers: [],
      schemaImpacts: [],
      reviewBudget: {},
      createdBy: "seed"
    },

    {
      key: "PKG-RUNTIME-TYPES-MAPPERS-001",
      title: "Runtime Types",
      moduleKey: "runtime-engine",
      laneKey: "lane2",
      workerRole: "module_worker",
      waveKey: "WAVE-01-FOUNDATION",
      packageSize: "M",
      priority: 2,
      status: "planned",
      objective: "Define runtime type maps",
      expectedOutcome: "Mappers for runtime execution",
      baseBranch: "main",
      baseSha: "latest",
      targetBranch: "feat/runtime-types",
      integrationBranch: "integration/wave-01",
      ownedPaths: ["src/modules/runtime/**"],
      readOnlyPaths: [],
      forbiddenPaths: [],
      readFirst: [],
      requiredTests: [],
      acceptanceCriteria: [],
      documentationImpacts: [],
      integrationRisk: "medium",
      mergeOrder: 2,
      contractsConsumed: [],
      contractsProduced: [],
      publicContractsChanged: [],
      knownConsumers: [],
      schemaImpacts: [],
      reviewBudget: {},
      createdBy: "seed"
    }
  ]).onConflictDoNothing();
}
