import { LAUNCH_ALPHA_NAMESPACE } from "./constants";
import "dotenv/config";
import { getPlatformDb, closeDatabaseConnections, getRuntimeDb } from "../../db";
import { eq } from "drizzle-orm";
import { usersTable } from "../../db/runtime/schema/identity";
import { organizations, workspaces } from "../../db/runtime/schema/workspace";
import { modules, capabilities, moduleCapabilities } from "../../db/platform/schema/registry";
import { processCandidates } from "../../db/platform/schema/candidates";

import { processDefinitions, processVersions, processInstances, processPayloads, actionExecutions, events } from "../../db/runtime/schema/workflow";
import { workspaceModuleConfigs } from "../../db/legacy/schema";
import { LAUNCH_ALPHA } from "./constants";



export async function seedLaunchAlpha(
  dbPlatform: ReturnType<typeof import("../../db").getPlatformDb>,
  dbRuntime: ReturnType<typeof import("../../db").getRuntimeDb>
) {
  console.log(`Starting seed for Launch Alpha`);

  // 1. Organization
  let orgId: string;
  const existingOrgs = await dbRuntime.select().from(organizations).where(eq(organizations.key, LAUNCH_ALPHA.organization.key));
  if (existingOrgs.length > 0) {
    orgId = existingOrgs[0].id;
    console.log(`[Seed] Organization already exists: ${orgId}`);
  } else {
    const [org] = await dbRuntime.insert(organizations).values({
      key: LAUNCH_ALPHA.organization.key,
      name: LAUNCH_ALPHA.organization.name,
      status: "active",
    }).returning({ id: organizations.id });
    orgId = org.id;
    console.log(`[Seed] Created Organization: ${orgId}`);
  }

  // 2. Workspace
  let workspaceId: string;
  const existingWorkspaces = await dbRuntime.select().from(workspaces).where(eq(workspaces.key, LAUNCH_ALPHA.workspace.key));
  if (existingWorkspaces.length > 0) {
    workspaceId = existingWorkspaces[0].id;
    console.log(`[Seed] Workspace already exists: ${workspaceId}`);
  } else {
    const [workspace] = await dbRuntime.insert(workspaces).values({
      organizationId: orgId,
      key: LAUNCH_ALPHA.workspace.key,
      name: LAUNCH_ALPHA.workspace.name,
      status: "active",
      adaptationKey: "launch-alpha",
    }).returning({ id: workspaces.id });
    workspaceId = workspace.id;
    console.log(`[Seed] Created Workspace: ${workspaceId}`);
  }

  // 3. User
  let userId: string;
  const existingUsers = await dbRuntime.select().from(usersTable).where(eq(usersTable.email, LAUNCH_ALPHA.user.email));
  if (existingUsers.length > 0) {
    userId = existingUsers[0].id;
    console.log(`[Seed] User already exists: ${userId}`);
  } else {
    const [user] = await dbRuntime.insert(usersTable).values({
      email: LAUNCH_ALPHA.user.email,
      name: LAUNCH_ALPHA.user.name,
      status: "active",
    }).returning({ id: usersTable.id });
    userId = user.id;
    console.log(`[Seed] Created User: ${userId}`);
  }

  // 4. Modules
  let moduleId: string;
  const existingModules = await dbPlatform.select().from(modules).where(eq(modules.key, LAUNCH_ALPHA.module.key));
  if (existingModules.length > 0) {
    moduleId = existingModules[0].id;
    console.log(`[Seed] Module already exists: ${moduleId}`);
  } else {
    const [mod] = await dbPlatform.insert(modules).values({
      key: LAUNCH_ALPHA.module.key,
      name: LAUNCH_ALPHA.module.name,
    }).returning({ id: modules.id });
    moduleId = mod.id;
    console.log(`[Seed] Created Module: ${moduleId}`);
  }

  // 5. Capabilities
  for (const capData of LAUNCH_ALPHA.capabilities) {
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

      // Link Module Capabilities
      await dbPlatform.insert(moduleCapabilities).values({
          moduleId: moduleId,
          capabilityId: capId
      }).onConflictDoNothing();

      // Install Capabilities on workspace
      await dbRuntime.insert(workspaceModuleConfigs).values({
        workspaceId,
        moduleKey: LAUNCH_ALPHA.module.key,
        name: capData.name,
        isEnabled: true,
      }).onConflictDoNothing();
  }


  // 6. Process Candidate
  const proposedDefinition = {
      name: LAUNCH_ALPHA.candidate.name,
      status: "draft",
      nodes: Object.values(LAUNCH_ALPHA.nodes).map(n => ({...n, position: {x: 0, y: 0}, config: {}})),
      edges: LAUNCH_ALPHA.edges
  };

  const existingCandidates = await dbPlatform.select().from(processCandidates)
    .where(eq(processCandidates.workspaceId, workspaceId));

  const candidateExists = existingCandidates.find((c: { name: string }) => c.name === LAUNCH_ALPHA.candidate.name);

  let candidateId: string;
  if (!candidateExists) {
      const [candidate] = await dbPlatform.insert(processCandidates).values({
          workspaceId: workspaceId,
          name: LAUNCH_ALPHA.candidate.name,
          description: LAUNCH_ALPHA.candidate.description,
          status: "waiting_review",
          proposedDefinition: proposedDefinition,
          createdById: userId
      }).returning({ id: processCandidates.id });
      candidateId = candidate.id;
      console.log(`[Seed] Created Process Candidate: ${candidate.id}`);
  } else {
      candidateId = candidateExists.id;
      console.log(`[Seed] Process Candidate already exists: ${candidateExists.id}`);
  }

  // 7. Work Items (Process Definition, Version, Instance)
  let defId: string;
  const existingDefs = await dbRuntime.select().from(processDefinitions)
    .where(eq(processDefinitions.workspaceId, workspaceId));
  if (existingDefs.length > 0) {
      defId = existingDefs[0].id;
      console.log(`[Seed] Process Definition already exists: ${defId}`);
  } else {
      const [def] = await dbRuntime.insert(processDefinitions).values({
          workspaceId: workspaceId,
          key: `def_${LAUNCH_ALPHA_NAMESPACE}`,
          name: LAUNCH_ALPHA.candidate.name,
          description: LAUNCH_ALPHA.candidate.description,
          sourceCandidateId: candidateId,
          createdById: userId
      }).returning({ id: processDefinitions.id });
      defId = def.id;
      console.log(`[Seed] Created Process Definition: ${defId}`);
  }

  let versionId: string;
  const existingVersions = await dbRuntime.select().from(processVersions)
    .where(eq(processVersions.processDefinitionId, defId));
  if (existingVersions.length > 0) {
      versionId = existingVersions[0].id;
      console.log(`[Seed] Process Version already exists: ${versionId}`);
  } else {
      const [ver] = await dbRuntime.insert(processVersions).values({
          processDefinitionId: defId,
          version: 1,
          definition: proposedDefinition,
          status: "published"
      }).returning({ id: processVersions.id });
      versionId = ver.id;
      console.log(`[Seed] Created Process Version: ${versionId}`);
  }

  const existingInstances = await dbRuntime.select().from(processInstances)
    .where(eq(processInstances.workspaceId, workspaceId));
  if (existingInstances.length === 0) {
      const [inst] = await dbRuntime.insert(processInstances).values({
          workspaceId: workspaceId,
          processVersionId: versionId,
          status: "active",
          createdById: userId
      }).returning({ id: processInstances.id });
      console.log(`[Seed] Created Process Instance: ${inst.id}`);

      await dbRuntime.insert(processPayloads).values({
          workspaceId: workspaceId,
          instanceId: inst.id,
          data: {
              source: "seed_launch_alpha",
              real_data: true
          }
      });
      console.log(`[Seed] Created Process Payload for Instance`);
  } else {
      console.log(`[Seed] Process Instance already exists: ${existingInstances[0].id}`);
  }

  console.log(`Seed finished for Launch Alpha`);
}

async function runSeedScript() {
  if (process.env.NODE_ENV !== "test" && !process.env.ALLOW_SEED) {
    console.warn("Seed script can only run with ALLOW_SEED=true or NODE_ENV=test.");
    process.exit(1);
  }
  try {
    const dbPlatform = getPlatformDb();
    const dbRuntime = getRuntimeDb();
    await seedLaunchAlpha(dbPlatform, dbRuntime);
  } catch (error) {
    console.error("Failed to run seed:", error);
  } finally {
    await closeDatabaseConnections();
  }
}

if (require.main === module) {
  runSeedScript();
}
