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
  const [org] = await dbRuntime.insert(organizations).values({
      key: LAUNCH_ALPHA.organization.key,
      name: LAUNCH_ALPHA.organization.name,
      status: "active",
    }).onConflictDoUpdate({
      target: organizations.key,
      set: { name: LAUNCH_ALPHA.organization.name }
    }).returning({ id: organizations.id });
    orgId = org.id;
    console.log(`[Seed] Upserted Organization: ${orgId}`);

  // 2. Workspace
  let workspaceId: string;
  const [workspace] = await dbRuntime.insert(workspaces).values({
      organizationId: orgId,
      key: LAUNCH_ALPHA.workspace.key,
      name: LAUNCH_ALPHA.workspace.name,
      status: "active",
      adaptationKey: "launch-alpha",
    }).onConflictDoUpdate({
      target: workspaces.key,
      set: { name: LAUNCH_ALPHA.workspace.name }
    }).returning({ id: workspaces.id });
    workspaceId = workspace.id;
    console.log(`[Seed] Upserted Workspace: ${workspaceId}`);

  // 3. User
  let userId: string;
  const [user] = await dbRuntime.insert(usersTable).values({
      email: LAUNCH_ALPHA.user.email,
      name: LAUNCH_ALPHA.user.name,
      status: "active",
    }).onConflictDoUpdate({
      target: usersTable.email,
      set: { name: LAUNCH_ALPHA.user.name }
    }).returning({ id: usersTable.id });
    userId = user.id;
    console.log(`[Seed] Upserted User: ${userId}`);

  // 4. Modules
  let moduleId: string;
  const [mod] = await dbPlatform.insert(modules).values({
      key: LAUNCH_ALPHA.module.key,
      name: LAUNCH_ALPHA.module.name,
    }).onConflictDoUpdate({
      target: modules.key,
      set: { name: LAUNCH_ALPHA.module.name }
    }).returning({ id: modules.id });
    moduleId = mod.id;
    console.log(`[Seed] Upserted Module: ${moduleId}`);

  // 5. Capabilities
  for (const capData of LAUNCH_ALPHA.capabilities) {
      let capId: string;
      const [cap] = await dbPlatform.insert(capabilities).values({
              key: capData.key,
              name: capData.name,
              description: capData.description
          }).onConflictDoUpdate({
              target: capabilities.key,
              set: { name: capData.name, description: capData.description }
          }).returning({ id: capabilities.id });
          capId = cap.id;
          console.log(`[Seed] Upserted Capability: ${capData.key}`);

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
  const [def] = await dbRuntime.insert(processDefinitions).values({
          workspaceId: workspaceId,
          key: `def_${LAUNCH_ALPHA_NAMESPACE}`,
          name: LAUNCH_ALPHA.candidate.name,
          description: LAUNCH_ALPHA.candidate.description,
          sourceCandidateId: candidateId,
          createdById: userId
      }).onConflictDoUpdate({
          target: [processDefinitions.workspaceId, processDefinitions.key],
          set: { name: LAUNCH_ALPHA.candidate.name }
      }).returning({ id: processDefinitions.id });
      defId = def.id;
      console.log(`[Seed] Upserted Process Definition: ${defId}`);

  let versionId: string;
  const [ver] = await dbRuntime.insert(processVersions).values({
          processDefinitionId: defId,
          version: 1,
          definition: proposedDefinition,
          status: "published"
      }).onConflictDoUpdate({
          target: [processVersions.processDefinitionId, processVersions.version],
          set: { definition: proposedDefinition }
      }).returning({ id: processVersions.id });
      versionId = ver.id;
      console.log(`[Seed] Upserted Process Version: ${versionId}`);

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
