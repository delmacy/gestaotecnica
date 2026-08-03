"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { workspaces } from "@/db/runtime/schema/workspace";
import { events as eventLogs } from "@/db/runtime/schema/workflow";
import { queueItems, slaPolicies, workspaceQueues } from "@/db/schema";
import { requireCurrentUser } from "@/modules/auth/authorization";
import { ensureActiveWorkspaceConfig } from "@/platform/workspaces/bootstrap";
import { z } from "zod";
import { and, eq, inArray } from "drizzle-orm";
import { CreateQueueItemSchema, UpdateQueueItemSchema } from "./contracts/queue-item";
import { CreateSlaPolicySchema } from "./contracts/sla-policy";
import type { QueueAuditEventType } from "./contracts/queue-audit";


function readRequiredText(formData: FormData, field: string) {
  const value = String(formData.get(field) ?? "").trim();
  if (!value) throw new Error(`Campo obrigatorio ausente: ${field}`);
  return value;
}

function readOptionalNumber(formData: FormData, field: string, fallback: number) {
  const value = Number(formData.get(field) ?? fallback);
  return Number.isFinite(value) ? value : fallback;
}

function queueItemScopedToWorkspace(workspaceId: string) {
  return inArray(
    queueItems.queueId,
    getDb()
      .select({ id: workspaceQueues.id })
      .from(workspaceQueues)
      .where(eq(workspaceQueues.workspaceId, workspaceId)),
  );
}

async function requireQueueInWorkspace(workspaceId: string, queueId: string) {
  const [queue] = await getDb()
    .select({ id: workspaceQueues.id })
    .from(workspaceQueues)
    .where(
      and(
        eq(workspaceQueues.id, queueId),
        eq(workspaceQueues.workspaceId, workspaceId),
      ),
    )
    .limit(1);

  if (!queue) {
    throw new Error("Fila nao pertence ao workspace selecionado.");
  }
}

async function recordQueueAuditEvent(
  eventType: QueueAuditEventType,
  workspaceId: string,
  actorId: string,
  entityType: string,
  entityId: string | undefined,
  payload: Record<string, unknown>,
) {
  await getDb().insert(eventLogs).values({
    workspaceId,
    eventType,
    entityType,
    entityId,
    actorType: "user",
    actorId,
    source: "ui",
    payload: {
      ...payload,
      platform: {
        actorType: "user",
        actorId,
        source: "ui",
      },
    },
  });
}

export async function createQueueItem(formData: FormData) {
  const user = await requireCurrentUser();
  const workspace = await ensureActiveWorkspaceConfig();
  const data = Object.fromEntries(formData.entries());
  const parsed = CreateQueueItemSchema.safeParse(data);

  if (!parsed.success) {
    throw new Error("Invalid form data");
  }

  await requireQueueInWorkspace(workspace.id, parsed.data.queueId);

  const values = {
    ...parsed.data,
    status: "open",
    priority: "medium",
  };

  // Enforce server-side defaults to prevent over-posting
  const [row] = await getDb()
    .insert(queueItems)
    .values(values)
    .returning({ id: queueItems.id });

  if (row) {
    await recordQueueAuditEvent(
      "queue_item.created",
      workspace.id,
      user.userId,
      parsed.data.entityType,
      row.id,
      {
        entityId: parsed.data.entityId,
        status: values.status,
        priority: values.priority,
      },
    );
  }

  revalidatePath("/admin/queues");
}

export async function deleteQueueItem(formData: FormData) {
  // Discard draft is modeled as hard deletion or cancellation;
  // without a Delete schema, we can just delete from queueItems.
  const user = await requireCurrentUser();
  const workspace = await ensureActiveWorkspaceConfig();

  const id = readRequiredText(formData, "id");

  const [existing] = await getDb()
    .select({
      entityType: queueItems.entityType,
      entityId: queueItems.entityId,
      status: queueItems.status,
    })
    .from(queueItems)
    .where(
      and(
        eq(queueItems.id, id),
        queueItemScopedToWorkspace(workspace.id),
      ),
    )
    .limit(1);

  await getDb()
    .delete(queueItems)
    .where(
      and(
        eq(queueItems.id, id),
        queueItemScopedToWorkspace(workspace.id),
      ),
    );

  if (existing) {
    await recordQueueAuditEvent(
      "queue_item.deleted",
      workspace.id,
      user.userId,
      existing.entityType,
      id,
      {
        entityId: existing.entityId,
        status: existing.status,
      },
    );
  }

  revalidatePath("/admin/queues");
  revalidatePath("/search");
}

export async function updateQueueItem(formData: FormData) {
  const user = await requireCurrentUser();
  // Preserve workspace context
  const workspace = await ensureActiveWorkspaceConfig();

  const id = readRequiredText(formData, "id");
  const data = Object.fromEntries(formData.entries());

  // Remove id from payload before passing to partial schema validation
  const { id: _removedId, ...payloadToValidate } = data;
  const parsed = UpdateQueueItemSchema.safeParse(payloadToValidate);

  if (!parsed.success) {
    throw new Error("Invalid form data");
  }

  const [existing] = await getDb()
    .select({
      entityType: queueItems.entityType,
      entityId: queueItems.entityId,
      status: queueItems.status,
    })
    .from(queueItems)
    .where(
      and(
        eq(queueItems.id, id),
        queueItemScopedToWorkspace(workspace.id),
      ),
    )
    .limit(1);

  await getDb()
    .update(queueItems)
    .set({
      ...parsed.data,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(queueItems.id, id),
        queueItemScopedToWorkspace(workspace.id),
      ),
    );

  if (existing) {
    await recordQueueAuditEvent(
      "queue_item.updated",
      workspace.id,
      user.userId,
      existing.entityType,
      id,
      {
        entityId: existing.entityId,
        statusFrom: existing.status,
        statusTo: parsed.data.status,
      },
    );
  }

  revalidatePath("/admin/queues");
  revalidatePath("/search");
}

export async function recoverQueueItem(formData: FormData) {
  const user = await requireCurrentUser();
  const workspace = await ensureActiveWorkspaceConfig();

  const id = readRequiredText(formData, "id");

  const [existing] = await getDb()
    .select({
      entityType: queueItems.entityType,
      entityId: queueItems.entityId,
      status: queueItems.status,
    })
    .from(queueItems)
    .where(
      and(
        eq(queueItems.id, id),
        queueItemScopedToWorkspace(workspace.id),
      ),
    )
    .limit(1);

  await getDb()
    .update(queueItems)
    .set({
      status: "open",
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(queueItems.id, id),
        queueItemScopedToWorkspace(workspace.id),
      ),
    );

  if (existing) {
    await recordQueueAuditEvent(
      "queue_item.recovered",
      workspace.id,
      user.userId,
      existing.entityType,
      id,
      {
        entityId: existing.entityId,
        statusFrom: existing.status,
        statusTo: "open",
      },
    );
  }

  revalidatePath("/admin/queues");
  revalidatePath("/search");
}

export async function createSlaPolicy(formData: FormData) {
  const user = await requireCurrentUser();
  const workspace = await ensureActiveWorkspaceConfig();
  const data = Object.fromEntries(formData.entries());
  const parsed = CreateSlaPolicySchema.safeParse(data);

  if (!parsed.success) {
    throw new Error("Invalid form data");
  }

  const { key, label, targetEntityType, responseMinutes, resolutionMinutes } = parsed.data;

  await getDb()
    .insert(slaPolicies)
    .values({
      workspaceId: workspace.id,
      key,
      label,
      targetEntityType,
      responseMinutes,
      resolutionMinutes,
    })
    .onConflictDoUpdate({
      target: [slaPolicies.workspaceId, slaPolicies.key],
      set: {
        label,
        targetEntityType,
        responseMinutes,
        resolutionMinutes,
        isActive: true,
        updatedAt: new Date(),
      },
    });

  await recordQueueAuditEvent(
    "sla_policy.upserted",
    workspace.id,
    user.userId,
    "sla_policy",
    undefined,
    {
      key,
      label,
      targetEntityType,
    },
  );

  revalidatePath("/admin/queues");
}
