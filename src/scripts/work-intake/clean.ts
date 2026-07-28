import "dotenv/config";
import { getPlatformDb, closeDatabaseConnections, getRuntimeDb } from "../../db";
import { eq } from "drizzle-orm";
import { usersTable } from "../../db/runtime/schema/identity";
import { organizations, workspaces } from "../../db/runtime/schema/workspace";
import { modules, capabilities, moduleCapabilities } from "../../db/platform/schema/registry";
import { processCandidates } from "../../db/platform/schema/candidates";
import { workspaceModuleConfigs } from "../../db/legacy/schema";
import { WORK_INTAKE_SEED } from "./constants";


export async function cleanWorkIntake(
  dbPlatform: ReturnType<typeof import("../../db").getPlatformDb>,
  dbRuntime: ReturnType<typeof import("../../db").getRuntimeDb>
) {
  console.log(`Starting clean for Work Intake`);

  const existingWorkspaces = await dbRuntime.select().from(workspaces).where(eq(workspaces.key, WORK_INTAKE_SEED.workspace.key));
  let workspaceId: string | null = null;
  if (existingWorkspaces.length > 0) {
      workspaceId = existingWorkspaces[0].id;
  }

  if (workspaceId) {
    console.log(`[Clean] Deleting Process Candidates in workspace ${workspaceId}`);
    await dbPlatform.delete(processCandidates).where(eq(processCandidates.workspaceId, workspaceId));

    console.log(`[Clean] Deleting Workspace Module Configs for workspace ${workspaceId}`);
    await dbRuntime.delete(workspaceModuleConfigs).where(eq(workspaceModuleConfigs.workspaceId, workspaceId));

    console.log(`[Clean] Deleting Workspace: ${WORK_INTAKE_SEED.workspace.key}`);
    await dbRuntime.delete(workspaces).where(eq(workspaces.id, workspaceId));
  }

  console.log(`[Clean] Deleting Users: ${WORK_INTAKE_SEED.user.email}`);
  await dbRuntime.delete(usersTable).where(eq(usersTable.email, WORK_INTAKE_SEED.user.email));

  console.log(`[Clean] Deleting Organizations: ${WORK_INTAKE_SEED.organization.key}`);
  await dbRuntime.delete(organizations).where(eq(organizations.key, WORK_INTAKE_SEED.organization.key));

  const existingModules = await dbPlatform.select().from(modules).where(eq(modules.key, WORK_INTAKE_SEED.module.key));
  if (existingModules.length > 0) {
      const moduleId = existingModules[0].id;
      console.log(`[Clean] Deleting Module Capabilities for module ${moduleId}`);
      await dbPlatform.delete(moduleCapabilities).where(eq(moduleCapabilities.moduleId, moduleId));

      console.log(`[Clean] Deleting Module: ${WORK_INTAKE_SEED.module.key}`);
      await dbPlatform.delete(modules).where(eq(modules.id, moduleId));
  }

  for (const cap of WORK_INTAKE_SEED.capabilities) {
      console.log(`[Clean] Deleting Capability: ${cap.key}`);
      await dbPlatform.delete(capabilities).where(eq(capabilities.key, cap.key));
  }

  console.log(`Clean finished for Work Intake`);
}

async function runCleanScript() {
  if (process.env.NODE_ENV !== "test" && !process.env.ALLOW_SEED) {
    console.warn("Clean script can only run with ALLOW_SEED=true or NODE_ENV=test.");
    process.exit(1);
  }
  try {
    const dbPlatform = getPlatformDb();
    const dbRuntime = getRuntimeDb();
    await cleanWorkIntake(dbPlatform, dbRuntime);
  } catch (error) {
    console.error("Failed to run clean:", error);
  } finally {
    await closeDatabaseConnections();
  }
}

if (require.main === module) {
  runCleanScript();
}
