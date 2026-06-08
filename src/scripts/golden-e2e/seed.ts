import "dotenv/config";
import { getPlatformDb, closeDatabaseConnections, getRuntimeDb } from "../../db";
import { eq } from "drizzle-orm";
import { usersTable } from "../../db/runtime/schema/identity";
import { organizations, workspaces } from "../../db/runtime/schema/workspace";
import { modules, capabilities, moduleCapabilities } from "../../db/platform/schema/registry";
import { processCandidates } from "../../db/platform/schema/candidates";
import { workspaceModuleConfigs } from "../../db/legacy/schema";
import { GOLDEN_E2E } from "./constants";

export async function seedGoldenE2E(dbPlatform: any, dbRuntime: any) {
  console.log(`Starting seed for Golden E2E`);

  // 1. Organization
  let orgId: string;
  const existingOrgs = await dbRuntime.select().from(organizations).where(eq(organizations.key, GOLDEN_E2E.organization.key));
  if (existingOrgs.length > 0) {
    orgId = existingOrgs[0].id;
    console.log(`[Seed] Organization already exists: ${orgId}`);
  } else {
    const [org] = await dbRuntime.insert(organizations).values({
      key: GOLDEN_E2E.organization.key,
      name: GOLDEN_E2E.organization.name,
      status: "active",
    }).returning({ id: organizations.id });
    orgId = org.id;
    console.log(`[Seed] Created Organization: ${orgId}`);
  }

  // 2. Workspace & Control Workspace
  let workspaceId: string;
  const existingWorkspaces = await dbRuntime.select().from(workspaces).where(eq(workspaces.key, GOLDEN_E2E.workspace.key));
  if (existingWorkspaces.length > 0) {
    workspaceId = existingWorkspaces[0].id;
    console.log(`[Seed] Workspace already exists: ${workspaceId}`);
  } else {
    const [workspace] = await dbRuntime.insert(workspaces).values({
      organizationId: orgId,
      key: GOLDEN_E2E.workspace.key,
      name: GOLDEN_E2E.workspace.name,
      status: "active",
      adaptationKey: "golden-e2e",
    }).returning({ id: workspaces.id });
    workspaceId = workspace.id;
    console.log(`[Seed] Created Workspace: ${workspaceId}`);
  }

  let controlWorkspaceId: string;
  const existingControlWorkspaces = await dbRuntime.select().from(workspaces).where(eq(workspaces.key, GOLDEN_E2E.controlWorkspace.key));
  if (existingControlWorkspaces.length > 0) {
      controlWorkspaceId = existingControlWorkspaces[0].id;
      console.log(`[Seed] Control Workspace already exists: ${controlWorkspaceId}`);
  } else {
      const [workspace] = await dbRuntime.insert(workspaces).values({
      organizationId: orgId,
      key: GOLDEN_E2E.controlWorkspace.key,
      name: GOLDEN_E2E.controlWorkspace.name,
      status: "active",
      adaptationKey: "golden-e2e-control",
      }).returning({ id: workspaces.id });
      controlWorkspaceId = workspace.id;
      console.log(`[Seed] Created Control Workspace: ${controlWorkspaceId}`);
  }

  // 3. User
  let userId: string;
  const existingUsers = await dbRuntime.select().from(usersTable).where(eq(usersTable.email, GOLDEN_E2E.user.email));
  if (existingUsers.length > 0) {
    userId = existingUsers[0].id;
    console.log(`[Seed] User already exists: ${userId}`);
  } else {
    const [user] = await dbRuntime.insert(usersTable).values({
      email: GOLDEN_E2E.user.email,
      name: GOLDEN_E2E.user.name,
      status: "active",
    }).returning({ id: usersTable.id });
    userId = user.id;
    console.log(`[Seed] Created User: ${userId}`);
  }

  // 4. Modules
  let moduleId: string;
  const existingModules = await dbPlatform.select().from(modules).where(eq(modules.key, GOLDEN_E2E.module.key));
  if (existingModules.length > 0) {
    moduleId = existingModules[0].id;
    console.log(`[Seed] Module already exists: ${moduleId}`);
  } else {
    const [mod] = await dbPlatform.insert(modules).values({
      key: GOLDEN_E2E.module.key,
      name: GOLDEN_E2E.module.name,
    }).returning({ id: modules.id });
    moduleId = mod.id;
    console.log(`[Seed] Created Module: ${moduleId}`);
  }

  // 5. Capabilities
  const capabilityIds: string[] = [];
  for (const capData of GOLDEN_E2E.capabilities) {
      let capId: string;
      const existingCaps = await dbPlatform.select().from(capabilities).where(eq(capabilities.key, capData.key));
      if (existingCaps.length > 0) {
          capId = existingCaps[0].id;
          console.log(`[Seed] Capability already exists: ${capData.key}`);
      } else {
          const [cap] = await dbPlatform.insert(capabilities).values({
              key: capData.key,
              name: capData.name,
              description: capData.description
          }).returning({ id: capabilities.id });
          capId = cap.id;
          console.log(`[Seed] Created Capability: ${capData.key}`);
      }
      capabilityIds.push(capId);

      // Link Module Capabilities
      const existingModCap = await dbPlatform.select().from(moduleCapabilities)
        .where(eq(moduleCapabilities.moduleId, moduleId))
        .where(eq(moduleCapabilities.capabilityId, capId));

      await dbPlatform.insert(moduleCapabilities).values({
          moduleId: moduleId,
          capabilityId: capId
      }).onConflictDoNothing().catch(()=>null);

      // Install Capabilities on workspace
      await dbRuntime.insert(workspaceModuleConfigs).values({
        workspaceId,
        moduleKey: capData.key,
        name: capData.name,
        isEnabled: true,
      }).onConflictDoNothing().catch(()=>null);
  }

  // 6. Process Candidate
  const proposedDefinition = {
      name: GOLDEN_E2E.candidate.name,
      status: "draft",
      nodes: Object.values(GOLDEN_E2E.nodes).map(n => ({...n, position: {x: 0, y: 0}, config: {}})),
      edges: GOLDEN_E2E.edges
  };

  const existingCandidates = await dbPlatform.select().from(processCandidates)
    .where(eq(processCandidates.workspaceId, workspaceId));

  const candidateExists = existingCandidates.find((c: any) => c.name === GOLDEN_E2E.candidate.name);

  if (!candidateExists) {
      const [candidate] = await dbPlatform.insert(processCandidates).values({
          workspaceId: workspaceId,
          name: GOLDEN_E2E.candidate.name,
          description: GOLDEN_E2E.candidate.description,
          status: "waiting_review",
          proposedDefinition: proposedDefinition,
          createdById: userId
      }).returning({ id: processCandidates.id });
      console.log(`[Seed] Created Process Candidate: ${candidate.id}`);
  } else {
      console.log(`[Seed] Process Candidate already exists: ${candidateExists.id}`);
  }

  console.log(`Seed finished for Golden E2E`);
}

async function runSeedScript() {
  if (process.env.NODE_ENV !== "test" && !process.env.ALLOW_SEED) {
    console.warn("Seed script can only run with ALLOW_SEED=true or NODE_ENV=test.");
  }
  try {
    const dbPlatform = getPlatformDb();
    const dbRuntime = getRuntimeDb();
    await seedGoldenE2E(dbPlatform, dbRuntime);
  } catch (error) {
    console.error("Failed to run seed:", error);
  } finally {
    await closeDatabaseConnections();
  }
}

if (require.main === module) {
  runSeedScript();
}
