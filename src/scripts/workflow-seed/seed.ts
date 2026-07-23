import "dotenv/config";
import { getPlatformDb, closeDatabaseConnections, getRuntimeDb } from "../../db";
import { eq } from "drizzle-orm";
import { usersTable } from "../../db/runtime/schema/identity";
import { organizations, workspaces } from "../../db/runtime/schema/workspace";
import { modules, capabilities, moduleCapabilities } from "../../db/platform/schema/registry";
import { processCandidates } from "../../db/platform/schema/candidates";
import { workItems } from "../../db/legacy/schema";
import { processDefinitions, processVersions, processInstances, processPayloads, forms, fieldDefinitions, formFields } from "../../db/runtime/schema/workflow";
import { workspaceModuleConfigs } from "../../db/legacy/schema";
import { WORKFLOW_SEED, WORKFLOW_SEED_NAMESPACE } from "./constants";


export async function seedWorkflowSeed(
  dbPlatform: ReturnType<typeof import("../../db").getPlatformDb>,
  dbRuntime: ReturnType<typeof import("../../db").getRuntimeDb>
) {
  console.log(`Starting seed for Workflow Seed`);

  // 1. Organization
  let orgId: string;
  const existingOrgs = await dbRuntime.select().from(organizations).where(eq(organizations.key, WORKFLOW_SEED.organization.key));
  if (existingOrgs.length > 0) {
    orgId = existingOrgs[0].id;
    console.log(`[Seed] Organization already exists: ${orgId}`);
  } else {
    const [org] = await dbRuntime.insert(organizations).values({
      key: WORKFLOW_SEED.organization.key,
      name: WORKFLOW_SEED.organization.name,
      status: "active",
    }).returning({ id: organizations.id });
    orgId = org.id;
    console.log(`[Seed] Created Organization: ${orgId}`);
  }

  // 2. Workspace
  let workspaceId: string;
  const existingWorkspaces = await dbRuntime.select().from(workspaces).where(eq(workspaces.key, WORKFLOW_SEED.workspace.key));
  if (existingWorkspaces.length > 0) {
    workspaceId = existingWorkspaces[0].id;
    console.log(`[Seed] Workspace already exists: ${workspaceId}`);
  } else {
    const [workspace] = await dbRuntime.insert(workspaces).values({
      organizationId: orgId,
      key: WORKFLOW_SEED.workspace.key,
      name: WORKFLOW_SEED.workspace.name,
      status: "active",
      adaptationKey: "workflow-seed",
    }).returning({ id: workspaces.id });
    workspaceId = workspace.id;
    console.log(`[Seed] Created Workspace: ${workspaceId}`);
  }

  // 3. User
  let userId: string;
  const existingUsers = await dbRuntime.select().from(usersTable).where(eq(usersTable.email, WORKFLOW_SEED.user.email));
  if (existingUsers.length > 0) {
    userId = existingUsers[0].id;
    console.log(`[Seed] User already exists: ${userId}`);
  } else {
    const [user] = await dbRuntime.insert(usersTable).values({
      email: WORKFLOW_SEED.user.email,
      name: WORKFLOW_SEED.user.name,
      status: "active",
    }).returning({ id: usersTable.id });
    userId = user.id;
    console.log(`[Seed] Created User: ${userId}`);
  }

  // 4. Modules
  let moduleId: string;
  const existingModules = await dbPlatform.select().from(modules).where(eq(modules.key, WORKFLOW_SEED.module.key));
  if (existingModules.length > 0) {
    moduleId = existingModules[0].id;
    console.log(`[Seed] Module already exists: ${moduleId}`);
  } else {
    const [mod] = await dbPlatform.insert(modules).values({
      key: WORKFLOW_SEED.module.key,
      name: WORKFLOW_SEED.module.name,
    }).returning({ id: modules.id });
    moduleId = mod.id;
    console.log(`[Seed] Created Module: ${moduleId}`);
  }

  // 5. Capabilities
  for (const capData of WORKFLOW_SEED.capabilities) {
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
      name: WORKFLOW_SEED.candidate.name,
      status: "draft",
      nodes: Object.values(WORKFLOW_SEED.nodes).map(n => ({...n, position: {x: 0, y: 0}, config: {}})),
      edges: WORKFLOW_SEED.edges
  };

  const existingCandidates = await dbPlatform.select().from(processCandidates)
    .where(eq(processCandidates.workspaceId, workspaceId));

  const candidateExists = existingCandidates.find((c: { name: string }) => c.name === WORKFLOW_SEED.candidate.name);

  let candidateId: string;
  if (!candidateExists) {
      const [candidate] = await dbPlatform.insert(processCandidates).values({
          workspaceId: workspaceId,
          name: WORKFLOW_SEED.candidate.name,
          description: WORKFLOW_SEED.candidate.description,
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
          key: `def_${WORKFLOW_SEED_NAMESPACE}`,
          name: WORKFLOW_SEED.candidate.name,
          description: WORKFLOW_SEED.candidate.description,
          sourceCandidateId: candidateId,
          createdById: userId
      }).onConflictDoUpdate({
          target: [processDefinitions.workspaceId, processDefinitions.key],
          set: { name: WORKFLOW_SEED.candidate.name }
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
              source: "seed_workflow_seed",
              real_data: true
          }
      });
      console.log(`[Seed] Created Process Payload for Instance`);
  } else {
      console.log(`[Seed] Process Instance already exists: ${existingInstances[0].id}`);
  }


  // 7.5. Work Items
  let workItemId: string;
  const existingWorkItems = await dbRuntime.select().from(workItems).where(eq(workItems.title, "Workflow Seed Demanda"));
  if (existingWorkItems.length === 0) {
      const [wi] = await dbRuntime.insert(workItems).values({
          title: "Workflow Seed Demanda",
          type: "solicitacao",
          status: "open",
          priority: "medium",

          payload: {
              source: "seed_workflow_seed",
              real_data: true
          }
      }).returning({ id: workItems.id });
      workItemId = wi.id;
      console.log(`[Seed] Created Work Item: ${workItemId}`);
  } else {
      workItemId = existingWorkItems[0].id;
      console.log(`[Seed] Work Item already exists: ${workItemId}`);
  }

  // 8. Forms
  for (const formData of WORKFLOW_SEED.forms) {
      let formId: string;
      const [form] = await dbRuntime.insert(forms).values({
          workspaceId: workspaceId,
          key: formData.key,
          name: formData.name,
          description: formData.description,
      }).onConflictDoUpdate({
          target: [forms.workspaceId, forms.key],
          set: { name: formData.name, description: formData.description }
      }).returning({ id: forms.id });
      formId = form.id;
      console.log(`[Seed] Upserted Form: ${formId}`);

      let sortOrder = 0;
      for (const field of formData.fields) {
          const fieldKey = `${formData.key}_${field.key}`;
          const existingField = await dbRuntime.select().from(fieldDefinitions).where(eq(fieldDefinitions.key, fieldKey));
          let fieldDefId;
          if (existingField.length > 0) {
              fieldDefId = existingField[0].id;
              console.log(`[Seed] Field Definition already exists: ${fieldDefId}`);
          } else {
              const [fieldDef] = await dbRuntime.insert(fieldDefinitions).values({
                  workspaceId: workspaceId,
                  key: fieldKey,
                  label: field.label,
                  type: field.type,
                  config: { required: field.required }
              }).returning({ id: fieldDefinitions.id });
              fieldDefId = fieldDef.id;
              console.log(`[Seed] Created Field Definition: ${fieldDefId}`);
          }

          // Link form and field
          const existingLink = await dbRuntime.select().from(formFields).where(eq(formFields.formId, formId)).where(eq(formFields.fieldDefinitionId, fieldDefId));
          if (existingLink.length > 0) {
              console.log(`[Seed] Form field link already exists for: ${fieldDefId}`);
          } else {
              await dbRuntime.insert(formFields).values({
                  formId: formId,
                  fieldDefinitionId: fieldDefId,
                  sortOrder: sortOrder++,
                  isRequired: field.required ? "true" : "false",
                  config: {}
              });
              console.log(`[Seed] Created Form field link for: ${fieldDefId}`);
          }
      }
  }

  console.log(`Seed finished for Workflow Seed`);
}

async function runSeedScript() {
  if (process.env.NODE_ENV !== "test" && !process.env.ALLOW_SEED) {
    console.warn("Seed script can only run with ALLOW_SEED=true or NODE_ENV=test.");
    process.exit(1);
  }
  try {
    const dbPlatform = getPlatformDb();
    const dbRuntime = getRuntimeDb();
    await seedWorkflowSeed(dbPlatform, dbRuntime);
  } catch (error) {
    console.error("Failed to run seed:", error);
  } finally {
    await closeDatabaseConnections();
  }
}

if (require.main === module) {
  runSeedScript();
}
