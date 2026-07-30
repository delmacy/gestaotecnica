import { getPlatformDb, closeDatabaseConnections, getRuntimeDb, getDb } from "../../index";
import { eq } from "drizzle-orm";
import { usersTable } from "../../runtime/schema/identity";
import { organizations, workspaces } from "../../runtime/schema/workspace";
import { modules, capabilities, moduleCapabilities } from "../../platform/schema/registry";
import { workspaceModuleConfigs, workItems, users as legacyUsers, entityAttachments } from "../../legacy/schema";
import { WORK_ITEMS_SEED } from "./constants";

export async function seedWorkItems(
  dbPlatform: ReturnType<typeof import("../../index").getPlatformDb>,
  dbRuntime: ReturnType<typeof import("../../index").getRuntimeDb>,
  dbLegacy: ReturnType<typeof import("../../index").getDb>
) {
  console.log(`Starting seed for Work Items`);

  // 1. Organization
  let orgId: string;
  const existingOrgs = await dbRuntime.select().from(organizations).where(eq(organizations.key, WORK_ITEMS_SEED.organization.key));
  if (existingOrgs.length > 0) {
    orgId = existingOrgs[0].id;
    console.log(`[Seed] Organization already exists: ${orgId}`);
  } else {
    const [org] = await dbRuntime.insert(organizations).values({
      key: WORK_ITEMS_SEED.organization.key,
      name: WORK_ITEMS_SEED.organization.name,
      status: "active",
    }).returning({ id: organizations.id });
    orgId = org.id;
    console.log(`[Seed] Created Organization: ${orgId}`);
  }

  // 2. Workspace
  let workspaceId: string;
  const existingWorkspaces = await dbRuntime.select().from(workspaces).where(eq(workspaces.key, WORK_ITEMS_SEED.workspace.key));
  if (existingWorkspaces.length > 0) {
    workspaceId = existingWorkspaces[0].id;
    console.log(`[Seed] Workspace already exists: ${workspaceId}`);
  } else {
    const [workspace] = await dbRuntime.insert(workspaces).values({
      organizationId: orgId,
      key: WORK_ITEMS_SEED.workspace.key,
      name: WORK_ITEMS_SEED.workspace.name,
      status: "active",
      adaptationKey: "work-items",
    }).returning({ id: workspaces.id });
    workspaceId = workspace.id;
    console.log(`[Seed] Created Workspace: ${workspaceId}`);
  }

  // 3. User (Runtime and Legacy)
  let userId: string;
  const existingUsers = await dbRuntime.select().from(usersTable).where(eq(usersTable.email, WORK_ITEMS_SEED.user.email));
  if (existingUsers.length > 0) {
    userId = existingUsers[0].id;
    console.log(`[Seed] User already exists in Runtime: ${userId}`);
  } else {
    const [user] = await dbRuntime.insert(usersTable).values({
      email: WORK_ITEMS_SEED.user.email,
      name: WORK_ITEMS_SEED.user.name,
      status: "active",
    }).returning({ id: usersTable.id });
    userId = user.id;
    console.log(`[Seed] Created User in Runtime: ${userId}`);
  }

  const existingLegacyUsers = await dbLegacy.select().from(legacyUsers).where(eq(legacyUsers.email, WORK_ITEMS_SEED.user.email));
  if (existingLegacyUsers.length === 0) {
    await dbLegacy.insert(legacyUsers).values({
      id: userId,
      email: WORK_ITEMS_SEED.user.email,
      name: WORK_ITEMS_SEED.user.name,
      status: "active",
      accessProfile: "operador"
    }).onConflictDoNothing();
    console.log(`[Seed] Created User in Legacy: ${userId}`);
  }

  // 4. Modules
  let moduleId: string;
  const existingModules = await dbPlatform.select().from(modules).where(eq(modules.key, WORK_ITEMS_SEED.module.key));
  if (existingModules.length > 0) {
    moduleId = existingModules[0].id;
    console.log(`[Seed] Module already exists: ${moduleId}`);
  } else {
    const [mod] = await dbPlatform.insert(modules).values({
      key: WORK_ITEMS_SEED.module.key,
      name: WORK_ITEMS_SEED.module.name,
    }).returning({ id: modules.id });
    moduleId = mod.id;
    console.log(`[Seed] Created Module: ${moduleId}`);
  }

  // 5. Capabilities
  for (const capData of WORK_ITEMS_SEED.capabilities) {
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
      await dbLegacy.insert(workspaceModuleConfigs).values({
        workspaceId,
        moduleKey: capData.key,
        name: capData.name,
        isEnabled: true,
      }).onConflictDoNothing();
  }

  // 6. Work Items
  const existingItems = await dbLegacy.select().from(workItems)
    .where(eq(workItems.title, WORK_ITEMS_SEED.item.title));

  let workItemId: string;
  if (existingItems.length === 0) {
      const [item] = await dbLegacy.insert(workItems).values({
          title: WORK_ITEMS_SEED.item.title,
          description: WORK_ITEMS_SEED.item.description,
          status: "open",
          type: "solicitacao",
          priority: "high",
          requesterName: "João da Silva",
          requesterContact: "joao.silva@example.com",
          createdById: userId,
          payload: { seed: true }
      }).returning({ id: workItems.id });
      workItemId = item.id;
      console.log(`[Seed] Created Work Item: ${workItemId}`);
  } else {
      workItemId = existingItems[0].id;
      console.log(`[Seed] Work Item already exists: ${workItemId}`);
  }

  // 7. Entity Attachments
  const existingAttachments = await dbLegacy.select().from(entityAttachments)
    .where(eq(entityAttachments.entityId, workItemId));

  if (existingAttachments.length === 0) {
    const [attachment] = await dbLegacy.insert(entityAttachments).values({
        entityType: "work_item",
        entityId: workItemId,
        title: "Foto do equipamento falho",
        fileUrl: "https://example.com/foto-equipamento-1.jpg",
        mimeType: "image/jpeg",
        createdById: userId,
    }).returning({ id: entityAttachments.id });
    console.log(`[Seed] Created Entity Attachment: ${attachment.id}`);
  } else {
    console.log(`[Seed] Entity Attachment already exists for work item: ${workItemId}`);
  }

  // 8. Events
  const { events } = await import("../../runtime/schema/workflow");
  const existingEvents = await dbRuntime.select().from(events)
    .where(eq(events.entityId, workItemId));

  if (existingEvents.length === 0) {
    const [event1] = await dbRuntime.insert(events).values({
        workspaceId,
        eventType: "work_item.created",
        entityType: "work_item",
        entityId: workItemId,
        actorType: "user",
        actorId: userId,
        source: "seed",
        payload: { note: "Equipamento reportado quebrado" },
    }).returning({ id: events.id });

    const [event2] = await dbRuntime.insert(events).values({
        workspaceId,
        eventType: "work_item.status_changed",
        entityType: "work_item",
        entityId: workItemId,
        actorType: "user",
        actorId: userId,
        source: "seed",
        payload: { from: "triaged", to: "open", note: "Analisado pela equipe técnica" },
    }).returning({ id: events.id });

    console.log(`[Seed] Created Events for work item: ${event1.id}, ${event2.id}`);
  } else {
    console.log(`[Seed] Events already exist for work item: ${workItemId}`);
  }

  console.log(`Seed finished for Work Items`);
}

async function runSeedScript() {
  if (process.env.NODE_ENV !== "test" && !process.env.ALLOW_SEED) {
    console.warn("Seed script can only run with ALLOW_SEED=true or NODE_ENV=test.");
    process.exit(1);
  }
  try {
    const dbPlatform = getPlatformDb();
    const dbRuntime = getRuntimeDb();
    const dbLegacy = getDb();
    await seedWorkItems(dbPlatform, dbRuntime, dbLegacy);
  } catch (error) {
    console.error("Failed to run seed:", error);
  } finally {
    await closeDatabaseConnections();
  }
}

if (require.main === module) {
  runSeedScript();
}
