import "dotenv/config";
import { getPlatformDb, closeDatabaseConnections, getRuntimeDb } from "../../db";
import { inArray, eq } from "drizzle-orm";
import { usersTable } from "../../db/runtime/schema/identity";
import { organizations, workspaces } from "../../db/runtime/schema/workspace";
import { modules, capabilities, moduleCapabilities } from "../../db/platform/schema/registry";
import { processCandidates } from "../../db/platform/schema/candidates";
import { workItems } from "../../db/legacy/schema";
import { processDefinitions, processVersions, processInstances, processPayloads, actionExecutions, events, forms, fieldDefinitions, formFields } from "../../db/runtime/schema/workflow";
import { workspaceModuleConfigs } from "../../db/legacy/schema";
import { WORKFLOW_SEED } from "./constants";

export async function cleanWorkflowSeed(
  dbPlatform: ReturnType<typeof import("../../db").getPlatformDb>,
  dbRuntime: ReturnType<typeof import("../../db").getRuntimeDb>
) {
  console.log(`Starting cleanup for Workflow Seed`);

  const workspaceKeys = [WORKFLOW_SEED.workspace.key];
  const orgKeys = [WORKFLOW_SEED.organization.key];
  const moduleKeys = [WORKFLOW_SEED.module.key];
  const capabilityKeys = WORKFLOW_SEED.capabilities.map(c => c.key);
  const userEmails = [WORKFLOW_SEED.user.email];

  const wsRecords = await dbRuntime.select().from(workspaces).where(inArray(workspaces.key, workspaceKeys));
  const wsIds = wsRecords.map((w: { id: string }) => w.id);

  if (wsIds.length > 0) {
    // 0. Delete Workflow Runtime Data
        await dbRuntime.delete(workItems).where(eq(workItems.title, "Workflow Seed Demanda"));
    console.log(`[Clean] Deleted workflow runtime data (workItems)`);

    await dbRuntime.delete(events).where(inArray(events.workspaceId, wsIds));
    await dbRuntime.delete(actionExecutions).where(inArray(actionExecutions.workspaceId, wsIds));
    await dbRuntime.delete(processPayloads).where(inArray(processPayloads.workspaceId, wsIds));
    await dbRuntime.delete(processInstances).where(inArray(processInstances.workspaceId, wsIds));

    const processDefinitionsToDelete = await dbRuntime.select({ id: processDefinitions.id }).from(processDefinitions).where(inArray(processDefinitions.workspaceId, wsIds));
    const defIds = processDefinitionsToDelete.map((d: { id: string }) => d.id);
    if(defIds.length > 0) {
      await dbRuntime.delete(processVersions).where(inArray(processVersions.processDefinitionId, defIds));
      await dbRuntime.delete(processDefinitions).where(inArray(processDefinitions.id, defIds));
    }

    // Forms
    const formsToDelete = await dbRuntime.select({ id: forms.id }).from(forms).where(inArray(forms.workspaceId, wsIds));
    const formIds = formsToDelete.map((f: { id: string }) => f.id);
    if(formIds.length > 0) {
      await dbRuntime.delete(formFields).where(inArray(formFields.formId, formIds));
      await dbRuntime.delete(forms).where(inArray(forms.id, formIds));
    }
    await dbRuntime.delete(fieldDefinitions).where(inArray(fieldDefinitions.workspaceId, wsIds));

    console.log(`[Clean] Deleted workflow runtime data`);

    // 1. Delete Process Candidates
    await dbPlatform.delete(processCandidates).where(inArray(processCandidates.workspaceId, wsIds));
    console.log(`[Clean] Deleted process candidates for workspaces`);
  }

  // 2. Delete Workspace Module Configs
  if (wsIds.length > 0) {
    await dbRuntime.delete(workspaceModuleConfigs).where(inArray(workspaceModuleConfigs.workspaceId, wsIds));
    console.log(`[Clean] Deleted workspace module configs`);
  }

  // 3. Delete Module Capabilities
  const modRecords = await dbPlatform.select().from(modules).where(inArray(modules.key, moduleKeys));
  const modIds = modRecords.map((m: { id: string }) => m.id);
  if (modIds.length > 0) {
    await dbPlatform.delete(moduleCapabilities).where(inArray(moduleCapabilities.moduleId, modIds));
    console.log(`[Clean] Deleted module capabilities links`);
  }

  // 4. Delete Capabilities
  await dbPlatform.delete(capabilities).where(inArray(capabilities.key, capabilityKeys));
  console.log(`[Clean] Deleted capabilities`);

  // 5. Delete Modules
  await dbPlatform.delete(modules).where(inArray(modules.key, moduleKeys));
  console.log(`[Clean] Deleted modules`);

  // 6. Delete Users
  await dbRuntime.delete(usersTable).where(inArray(usersTable.email, userEmails));
  console.log(`[Clean] Deleted users`);

  // 7. Delete Workspaces
  await dbRuntime.delete(workspaces).where(inArray(workspaces.key, workspaceKeys));
  console.log(`[Clean] Deleted workspaces`);

  // 8. Delete Organizations
  await dbRuntime.delete(organizations).where(inArray(organizations.key, orgKeys));
  console.log(`[Clean] Deleted organizations`);

  console.log(`Cleanup finished for Workflow Seed`);
}

async function runCleanScript() {
  if (process.env.NODE_ENV !== "test" && !process.env.ALLOW_SEED) {
    console.warn("Clean script can only run with ALLOW_SEED=true or NODE_ENV=test.");
    process.exit(1);
  }
  try {
    const dbPlatform = getPlatformDb();
    const dbRuntime = getRuntimeDb();
    await cleanWorkflowSeed(dbPlatform, dbRuntime);
  } catch (error) {
    console.error("Failed to run clean:", error);
  } finally {
    await closeDatabaseConnections();
  }
}

if (require.main === module) {
  runCleanScript();
}
