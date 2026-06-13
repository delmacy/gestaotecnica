import { agentWorkDb } from "../db";
import { agentWorkers, agentExecutionWaves, agentWorkPackages } from "../schema";

export async function seedInitialData() {
  await agentWorkDb.insert(agentWorkers).values([
    { key: "jules-coordinator-01", role: "coordinator", status: "active" },
    { key: "jules-reviewer-01", role: "reviewer", status: "active" },
    { key: "jules-integrator-01", role: "integrator", status: "active" },
    { key: "jules-documentator-01", role: "documentator", status: "active" },
    { key: "jules-dev-shared-contracts-01", role: "module_worker", status: "active" },
    { key: "jules-dev-runtime-01", role: "module_worker", status: "active" },
    { key: "jules-dev-runtime-02", role: "module_worker", status: "active" },
    { key: "jules-dev-events-01", role: "module_worker", status: "active" },
    { key: "jules-dev-integrations-01", role: "module_worker", status: "active" },
    { key: "jules-dev-operations-docs-01", role: "documentator", status: "active" },
  ]).onConflictDoNothing();

  await agentWorkDb.insert(agentExecutionWaves).values([
    { key: "WAVE-01-FOUNDATION", title: "Foundation Wave", status: "planned" },
    { key: "WAVE-02-CONSISTENCY", title: "Consistency Wave", status: "planned" },
    { key: "WAVE-03-CONTROLLED-EXECUTION", title: "Execution Wave", status: "planned" },
  ]).onConflictDoNothing();

  await agentWorkDb.insert(agentWorkPackages).values([
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
    }
  ]).onConflictDoNothing();
}
