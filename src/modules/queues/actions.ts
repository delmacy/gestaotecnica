"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { queueItems, slaPolicies } from "@/db/schema";
import { ensureActiveWorkspaceConfig } from "@/platform/workspaces/bootstrap";

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
  await getDb().insert(queueItems).values({
    queueId: readRequiredText(formData, "queueId"),
    entityType: readRequiredText(formData, "entityType"),
    entityId: readRequiredText(formData, "entityId"),
    status: "open",
    priority: "medium",
  });

  revalidatePath("/admin/queues");
}

export async function createSlaPolicy(formData: FormData) {
  const workspace = await ensureActiveWorkspaceConfig();
  const key = readRequiredText(formData, "key");
  const label = readRequiredText(formData, "label");
  const targetEntityType = readRequiredText(formData, "targetEntityType");

  await getDb()
    .insert(slaPolicies)
    .values({
      workspaceId: workspace.id,
      key,
      label,
      targetEntityType,
      responseMinutes: readOptionalNumber(formData, "responseMinutes", 240),
      resolutionMinutes: readOptionalNumber(formData, "resolutionMinutes", 1440),
    })
    .onConflictDoUpdate({
      target: [slaPolicies.workspaceId, slaPolicies.key],
      set: {
        label,
        targetEntityType,
        responseMinutes: readOptionalNumber(formData, "responseMinutes", 240),
        resolutionMinutes: readOptionalNumber(formData, "resolutionMinutes", 1440),
        isActive: true,
        updatedAt: new Date(),
      },
    });

  revalidatePath("/admin/queues");
}
