import { getPlatformDb, closeDatabaseConnections, getRuntimeDb, getDb } from "../../index";
import { eq } from "drizzle-orm";
import { usersTable } from "../../runtime/schema/identity";
import { organizations, workspaces } from "../../runtime/schema/workspace";
import { modules, capabilities, moduleCapabilities } from "../../platform/schema/registry";
import { workspaceModuleConfigs, workItems, users as legacyUsers } from "../../legacy/schema";
import { WORK_ITEMS_SEED } from "./constants";

export async function cleanWorkItems(
  dbPlatform: ReturnType<typeof import("../../index").getPlatformDb>,
  dbRuntime: ReturnType<typeof import("../../index").getRuntimeDb>,
  dbLegacy: ReturnType<typeof import("../../index").getDb>
) {
  console.log(`Starting clean for Work Items`);

  const existingWorkspaces = await dbRuntime.select().from(workspaces).where(eq(workspaces.key, WORK_ITEMS_SEED.workspace.key));
  let workspaceId: string | null = null;
  if (existingWorkspaces.length > 0) {
      workspaceId = existingWorkspaces[0].id;
  }

  console.log(`[Clean] Deleting Work Items (seeded)`);
  await dbLegacy.delete(workItems).where(eq(workItems.title, WORK_ITEMS_SEED.item.title));

  if (workspaceId) {
    console.log(`[Clean] Deleting Workspace Module Configs for workspace ${workspaceId}`);
    await dbLegacy.delete(workspaceModuleConfigs).where(eq(workspaceModuleConfigs.workspaceId, workspaceId));

    console.log(`[Clean] Deleting Workspace: ${WORK_ITEMS_SEED.workspace.key}`);
    await dbRuntime.delete(workspaces).where(eq(workspaces.id, workspaceId));
  }

  console.log(`[Clean] Deleting Users from Legacy: ${WORK_ITEMS_SEED.user.email}`);
  await dbLegacy.delete(legacyUsers).where(eq(legacyUsers.email, WORK_ITEMS_SEED.user.email));

  console.log(`[Clean] Deleting Users from Runtime: ${WORK_ITEMS_SEED.user.email}`);
  await dbRuntime.delete(usersTable).where(eq(usersTable.email, WORK_ITEMS_SEED.user.email));

  console.log(`[Clean] Deleting Organizations: ${WORK_ITEMS_SEED.organization.key}`);
  await dbRuntime.delete(organizations).where(eq(organizations.key, WORK_ITEMS_SEED.organization.key));

  const existingModules = await dbPlatform.select().from(modules).where(eq(modules.key, WORK_ITEMS_SEED.module.key));
  if (existingModules.length > 0) {
      const moduleId = existingModules[0].id;
      console.log(`[Clean] Deleting Module Capabilities for module ${moduleId}`);
      await dbPlatform.delete(moduleCapabilities).where(eq(moduleCapabilities.moduleId, moduleId));

      console.log(`[Clean] Deleting Module: ${WORK_ITEMS_SEED.module.key}`);
      await dbPlatform.delete(modules).where(eq(modules.id, moduleId));
  }

  for (const cap of WORK_ITEMS_SEED.capabilities) {
      console.log(`[Clean] Deleting Capability: ${cap.key}`);
      await dbPlatform.delete(capabilities).where(eq(capabilities.key, cap.key));
  }

  console.log(`Clean finished for Work Items`);
}

async function runCleanScript() {
  if (process.env.NODE_ENV !== "test" && !process.env.ALLOW_SEED) {
    console.warn("Clean script can only run with ALLOW_SEED=true or NODE_ENV=test.");
    process.exit(1);
  }
  try {
    const dbPlatform = getPlatformDb();
    const dbRuntime = getRuntimeDb();
    const dbLegacy = getDb();
    await cleanWorkItems(dbPlatform, dbRuntime, dbLegacy);
  } catch (error) {
    console.error("Failed to run clean:", error);
  } finally {
    await closeDatabaseConnections();
  }
}

if (require.main === module) {
  runCleanScript();
}
