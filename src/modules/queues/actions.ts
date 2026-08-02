"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { workspaces } from "@/db/runtime/schema/workspace";
import { queueItems, slaPolicies } from "@/db/schema";
import { ensureActiveWorkspaceConfig } from "@/platform/workspaces/bootstrap";
import { z } from "zod";
import { CreateQueueItemSchema } from "./contracts/queue-item";
import { CreateSlaPolicySchema } from "./contracts/sla-policy";


function readRequiredText(formData: FormData, field: string) {
  const value = String(formData.get(field) ?? "").trim();
  if (!value) throw new Error(`Campo obrigatorio ausente: ${field}`);
  return value;
}

function readOptionalNumber(formData: FormData, field: string, fallback: number) {
  const value = Number(formData.get(field) ?? fallback);
  return Number.isFinite(value) ? value : fallback;
}

export async function createQueueItem(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const parsed = CreateQueueItemSchema.safeParse(data);

  if (!parsed.success) {
    throw new Error("Invalid form data");
  }

  // Enforce server-side defaults to prevent over-posting
  await getDb().insert(queueItems).values({
    ...parsed.data,
    status: "open",
    priority: "medium",
  });

  revalidatePath("/admin/queues");
}

export async function createSlaPolicy(formData: FormData) {
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

  revalidatePath("/admin/queues");
}
