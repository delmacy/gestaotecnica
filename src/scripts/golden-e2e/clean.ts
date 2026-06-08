import "dotenv/config";
import { getPlatformDb, closeDatabaseConnections, getRuntimeDb } from "../../db";
import { eq, inArray, like } from "drizzle-orm";
import { usersTable } from "../../db/runtime/schema/identity";
import { organizations, workspaces } from "../../db/runtime/schema/workspace";
import { modules, capabilities, moduleCapabilities } from "../../db/platform/schema/registry";
import { processCandidates } from "../../db/platform/schema/candidates";
import { processDefinitions, processVersions, processInstances, processPayloads, actionExecutions, events } from "../../db/runtime/schema/workflow";
import { workspaceModuleConfigs } from "../../db/legacy/schema";
import { GOLDEN_E2E_NAMESPACE } from "./constants";

export async function cleanGoldenE2E(dbPlatform: any, dbRuntime: any) {
  console.log(`Starting cleanup for namespace: ${GOLDEN_E2E_NAMESPACE}`);

  const workspacesToClean = await dbRuntime.select({ id: workspaces.id }).from(workspaces).where(like(workspaces.key, `%${GOLDEN_E2E_NAMESPACE}%`));
  const workspaceIds = workspacesToClean.map((w: any) => w.id);

  if (workspaceIds.length > 0) {
      await dbRuntime.delete(events).where(inArray(events.workspaceId, workspaceIds));
      await dbRuntime.delete(actionExecutions).where(inArray(actionExecutions.workspaceId, workspaceIds));
      await dbRuntime.delete(processPayloads).where(inArray(processPayloads.workspaceId, workspaceIds));
      await dbRuntime.delete(processInstances).where(inArray(processInstances.workspaceId, workspaceIds));

      const processDefinitionsToDelete = await dbRuntime.select({ id: processDefinitions.id }).from(processDefinitions).where(inArray(processDefinitions.workspaceId, workspaceIds));
      const defIds = processDefinitionsToDelete.map((d: any) => d.id);
      if(defIds.length > 0) {
        await dbRuntime.delete(processVersions).where(inArray(processVersions.processDefinitionId, defIds));
        await dbRuntime.delete(processDefinitions).where(inArray(processDefinitions.id, defIds));
      }

      await dbPlatform.delete(processCandidates).where(inArray(processCandidates.workspaceId, workspaceIds));
      await dbRuntime.delete(workspaceModuleConfigs).where(inArray(workspaceModuleConfigs.workspaceId, workspaceIds));
  }

  const modulesToClean = await dbPlatform.select({ id: modules.id }).from(modules).where(like(modules.key, `%${GOLDEN_E2E_NAMESPACE}%`));
  const moduleIds = modulesToClean.map((m: any) => m.id);

  if(moduleIds.length > 0) {
    await dbPlatform.delete(moduleCapabilities).where(inArray(moduleCapabilities.moduleId, moduleIds));
    await dbPlatform.delete(modules).where(inArray(modules.id, moduleIds));
  }

  await dbPlatform.delete(capabilities).where(like(capabilities.key, `%${GOLDEN_E2E_NAMESPACE}%`));
  await dbRuntime.delete(usersTable).where(like(usersTable.email, `%${GOLDEN_E2E_NAMESPACE}%`));

  if (workspaceIds.length > 0) {
      await dbRuntime.delete(workspaces).where(inArray(workspaces.id, workspaceIds));
  }

  await dbRuntime.delete(organizations).where(like(organizations.key, `%${GOLDEN_E2E_NAMESPACE}%`));

  console.log(`Cleanup finished for namespace: ${GOLDEN_E2E_NAMESPACE}`);
}

async function runCleanupScript() {
  if (process.env.NODE_ENV !== "test" && !process.env.ALLOW_SEED) {
     console.warn("Cleanup script can only run with ALLOW_SEED=true or NODE_ENV=test.");
  }
  try {
    const dbPlatform = getPlatformDb();
    const dbRuntime = getRuntimeDb();
    await cleanGoldenE2E(dbPlatform, dbRuntime);
  } catch (error) {
    console.error("Failed to run cleanup:", error);
  } finally {
    await closeDatabaseConnections();
  }
}

if (require.main === module) {
  runCleanupScript();
}
