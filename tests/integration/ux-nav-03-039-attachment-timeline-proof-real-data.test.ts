import "dotenv/config";
import test, { after } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { getRuntimeDb, closeDatabaseConnections } from "../../src/db";
import { entityAttachments, users, workItems } from "../../src/db/schema";
import { events } from "../../src/db/runtime/schema/workflow";
import {
  organizations,
  workspaces,
} from "../../src/db/runtime/schema/workspace";
import { usersTable } from "../../src/db/runtime/schema/identity";
import {
  getWorkItemById,
  getWorkItemEvents,
} from "../../src/modules/work-items/queries";
import {
  getEntityAttachments,
  getEntityComments,
} from "../../src/modules/comments/queries";
import {
  CreateEntityAttachmentInputSchema,
  EntityAttachmentSchema,
} from "../../src/modules/comments/contracts/entity-collaboration-contract";
import { WorkItemEventSchema } from "../../src/modules/work-items/contracts/work-item-event-contract";
import { resolveWorkspaceContext } from "../../src/platform/workspace";
import type { WorkspaceContext } from "../../src/platform/workspace";

const db = getRuntimeDb();

const orgId = randomUUID();
const workspaceId = randomUUID();
const userId = randomUUID();
const workItemId = randomUUID();
const controlEntityId = randomUUID();
const orgKey = `org-039-${randomUUID().slice(0, 8)}`;
const workspaceKey = `ws-039-${randomUUID().slice(0, 8)}`;
const userEmail = `tecnico-039-${randomUUID()}@example.com`;
const attachmentTitle = "Foto do equipamento falho";
const attachmentUrl = "https://example.com/foto-equipamento-1.jpg";
const secondAttachmentTitle = "Laudo tecnico assinado";
const secondAttachmentUrl = "https://example.com/laudo-tecnico.pdf";

after(async () => {
  await db.delete(events).where(eq(events.workspaceId, workspaceId));
  await db.delete(entityAttachments).where(eq(entityAttachments.createdById, userId));
  await db.delete(workItems).where(eq(workItems.id, workItemId));
  await db.delete(users).where(eq(users.id, userId));
  await db.delete(usersTable).where(eq(usersTable.id, userId));
  await db.delete(workspaces).where(eq(workspaces.id, workspaceId));
  await db.delete(organizations).where(eq(organizations.id, orgId));
  await new Promise((resolve) => setTimeout(resolve, 50));
  await closeDatabaseConnections();
});

test("UX-NAV-03-039: Real-data journey validation for attachments and timeline proof of work", async (t) => {
  await t.test("persists a real work item, attachment and timeline events under the selected workspace", async () => {
    await db.insert(organizations).values({
      id: orgId,
      key: orgKey,
      name: "Organizacao E2E 039",
      status: "active",
    });
    await db.insert(workspaces).values({
      id: workspaceId,
      organizationId: orgId,
      key: workspaceKey,
      name: "Workspace E2E 039",
      status: "active",
      adaptationKey: "work-items",
    });
    await db.insert(users).values({
      id: userId,
      name: "Tecnico E2E 039",
      email: userEmail,
      status: "active",
      accessProfile: "operador",
    });
    await db.insert(usersTable).values({
      id: userId,
      email: userEmail,
      name: "Tecnico E2E 039",
      status: "active",
    });
    await db.insert(workItems).values({
      id: workItemId,
      title: "Falha no equipamento de secagem",
      description: "Equipamento reportado quebrado no turno da manha",
      status: "open",
      type: "solicitacao",
      priority: "high",
      requesterName: "Joao da Silva",
      requesterContact: "joao.silva@example.com",
      createdById: userId,
      payload: { seed: true },
    });
    await db.insert(entityAttachments).values({
      entityType: "work_item",
      entityId: workItemId,
      title: attachmentTitle,
      fileUrl: attachmentUrl,
      mimeType: "image/jpeg",
      createdById: userId,
    });
    await db.insert(events).values({
      workspaceId,
      eventType: "work_item.created",
      entityType: "work_item",
      entityId: workItemId,
      actorType: "user",
      actorId: userId,
      source: "seed",
      payload: { note: "Equipamento reportado quebrado" },
    });
    await db.insert(events).values({
      workspaceId,
      eventType: "work_item.status_changed",
      entityType: "work_item",
      entityId: workItemId,
      actorType: "user",
      actorId: userId,
      source: "seed",
      payload: { from: "triaged", to: "open", note: "Analisado pela equipe tecnica" },
    });
    await db.insert(events).values({
      workspaceId,
      eventType: "work_item.observed",
      entityType: "work_item",
      entityId: controlEntityId,
      actorType: "user",
      actorId: userId,
      source: "seed",
      payload: { note: "Evento de controle para outro item" },
    });

    const [orgRow] = await db.select().from(organizations).where(eq(organizations.id, orgId)).limit(1);
    const [wsRow] = await db.select().from(workspaces).where(eq(workspaces.id, workspaceId)).limit(1);
    const [userRow] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    const [workItemRow] = await db.select().from(workItems).where(eq(workItems.id, workItemId)).limit(1);

    assert.ok(orgRow, "Organization should be persisted");
    assert.equal(wsRow?.key, workspaceKey);
    assert.equal(userRow?.accessProfile, "operador");
    assert.ok(workItemRow, "Work item should be persisted in the database");
    assert.equal(workItemRow.title, "Falha no equipamento de secagem");
  });

  await t.test("getWorkItemById resolves the persisted work item used by /work-items/[id]", async () => {
    const item = await getWorkItemById(workItemId);

    assert.ok(item, "Work item should be readable by the /work-items/[id] read path");
    assert.equal(item.id, workItemId);
    assert.equal(item.title, "Falha no equipamento de secagem");
    assert.equal(item.status, "open");
    assert.equal(item.createdById, userId);
  });

  await t.test("getEntityAttachments returns the persisted attachment for the 'Anexos' panel", async () => {
    const attachments = await getEntityAttachments("work_item", workItemId);

    assert.equal(attachments.length, 1, "One real attachment must be returned");
    assert.equal(attachments[0].title, attachmentTitle);
    assert.equal(attachments[0].fileUrl, attachmentUrl);
    assert.equal(attachments[0].mimeType, "image/jpeg");
    assert.equal(attachments[0].authorName, "Tecnico E2E 039");

    const parsed = EntityAttachmentSchema.safeParse(attachments[0]);
    assert.ok(parsed.success, "Attachment must conform to the EntityAttachment contract consumed by the UI");
  });

  await t.test("empty states stay distinct from real data on the same screen", async () => {
    const emptyAttachments = await getEntityAttachments("work_item", controlEntityId);
    assert.deepEqual(emptyAttachments, [], "A different entity must return no attachments (empty state)");

    const emptyComments = await getEntityComments("work_item", workItemId);
    assert.deepEqual(emptyComments, [], "No comments persisted, the 'Comentarios' panel stays in its empty state");

    const emptyTimeline = await getWorkItemEvents(controlEntityId);
    assert.deepEqual(emptyTimeline, [], "A different entity must return no timeline events (empty state)");
  });

  await t.test("getWorkItemEvents returns the persisted timeline ordered newest-first for 'Historico'", async () => {
    const timeline = await getWorkItemEvents(workItemId);

    assert.equal(timeline.length, 2, "The two real events for the work item must be returned");
    assert.equal(timeline[0].eventType, "work_item.status_changed", "Newest event must come first");
    assert.equal(timeline[1].eventType, "work_item.created");

    for (const event of timeline) {
      const parsed = WorkItemEventSchema.safeParse(event);
      assert.ok(parsed.success, "Timeline item must conform to the WorkItemEvent contract rendered by the UI");
    }
  });

  await t.test("timeline events are persisted under the selected workspace and do not leak across entities", async () => {
    const persisted = await db
      .select()
      .from(events)
      .where(eq(events.entityId, workItemId));

    assert.equal(persisted.length, 2);
    for (const event of persisted) {
      assert.equal(event.workspaceId, workspaceId, "Event must carry the selected workspace context");
    }

    const timeline = await getWorkItemEvents(workItemId);
    assert.equal(
      timeline.some((event) => event.eventType === "work_item.observed"),
      false,
      "Control event for another entity must not leak into this work item timeline"
    );
  });

  await t.test("attachment mutation contract accepts the form payload and persists a readable round-trip", async () => {
    const formPayload = {
      entityType: "work_item",
      entityId: workItemId,
      title: secondAttachmentTitle,
      fileUrl: secondAttachmentUrl,
      mimeType: "application/pdf",
      returnTo: `/work-items/${workItemId}`,
    };

    const parsed = CreateEntityAttachmentInputSchema.parse(formPayload);
    assert.equal(parsed.title, secondAttachmentTitle);
    assert.equal(parsed.fileUrl, secondAttachmentUrl);

    await db.insert(entityAttachments).values({
      entityType: parsed.entityType,
      entityId: parsed.entityId,
      title: parsed.title,
      fileUrl: parsed.fileUrl,
      mimeType: parsed.mimeType,
      createdById: userId,
    });

    const attachments = await getEntityAttachments("work_item", workItemId);
    const second = attachments.find((attachment) => attachment.title === secondAttachmentTitle);
    assert.ok(second, "Inserted attachment must be readable by the 'Anexos' panel read path");
    assert.equal(second.fileUrl, secondAttachmentUrl);
  });

  await t.test("operator journey stays workspace-scoped and preserves WorkspaceContext without builder fallback", async () => {
    const context = await resolveWorkspaceContext({
      workspaceId,
      workspaceKey,
      source: "ui",
      actor: { type: "user", id: userId, name: "Tecnico E2E 039" },
      environmentMode: "real",
    });

    assert.equal(context.workspaceId, workspaceId, "Selected workspace must be preserved");
    assert.equal(context.workspaceKey, workspaceKey, "Must not silently fall back to sala-tecnica");
    assert.equal(context.environmentMode, "real");
    assert.equal(context.source, "ui");
    assert.equal(context.actor.type, "user");

    const typedContext: WorkspaceContext = context;
    assert.equal(typedContext.workspaceId, workspaceId);
    assert.equal(typedContext.actor.type, "user");
  });
});
